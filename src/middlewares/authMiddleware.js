import jwt from "jsonwebtoken";
import { httpError } from "./errorHandler.js";
import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";
import collection from "../config/collection.js";

export const verifyToken = (req, res, next) => {
  const authorization = req.headers.authorization?.split(" ") ?? [];
  if (authorization.length !== 2 || authorization[0] !== "Bearer" || !authorization[1]) {
    return next(httpError("A Bearer token is required", 401));
  }
  try {
    const decoded = jwt.verify(authorization[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    next(httpError("Invalid or expired token", 403));
  }
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, (error) => {
    if (error) return next(error);
    if (req.user.role !== "Admin") {
      return next(httpError("Admin access required", 403));
    }
    next();
  });
};

export const verifyUser = verifyToken;

export const verifyOwnership = async (req, res, next) => {
  const user = await getDB()
    .collection(collection.USERS_COLLECTION)
    .findOne({ _id: new ObjectId(req.params.id) }, { projection: { userId: 1 } });

  if (!user) return next(httpError("User not found", 404));
  if (user.userId !== req.user.id) {
    return next(httpError("You can only access your own account", 403));
  }

  next();
};
