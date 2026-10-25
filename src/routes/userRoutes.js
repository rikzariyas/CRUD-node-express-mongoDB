import express from "express";
import { nameUpdate, replaceUser } from "../controllers/userController.js";
import { verifyOwnership, verifyUser } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { replaceUserSchema, updateNameSchema } from "../validators/userValidators.js";
import { userLogin } from "../controllers/authController.js";
import { loginValidation } from "../validators/authValidators.js";

const userRoutes = express.Router();

userRoutes.post("/login", validate(loginValidation), userLogin);
userRoutes.patch("/:id", verifyUser, validate(updateNameSchema), verifyOwnership, nameUpdate);
userRoutes.put("/:id", verifyUser, validate(replaceUserSchema), verifyOwnership, replaceUser);

export default userRoutes;
