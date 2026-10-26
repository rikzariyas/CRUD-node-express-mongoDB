import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler, httpError } from "./middlewares/errorHandler.js";

dotenv.config();
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET must be configured");
}
if (!process.env.ADMIN_USERNAME?.trim() || !process.env.ADMIN_PASSWORD) {
  throw new Error("ADMIN_USERNAME and ADMIN_PASSWORD must be configured");
}

await connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "The server is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);

app.use((req, res, next) => next(httpError("Route not found", 404)));
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
