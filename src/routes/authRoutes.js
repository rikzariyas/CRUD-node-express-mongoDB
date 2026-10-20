import express from "express"
import { registerUser, adminLogin, userLogin} from "../controllers/authController.js"
import { getAllUsers } from "../controllers/userController.js";

const authRoutes = express.Router({mergeParams:true})


// authRoutes.post("/login", adminLogin)
authRoutes.post("/login", userLogin)
authRoutes.post("/register",registerUser)

export default authRoutes