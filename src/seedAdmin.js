import bcrypt from "bcrypt";
import collection from "./config/collection.js";
import { closeDB, connectDB } from "./config/db.js";

const username = process.env.ADMIN_USERNAME?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;

if (!username || !password) {
  throw new Error("ADMIN_USERNAME and ADMIN_PASSWORD must be configured");
}
if (Buffer.byteLength(password, "utf8") > 72) {
  throw new Error("ADMIN_PASSWORD must be at most 72 UTF-8 bytes");
}

try {
  const db = await connectDB();
  const now = new Date();

  await db.collection(collection.ADMIN_COLLECTION).updateOne(
    { _id: "primary" },
    {
      $set: {
        username,
        password: await bcrypt.hash(password, 12),
        role: "Admin",
        updatedAt: now,
      },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true },
  );

  console.log("Admin account seeded");
} finally {
  await closeDB();
}
