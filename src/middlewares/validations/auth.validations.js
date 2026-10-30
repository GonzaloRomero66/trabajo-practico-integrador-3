import { body } from "express-validator";
import { User } from "../../models/user.model.js";

export const validateRegister = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("El username no puede estar vacio")
    .isLength({ min: 3, max: 20 })
    .withMessage("El username tiene que ser entre 3 a 20 caracteres")
    .custom(async (username) => {
      const user = await User.findOne({
        username,
      });
      if (user) {
        throw new Error("El username ya esta registrado");
      }
      return true;
    }),
  body("email")
    .notEmpty()
    .withMessage("El email no tiene que estar vacio")
    .isEmail()
    .withMessage("El email tiene que ser un email valido")
    .normalizeEmail()
    .custom(async (email) => {
      const existingemail = await User.findOne({ email });
      if (existingemail) {
        throw new Error("El email ya esta registrado");
      }
      return true;
    }),
  body("password")
    .notEmpty()
    .withMessage("La contraseña no puede estar vacia")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe de tener al menos 8 caracteres")
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/)
    .withMessage(
      "La contraseña debe tener al menos una mayúscula, una minúscula y un número",
    ),
];

export const validateLogin = [
  body("email")
    .notEmpty()
    .withMessage("El email no puede estar vacio")
    .isEmail()
    .withMessage("El email tiene que ser un email valido")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("La contraseña no tiene que estar vacia"),
];
