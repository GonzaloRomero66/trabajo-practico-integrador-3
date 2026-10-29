import { matchedData } from "express-validator";
import userModel from "../models/user.model.js";
export const GetAllUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.json(users);
  } catch (error) {
    res.status(404).json({ message: "Error en traer todos los usuarios" });
  }
};

export const GetUserId = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener al usuario" });
  }
};

export const CreateUser = async (req, res) => {
  try {
    console.log("Body:", req.body);
    console.log("Matched:", matchedData(req, { locations: ["body"] }));
    const data = matchedData(req, { locations: ["body"] });
    const user = await userModel.create(data);
    res.json(201).json({ message: "Usuario creado correctamente", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al crear el usuario" });
  }
};

export const UpdateUser = async (req, res) => {
  try {
    const data = matchedData(req, { locations: ["body"] });
    const user = await userModel.findByIdAndUpdate(
      req.params.id,
      data,
      {
        returnDocument: "after",
      },
      {
        runValidators: true,
      },
    );
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res
      .status(200)
      .json({ message: "Usuario actualizado correctamente", user });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el usuario" });
  }
};

export const DeleteUser = async (req, res) => {
  try {
    const user = await userModel.findByIdAndUpdate(
      req.params.id,
      { deleted: true },
      { returnDocument: "after" },
    );
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el usuario" });
  }
};
