/* ::::::::::::::::::::::::::::::::::::::::::::
                Minimum Setup
::::::::::::::::::::::::::::::::::::::::::::::*/

const express = require('express')
var cors = require('cors')
const { MongoClient } = require('mongodb');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;
const { response } = require('express');

const app = express()
const port = process.env.PORT || 5000;

//middle ware
app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cexwu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


/* ::::::::::::::::::::::::::::::::::::::::::::
                Completed Setup
::::::::::::::::::::::::::::::::::::::::::::::*/





async function run() {
    try {

      await client.connect();
      console.log("Connected successfully");
      const database = client.db("wesocial");

    /* Collections ______________________*/

    /* Users */
    const userListCollection = database.collection("userList");

    /* Community Articles */
    const communityPostsCollection = database.collection("communityPosts");
    const communityPostsReplyCollection = database.collection("communityPostsReply");

    /* User Status */
    const userStatusCollection = database.collection("userStatus");
    const userStatusRepliesCollection = database.collection("userStatusReplies");


/* ____________________________________________________________________________*/

    /* ::::::::::::::::::::::::::::::::::::::::::::
                    Post Users list on server
    ::::::::::::::::::::::::::::::::::::::::::::::*/

    app.post('/userList', async(req, res) =>{
    const userList = req.body;
      const result = await userListCollection.insertOne(userList);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.json(result)
    })

    /* ::::::::::::::::::::::::::::::::::::::::::::
                get Users list from server
    ::::::::::::::::::::::::::::::::::::::::::::::*/
    app.get('/userList', async(req, res) => {
        const cursor = userListCollection.find({});
        const userList = await cursor.toArray();
        res.send(userList);
    });

/* _______________________________________________________________________________*/

    /* ::::::::::::::::::::::::::::::::::::::::::::
                    Post Articles on server
    ::::::::::::::::::::::::::::::::::::::::::::::*/
    app.post('/communityPosts', async(req, res) =>{
        const communityPosts = req.body;
      const result = await communityPostsCollection.insertOne(communityPosts);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.json(result)
    })




    /* ::::::::::::::::::::::::::::::::::::::::::::
                get Articles from server
    ::::::::::::::::::::::::::::::::::::::::::::::*/
    app.get('/communityPosts', async(req, res) => {

        const cursor = communityPostsCollection.find({});
        const communityPosts = await cursor.toArray();
        res.send(communityPosts);

    });

/* ______________________________________________________________ */



    /* ::::::::::::::::::::::::::::::::::::::::::::
                    Post replies on server
    ::::::::::::::::::::::::::::::::::::::::::::::*/
    app.post('/communityPostsReply', async(req, res) =>{
        const communityPostsReply = req.body;
        const result = await communityPostsReplyCollection.insertOne(communityPostsReply);
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
        res.json(result)
    })



    /* ::::::::::::::::::::::::::::::::::::::::::::
            get replies from server
    ::::::::::::::::::::::::::::::::::::::::::::::*/
    app.get('/communityPostsReply', async(req, res) => {

        const cursor = communityPostsReplyCollection.find({});
        const communityPostsReply = await cursor.toArray();
        res.send(communityPostsReply);

    });

    /* ::::::::::::::::::::::::::::::::::::::::::::
            get single data from server
    ::::::::::::::::::::::::::::::::::::::::::::::*/
    app.get('/communityPosts/:articleID', async (req, res) => {
        const articleID = req.params.articleID;
        console.log(articleID);
        const query = {_id:ObjectId(articleID)};
        const service = await communityPostsCollection.findOne(query);
        res.json(service);
    })
    



/* ______________________________________________________________ */




    /* ::::::::::::::::::::::::::::::::::::::::::::
                    Post Status on server
    ::::::::::::::::::::::::::::::::::::::::::::::*/
    app.post('/userStatus', async(req, res) =>{
        const userStatus = req.body;
    //   console.log("hit the poost api", service);

      const result = await userStatusCollection.insertOne(userStatus);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.json(result)
    })




    /* ::::::::::::::::::::::::::::::::::::::::::::
                get Status from server
    ::::::::::::::::::::::::::::::::::::::::::::::*/
    app.get('/userStatus', async(req, res) => {

        const cursor = userStatusCollection.find({});
        const userStatus = await cursor.toArray();
        res.send(userStatus);

    });

/* ______________________________________________________________ */



    /* ::::::::::::::::::::::::::::::::::::::::::::
            Post Status replies on server
    ::::::::::::::::::::::::::::::::::::::::::::::*/
    app.post('/userStatusReplies', async(req, res) =>{
        const userStatusReplies = req.body;
        const result = await userStatusRepliesCollection.insertOne(userStatusReplies);
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
        res.json(result)
    })



    /* ::::::::::::::::::::::::::::::::::::::::::::
            get Status replies from server
    ::::::::::::::::::::::::::::::::::::::::::::::*/
    app.get('/userStatusReplies', async(req, res) => {

        const cursor = userStatusRepliesCollection.find({});
        const userStatusReplies = await cursor.toArray();
        res.send(userStatusReplies);

    });

/* _________________________________________________________________ */





    


/* ::::::::::::::::::::::::::::::::::::::::::::
            delete data from server
::::::::::::::::::::::::::::::::::::::::::::::*/
    app.delete('/services/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id:ObjectId(id)};
        const service = await servicesCollection.deleteOne(query);
        res.json(service);
    })




    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);




app.get('/', (req, res) => {
    res.send("WeSocial Server is running")
})

app.listen(port , () => {
    console.log("got port successfully", port);
})