import express from "express";
import { verifyAdmin } from "../middlewares/authMiddleware.js";
import { deleteUser, getAllUsers, replaceUser } from "../controllers/userController.js";
import { validate } from "../middlewares/validate.js";
import { deleteUserSchema, replaceUserSchema } from "../validators/userValidators.js";
import { adminLogin } from "../controllers/authController.js";
import { adminLoginValidation } from "../validators/authValidators.js";

const adminRoutes = express.Router();

adminRoutes.post("/login", validate(adminLoginValidation), adminLogin);
adminRoutes.get("/users", verifyAdmin, getAllUsers);
adminRoutes.put("/users/:id", verifyAdmin, validate(replaceUserSchema), replaceUser);
adminRoutes.delete("/users/:id", verifyAdmin, validate(deleteUserSchema), deleteUser);

export default adminRoutes;
