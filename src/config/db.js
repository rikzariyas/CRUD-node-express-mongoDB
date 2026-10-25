import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import collection from "./collection.js";

dotenv.config();

let client;
let db;

async function removeDuplicateEmails(usersCollection) {
  const duplicates = await usersCollection
    .aggregate([
      { $match: { email: { $type: "string", $ne: "" } } },
      { $addFields: { normalizedEmail: { $toLower: "$email" } } },
      { $group: { _id: "$normalizedEmail", docs: { $push: "$$ROOT" }, count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } },
    ])
    .toArray();

  for (const duplicate of duplicates) {
    const sortedDocs = [...duplicate.docs].sort((a, b) => {
      const aTime = new Date(a.createdAt ?? 0).getTime();
      const bTime = new Date(b.createdAt ?? 0).getTime();

      if (aTime !== bTime) return aTime - bTime;
      return String(a._id).localeCompare(String(b._id));
    });

    const deleteIds = sortedDocs.slice(1).map(({ _id }) => _id);
    if (!deleteIds.length) continue;

    await usersCollection.deleteMany({ _id: { $in: deleteIds } });
    console.warn(
      `Removed ${deleteIds.length} duplicate user records for email "${duplicate._id}" and kept the earliest record.`,
    );
  }
}

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

    await removeDuplicateEmails(usersCollection);
    await usersCollection.createIndex({ email: 1 }, { unique: true });

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
