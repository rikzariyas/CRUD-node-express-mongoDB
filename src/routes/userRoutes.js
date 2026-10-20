import express from "express"
import {  deleteUser, getAllUsers, nameUpdate, replaceUser } from "../controllers/userController.js";
import { verifyAdmin, verifyUser } from "../middlewares/authMiddleware.js";


const userRoutes = express.Router({mergeParams:true})

// userRoutes.get("/",(req,res)=>{
//     res.send ("heloo")
// })
userRoutes.get("/", verifyAdmin ,getAllUsers)
userRoutes.patch("/:id", verifyUser ,nameUpdate)
userRoutes.put("/:id", verifyAdmin ,replaceUser)
userRoutes.delete("/:id", verifyAdmin ,deleteUser)

export default userRoutes