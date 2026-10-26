import bcrypt from "bcrypt";
import { getDB } from "../config/db.js";
import collection from "../config/collection.js";
import jwt from "jsonwebtoken";
import { v7 as uuidv7 } from "uuid";
import { httpError } from "../middlewares/errorHandler.js";

export const adminLogin = async (req, res) => {
  const configuredUsername = process.env.ADMIN_USERNAME?.trim().toLowerCase();
  const configuredPassword = process.env.ADMIN_PASSWORD;
  const { username, password } = req.body;

  if (username !== configuredUsername || password !== configuredPassword) {
    throw httpError("Invalid username or password", 401);
  }

  const token = jwt.sign({ id: "primary", username: configuredUsername, role: "Admin" }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.status(200).json({ status: "OK", message: "Login successful", token });
};
export const registerUser = async (req, res) => {
  const { name, age, email, address, password } = req.body;
  const normalizedEmail = String(email).trim().toLowerCase();
  const now = new Date();
  const result = await getDB()
    .collection(collection.USERS_COLLECTION)
    .insertOne({
      userId: uuidv7(),
      name,
      age,
      address,
      email: normalizedEmail,
      role: "user",
      password: await bcrypt.hash(password, 12),
      createdAt: now,
      updatedAt: now,
    });

  res.status(201).json({ status: "OK", message: "User registered successfully", id: result.insertedId.toString() });
};

export const userLogin = async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = String(email).trim().toLowerCase();
  const user = await getDB()
    .collection(collection.USERS_COLLECTION)
    .findOne({ email: normalizedEmail }, { collation: { locale: "en", strength: 2 } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw httpError("Invalid email or password", 401);
  }

  const token = jwt.sign(
    { id: user.userId, email: user.email, name: user.name, role: "user" },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.status(200).json({ status: "OK", message: "Login successful", token, id: user._id.toString() });
};
