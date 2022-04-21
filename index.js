require("dotenv").config();
console.log(process.env.DB_USERNAME);
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// use middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Running my crud mongo server");
});

// mongodb database
// user: dbuser2
//password: P9vigPxKtecwKswx

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.hyb1n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const userCollection = client.db("foodExpress").collection("user");

    app.get("/user", async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });

    //
    app.get("/user/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: ObjectId(id) };
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    // POST user : add a new user
    app.post("/user", async (req, res) => {
      const newUser = req.body;
      console.log("Adding new user", newUser);
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });

    //update user
    app.put("/user/:id", async (req, res) => {
      const { id } = req.params;
      console.log(id);
      const updatedUser = req.body;
      const filter = { _id: ObjectId(id) };
      const option = { upsert: true };
      const updatedDoc = {
        $set: {
          name: updatedUser.name,
          email: updatedUser.email,
        },
      };
      const result = await userCollection.updateOne(filter, updatedDoc, option);

      res.send(result);
    });

    // delete a user
    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
    //
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("listening on port ", port, ".....");
});
