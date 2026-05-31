const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
dotenv.config();

const uri = process.env.MONGODB_URI;
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    
    await client.connect();

    const db = client.db("idea-vault")
    const ideaCollection = db.collection("ideas")

    app.post('/addIdea', async (req, res) => {
      
      try{

      
      const idea = req.body
      console.log("Received:", idea);
      const result = await ideaCollection.insertOne(idea)

      res.send(result)
    }catch (error) {

    console.log(error);

    res.status(500).send({ error: error.message });
    }
  });
  app.get('/ideas', async (req, res) => {
    const result = await ideaCollection.find().toArray();
    res.send(result);
  });
  
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
    // await client.close();
  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('server is running totally fine!!!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});