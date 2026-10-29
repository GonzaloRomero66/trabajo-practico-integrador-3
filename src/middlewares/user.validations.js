import { body } from "express-validator";
import UserModel from "../models/user.model.js";
export const validateCreateUser = [
  body("username")
    .custom(async (username) => {
      const user = await UserModel.findOne({ username });
      if (user) {
        throw new Error("El username ya existe");
      }
      return true;
    })

    .notEmpty()
    .withMessage("El username no puede estar vacio")
    .isLength({ min: 3, max: 20 })
    .withMessage("El username tiene que ser minimo de 3 caracteres y maximo 20")
    .isAlphanumeric()
    .withMessage("El username tiene que ser alfanumerico"),
  body("email")
    .custom(async (email) => {
      const user = await UserModel.findOne({ email });
      if (user) {
        throw new Error("El email ya existe");
      }
      return true;
    })
    .notEmpty()
    .withMessage("El email no puede estar vacio")
    .isEmail()
    .withMessage("Debe de ser un email valido"),
  body("password")
    .notEmpty()
    .withMessage("La contraseña no puede estar vacia")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe de ser minimo de 8 caracteres")
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/)
    .withMessage(
      "La contraseña debe tener al menos una mayúscula, una minúscula y un número",
    ),
  body("role")
    .notEmpty()
    .withMessage("El rol no puede estar vacio")
    .isIn(["user", "admin"])
    .withMessage("El rol tiene que ser admin o user"),
  body("profile.firstName")
    .isLength({ min: 2, max: 50 })
    .withMessage("El primer nombre tiene que ser entre 2 a 50 caracteres")
    .isAlpha("es-ES")
    .withMessage("El primer nombre solo puede tener letras")
    .notEmpty()
    .withMessage("El primer nombre no puede estar vacio"),
  body("profile.lastName")
    .isLength({ min: 2, max: 50 })
    .withMessage("El segundo nombre tiene que ser entre 2 a 50 caracteres")
    .isAlpha("es-ES")
    .withMessage("El segundo nombre solo puede tener letras")
    .notEmpty()
    .withMessage("El segundo nombre no puede estar vacio"),
  body("profile.birthData")
    .optional()
    .isISO8601()
    .withMessage("La fecha de nacimiento debe ser válida")
    .custom((date) => {
      if (new Date(date) > new Date()) {
        throw new Error("La fecha de nacimiento no puede ser futura");
      }
      return true;
    }),
  body("profile.phone")
    .optional()
    .notEmpty()
    .withMessage("El telefono no puede estar vacio")
    .isLength({ min: 8, max: 15 })
    .withMessage("El numero tiene que tener entre 8 a 15 digitos")
    .isNumeric()
    .withMessage("El telefono solo tiene que tener numeros"),
];

export const validateUpdateUser = [
  body("username")
    .optional()
    .notEmpty()
    .withMessage("El username no puede estar vacio")
    .custom(async (username, { req }) => {
      const user = await UserModel.findOne({
        username,
        _id: { $ne: req.params.id },
      });
      if (user) {
        throw new Error("El username ya existe");
      }
      return true;
    })
    .isLength({ min: 3, max: 20 })
    .withMessage(
      "El username tiene que ser minimo de 3 caracteres y maximo 20",
    ),
  body("email")
    .optional()
    .custom(async (email, { req }) => {
      const user = await UserModel.findOne({
        email,
        _id: { $ne: req.params.id },
      });
      if (user) {
        throw new Error("El email ya existe");
      }
      return true;
    })
    .notEmpty()
    .withMessage("El email no puede estar vacio")
    .isEmail()
    .withMessage("Debe de ser un email valido"),
  body("password")
    .optional()
    .notEmpty()
    .withMessage("La contraseña no puede estar vacia")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe de ser minimo de 8 caracteres")
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/)
    .withMessage(
      "La contraseña debe tener al menos una mayúscula, una minúscula y un número",
    ),
  body("role")
    .optional()
    .notEmpty()
    .withMessage("El rol no puede estar vacio")
    .isIn(["user", "admin"])
    .withMessage("El rol tiene que ser admin o user"),
  body("profile.firstName")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("El primer nombre tiene que ser entre 2 a 50 caracteres")
    .isAlpha("es-ES")
    .withMessage("El primer nombre solo puede tener letras")
    .notEmpty()
    .withMessage("El primer nombre no puede estar vacio"),
  body("profile.lastName")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("El segundo nombre tiene que ser entre 2 a 50 caracteres")
    .isAlpha("es-ES")
    .withMessage("El segundo nombre solo puede tener letras")
    .notEmpty()
    .withMessage("El segundo nombre no puede estar vacio"),
  body("profile.birthData")
    .optional()
    .isISO8601()
    .withMessage("La fecha de nacimiento debe ser válida")
    .custom((date) => {
      if (new Date(date) > new Date()) {
        throw new Error("La fecha de nacimiento no puede ser futura");
      }
      return true;
    }),
  body("profile.phone")
    .optional()
    .notEmpty()
    .withMessage("El telefono no puede estar vacio")
    .isLength({ min: 8, max: 15 })
    .withMessage("El numero tiene que tener entre 8 a 15 digitos")
    .isNumeric()
    .withMessage("El telefono tiene que ser solo numeros"),
];

export default validateCreateUser;
