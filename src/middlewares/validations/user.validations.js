import { body, param } from "express-validator";
import UserModel from "../../models/user.model.js";
import { profileRules } from "./profile.validations.js";

export const idParamValidation = [
  param("id").isMongoId().withMessage("El ID del usuario no es válido"),
];

export const validateUpdateUser = [
  body("username")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El username no puede estar vacio")
    .bail()
    .isLength({ min: 3, max: 20 })
    .withMessage("El username tiene que ser minimo de 3 caracteres y maximo 20")
    .bail()
    .isAlphanumeric()
    .withMessage("El username tiene que ser alfanumerico")
    .bail()
    .custom(async (username, { req }) => {
      const user = await UserModel.findOne({
        username,
        _id: { $ne: req.params.id },
      });
      if (user) {
        throw new Error("El username ya existe");
      }
      return true;
    }),
  body("email")
    .optional()
    .trim()
    .toLowerCase()
    .notEmpty()
    .withMessage("El email no puede estar vacio")
    .bail()
    .isEmail()
    .withMessage("Debe de ser un email valido")
    .bail()
    .custom(async (email, { req }) => {
      const user = await UserModel.findOne({
        email,
        _id: { $ne: req.params.id },
      });
      if (user) {
        throw new Error("El email ya existe");
      }
      return true;
    }),
  body("password")
    .optional()
    .notEmpty()
    .withMessage("La contraseña no puede estar vacia")
    .bail()
    .isLength({ min: 8 })
    .withMessage("La contraseña debe de ser minimo de 8 caracteres")
    .bail()
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/)
    .withMessage(
      "La contraseña debe tener al menos una mayúscula, una minúscula y un número",
    ),
  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("El rol tiene que ser admin o user"),
  ...profileRules({ required: false, prefix: "profile" }),
];
