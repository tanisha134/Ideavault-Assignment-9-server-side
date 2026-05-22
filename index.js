const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {

    const ideasCollection = client
      .db("ideaVaultDB")
      .collection("ideas");

    // POST IDEA
    app.post("/ideas", async (req, res) => {

      const newIdea = req.body;

      const result = await ideasCollection.insertOne(newIdea);

      res.send(result);
    });

    // GET IDEAS
    app.get("/ideas", async (req, res) => {

      const result = await ideasCollection.find().toArray();

      res.send(result);
    });

    console.log("MongoDB Connected");
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("IdeaVault Server Running");
});

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});