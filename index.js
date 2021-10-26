/* ::::::::::::::::::::::::::::::::::::::::::::
                Minimum Setup
::::::::::::::::::::::::::::::::::::::::::::::*/

const express = require('express')
var cors = require('cors')
const { MongoClient } = require('mongodb');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;

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
      console.log("Connected to database");
      const database = client.db("carMechanic");
      const servicesCollection = database.collection("servicesCollection");



/* ::::::::::::::::::::::::::::::::::::::::::::
                Post Api on server
::::::::::::::::::::::::::::::::::::::::::::::*/
    app.post('/services', async(req, res) =>{
        const service = req.body;
    //   console.log("hit the poost api", service);

      const result = await servicesCollection.insertOne(service);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.json(result)
    })




/* ::::::::::::::::::::::::::::::::::::::::::::
            get data from server
::::::::::::::::::::::::::::::::::::::::::::::*/
    app.get('/services', async(req, res) => {

        const cursor = servicesCollection.find({});
        const services = await cursor.toArray();
        res.send(services);

    });

/* ::::::::::::::::::::::::::::::::::::::::::::
            get single data from server
::::::::::::::::::::::::::::::::::::::::::::::*/
    app.get('/services/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id:ObjectId(id)};
        const service = await servicesCollection.findOne(query);
        res.json(service);
    })


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
    res.send("Genius Server is running")
})

app.listen(port , () => {
    console.log("got port successfully", port);
})