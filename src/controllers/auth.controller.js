import { matchedData } from "express-validator";
import { generateToken } from "../helpers/jwt.js";
import userModel from "../models/user.model.js";
import { hashPassword, comparePassword } from "../helpers/bcrypt.js";

export const Register = async (req, res, next) => {
  try {
    const data = matchedData(req, { locations: ["body"] });

    const user = await userModel.create({
      username: data.username,
      email: data.email,
      password: await hashPassword(data.password),
    });

    return res.status(201).json({
      message: "Usuario registrado correctamente",
      resource: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
export const Login = async (req, res, next) => {
  try {
    const data = matchedData(req, { locations: ["body"] });
    const user = await userModel
      .findOne({
        email: data.email,
        deletedAt: null,
      })
      .select("+password");

    if (!user) {
      return res
        .status(401)
        .json({ message: "Correo o contraseña incorrectos" });
    }
    const passwordCorrect = await comparePassword(data.password, user.password);

    if (!passwordCorrect) {
      return res
        .status(401)
        .json({ message: "Correo o contraseña incorrectos" });
    }

    const token = generateToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });
    return res.status(200).json({
      message: "Inicio de sesion correcto",
      resource: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
export const Logout = async (req, res, next) => {
  try {
    res.clearCookie("token");

    return res.status(200).json({ message: "Sesion cerrada correctamente" });
  } catch (error) {
    next(error);
  }
};
export const GetProfile = async (req, res, next) => {
  try {
    const user = await userModel.findOne({
      _id: req.user.id,
      deletedAt: null,
    });
    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }
    return res.status(200).json({
      message: "Perfil obtenido correctamente",
      resource: user,
    });
  } catch (error) {
    next(error);
  }
};
