const { MongoClient } = require("mongodb");

require("dotenv").config();

const client = new MongoClient(process.env.MONGO_URI);

async function run() {
  try {
    await client.connect();

    console.log("MongoDB connection successful!");

    await client.db("admin").command({ ping: 1 });

    console.log("MongoDB ping successful!");
  } catch (error) {
    console.error("MongoDB connection failed:");
    console.error(error);
  } finally {
    await client.close();
  }
}

run();