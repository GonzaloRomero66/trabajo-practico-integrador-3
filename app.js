import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./src/config/database.js";
import userRoutes from "./src/routes/user.routes.js";
import categoriesRoutes from "./src/routes/category.routes.js";
import eventRoutes from "./src/routes/event.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";
dotenv.config();

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

await connectDB();

app.listen(PORT, () => {
  console.log(`El servidor esta en funcionamiento en el puerto ${PORT}`);
});
