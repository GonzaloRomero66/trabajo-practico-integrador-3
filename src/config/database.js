import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Conexion a MongoDB exitosa");
  } catch (error) {
    console.log("Error al conectar con MongoDB:", error.message);
    process.exit(1);
  }
};
