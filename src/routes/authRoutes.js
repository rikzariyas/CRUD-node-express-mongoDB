import express from "express"
import { registerUser, adminLogin, userLogin} from "../controllers/authController.js"
import { getAllUsers } from "../controllers/userController.js";
import { validate } from "../middlewares/validate.js";
import { registerValidation } from "../validators/authValidators.js";

const authRoutes = express.Router({mergeParams:true})


// authRoutes.post("/login", adminLogin)
authRoutes.post("/login", userLogin)
authRoutes.post("/register",validate(registerValidation),registerUser)

export default authRoutes