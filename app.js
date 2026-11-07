import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import userRoutes from "./src/routes/user.routes.js";
import categoriesRoutes from "./src/routes/category.routes.js";
import eventRoutes from "./src/routes/event.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

try {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("El servidor esta en funcionamiento con mongoose");
  console.log(mongoose.connection.readyState);
} catch {
  console.log("Error en conectar la base de datos");
}

const PORT = process.env.PORT;

app.use("/api/users", userRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log("El servidor esta en perfecto funcionamiento");
});
