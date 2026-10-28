import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();

app.use(express.json());

try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("El servidor esta en funcionamiento con mongoose");
  console.log(mongoose.connection.readyState);
} catch {
  console.log("Error en conectar la base de datos");
}

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("El servidor esta en perfecto funcionamiento");
});
