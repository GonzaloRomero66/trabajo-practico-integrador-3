import { body, param } from "express-validator";
import categoryModel from "../../models/category.model.js";

export const idCategoryValidation = [
  param("id").isMongoId().withMessage("El ID de la categoría no es válido"),
];

export const createCategoryValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre de la categoría es obligatorio")
    .bail()
    .isLength({ min: 2, max: 30 })
    .withMessage("El nombre debe de ser entre 2 a 30 caracteres")
    .bail()
    .custom(async (name) => {
      const category = await categoryModel.findOne({ name });

      if (category) {
        throw new Error("Ya existe una categoría con ese nombre");
      }

      return true;
    }),

  body("description")
    .optional()
    .isString()
    .withMessage("La descripción debe ser un texto")
    .bail()
    .isLength({ max: 200 })
    .withMessage("La descripción solo puede ser de 200 caracteres"),
];

export const updateCategoryValidation = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El nombre no puede estar vacío")
    .bail()
    .isLength({ min: 2, max: 30 })
    .withMessage("El nombre debe de ser de 2 a 30 caracteres")
    .bail()
    .custom(async (name, { req }) => {
      const category = await categoryModel.findOne({
        name,
        _id: { $ne: req.params.id },
      });

      if (category) {
        throw new Error("Ya existe una categoría con ese nombre");
      }

      return true;
    }),

  body("description")
    .optional()
    .isString()
    .withMessage("La descripción debe ser un texto")
    .bail()
    .isLength({ max: 200 })
    .withMessage("La descripción solo puede ser de 200 caracteres"),
];
