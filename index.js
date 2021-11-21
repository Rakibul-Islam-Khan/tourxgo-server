const express = require('express')
const app = express()
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const cors = require('cors')
const port = process.env.PORT || 5000


app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rirnk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
  try {
    await client.connect();
    const database = client.db("packageCollection");
    const packageCollection = database.collection("package");

    const databaseTwo = client.db("bookingCollection");
    const bookingCollection = databaseTwo.collection("booking");


    //   get api package
    app.get('/package', async (req, res) => {
      const cursor = packageCollection.find({});
      const packages = await cursor.toArray();
      res.send(packages);
    });
    // get api package by id
    app.get('/package/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) };
      const package = await packageCollection.findOne(query);
      res.json(package);
    })
    // get api booking
    app.get('/booking', async (req, res) => {
      const cursor = bookingCollection.find({});
      const bookings = await cursor.toArray();
      res.send(bookings);
    });
    // post api package
        app.post('/package', async (req, res) => {
          const package = req.body
          const result = await packageCollection.insertOne(package)
          res.json(result)
        })
    // post api booking detailed
    app.post("/booking", async(req, res) => {
      const booking = req.body
      const result = await bookingCollection.insertOne(booking)
      res.json(result)
    })
    // delete api booking
    app.delete("/booking/:id", async(req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) };
      const result = await bookingCollection.deleteOne(query)
      res.json(result)
    })
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);
app.get('/', (req, res) => {
  res.send('hello world!!!')
})
app.listen(port)
