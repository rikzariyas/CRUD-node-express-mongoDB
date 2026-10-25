import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import collection from "./collection.js";

dotenv.config();

let client;
let db;

async function connectDB() {
  if (db) return db;

  const { MONGODB_URI, DATABASE } = process.env;
  if (!MONGODB_URI || !DATABASE) {
    throw new Error("MONGODB_URI and DATABASE must be configured");
  }

  const newClient = new MongoClient(MONGODB_URI);
  try {
    await newClient.connect();
    const newDB = newClient.db(DATABASE);
    await newDB.collection(collection.USERS_COLLECTION).createIndex({ email: 1 }, { unique: true });
    client = newClient;
    db = newDB;
  } catch (error) {
    await newClient.close();
    if (error.code === 11000) {
      throw new Error(
        "Cannot create the unique user email index because duplicate emails already exist. Resolve duplicates in the users collection and restart.",
        { cause: error },
      );
    }
    throw error;
  }

  console.log("MongoDB connected");
  return db;
}

function getDB() {
  if (!db) throw new Error("Database not connected. Call connectDB() first.");
  return db;
}

async function closeDB() {
  if (!client) return;
  await client.close();
  client = undefined;
  db = undefined;
}

export { closeDB, connectDB, getDB };
