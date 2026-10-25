import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import collection from "../config/collection.js";
import { getDB } from "../config/db.js";
import { httpError } from "../middlewares/errorHandler.js";

export const getAllUsers = async (req, res) => {
  const users = await getDB()
    .collection(collection.USERS_COLLECTION)
    .find({}, { projection: { password: 0 } })
    .toArray();
  res.status(200).json({ status: "OK", data: users });
};

export const nameUpdate = async (req, res) => {
  const result = await getDB()
    .collection(collection.USERS_COLLECTION)
    .updateOne(userFilter(req, req.params.id), {
      $set: { name: req.body.name, updatedAt: new Date() },
    });
  if (!result.matchedCount) {
    throw httpError("User not found", 404);
  }

  res.status(200).json({ status: "OK", data: result });
};

export const replaceUser = async (req, res) => {
  const { name, age, address, email, password } = req.body;
  const result = await getDB()
    .collection(collection.USERS_COLLECTION)
    .updateOne(userFilter(req, req.params.id), {
      $set: {
        name,
        age,
        address,
        email,
        password: await bcrypt.hash(password, 12),
        updatedAt: new Date(),
      },
    });
  if (!result.matchedCount) {
    throw httpError("User not found", 404);
  }

  res.status(200).json({ status: "OK", data: result });
};

export const deleteUser = async (req, res) => {
  const result = await getDB().collection(collection.USERS_COLLECTION).deleteOne(userFilter(req, req.params.id));
  if (!result.deletedCount) {
    throw httpError("User not found", 404);
  }

  res.status(200).json({ status: "OK", data: result });
};

const userFilter = (req, id) => {
  const filter = { _id: new ObjectId(id) };
  return req.user.role === "Admin" ? filter : { ...filter, userId: req.user.id };
};
