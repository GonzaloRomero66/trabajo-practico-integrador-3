import { matchedData } from "express-validator";
import userModel from "../models/user.model.js";
import eventModel from "../models/event.model.js";
import { hashPassword } from "../helpers/bcrypt.js";
import { flattenObject } from "../helpers/flatten.js";

export const GetAllUsers = async (req, res, next) => {
  try {
    const users = await userModel.find({ deletedAt: null }).populate("events");
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const GetUserId = async (req, res, next) => {
  try {
    const user = await userModel
      .findOne({ _id: req.params.id, deletedAt: null })
      .populate("events");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const UpdateUser = async (req, res, next) => {
  try {
    const data = matchedData(req, { locations: ["body"] });
    const user = await userModel.findOne({
      _id: req.params.id,
      deletedAt: null,
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (data.password) {
      data.password = await hashPassword(data.password);
    }

    user.set(flattenObject(data));
    await user.save();

    res
      .status(200)
      .json({ message: "Usuario actualizado correctamente", user });
  } catch (error) {
    next(error);
  }
};

export const DeleteUser = async (req, res, next) => {
  try {
    const user = await userModel.findOne({
      _id: req.params.id,
      deletedAt: null,
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // eliminacion logica
    user.deletedAt = new Date();
    await user.save();

    // eliminacion en cascada de los eventos que organizaba
    const { deletedCount } = await eventModel.deleteMany({
      organizer: user._id,
    });

    res.status(200).json({
      message: "Usuario eliminado correctamente",
      eventosEliminados: deletedCount,
    });
  } catch (error) {
    next(error);
  }
};
