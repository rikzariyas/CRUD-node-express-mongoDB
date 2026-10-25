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
    const usersCollection = newDB.collection(collection.USERS_COLLECTION);

    await usersCollection.createIndex(
      { email: 1 },
      {
        name: "user_email_unique_case_insensitive",
        unique: true,
        collation: { locale: "en", strength: 2 },
        partialFilterExpression: { email: { $type: "string", $gt: "" } },
      },
    );

    client = newClient;
    db = newDB;
  } catch (error) {
    await newClient.close();
    if (error.code === 11000) {
      throw new Error(
        "Cannot enforce unique user emails because duplicate email addresses already exist (email matching is case-insensitive). Resolve duplicates in the users collection and restart; no records were deleted.",
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
