import { body, param } from "express-validator";
import EventModel from "../../models/event.model.js";
import CategoryModel from "../../models/category.model.js";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const idEventValidation = [
  param("id").isMongoId().withMessage("El ID del evento no es válido"),
];

// las categorias son opcionales, pero si vienen tienen que existir
const categoriesRules = [
  body("categories")
    .optional()
    .isArray()
    .withMessage("Las categorías deben enviarse como un array")
    .bail()
    .custom(async (categories) => {
      const ids = [...new Set(categories.map(String))].filter((id) =>
        objectIdRegex.test(id),
      );
      const found = await CategoryModel.countDocuments({ _id: { $in: ids } });

      if (found !== ids.length) {
        throw new Error("Una de las categorías no existe");
      }
      return true;
    }),
  body("categories.*")
    .isMongoId()
    .withMessage("Una categoría contiene un ID inválido"),
];

export const validateCreateEvent = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("El título no puede estar vacío")
    .bail()
    .isLength({ min: 3, max: 150 })
    .withMessage("El título debe tener entre 3 y 150 caracteres")
    .bail()
    .custom(async (title) => {
      const event = await EventModel.findOne({ title });

      if (event) {
        throw new Error("El título ya existe");
      }
      return true;
    }),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("La descripción no puede estar vacía")
    .bail()
    .isLength({ min: 20 })
    .withMessage("La descripción debe tener al menos 20 caracteres"),

  body("startDate")
    .notEmpty()
    .withMessage("La fecha de inicio es obligatoria")
    .bail()
    .isISO8601()
    .withMessage("La fecha de inicio no es válida")
    .bail()
    .toDate(),

  body("endDate")
    .notEmpty()
    .withMessage("La fecha de finalización es obligatoria")
    .bail()
    .isISO8601()
    .withMessage("La fecha de finalización no es válida")
    .bail()
    .toDate()
    .custom((endDate, { req }) => {
      if (new Date(endDate) <= new Date(req.body.startDate)) {
        throw new Error(
          "La fecha de finalización debe ser posterior a la de inicio",
        );
      }
      return true;
    }),

  body("capacity")
    .notEmpty()
    .withMessage("La capacidad es obligatoria")
    .bail()
    .isInt({ min: 1 })
    .withMessage("La capacidad debe ser un entero mayor o igual a 1")
    .bail()
    .toInt(),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El precio debe ser un número mayor o igual a 0")
    .bail()
    .toFloat(),

  body("status")
    .optional()
    .isIn(["scheduled", "cancelled", "finished"])
    .withMessage("El estado debe ser scheduled, cancelled o finished"),

  ...categoriesRules,

  body("location.venue")
    .trim()
    .notEmpty()
    .withMessage("El lugar es obligatorio")
    .bail()
    .isLength({ min: 3, max: 100 })
    .withMessage("El lugar debe tener entre 3 y 100 caracteres"),

  body("location.address")
    .trim()
    .notEmpty()
    .withMessage("La dirección es obligatoria")
    .bail()
    .isLength({ min: 5, max: 150 })
    .withMessage("La dirección debe tener entre 5 y 150 caracteres"),

  body("location.city")
    .trim()
    .notEmpty()
    .withMessage("La ciudad es obligatoria")
    .bail()
    .isLength({ min: 2, max: 50 })
    .withMessage("La ciudad debe tener entre 2 y 50 caracteres"),
];

// se usa despues de ownerOrAdminMiddleware, que deja el evento en req.event
export const validateUpdateEvent = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El título no puede estar vacío")
    .bail()
    .isLength({ min: 3, max: 150 })
    .withMessage("El título debe tener entre 3 y 150 caracteres")
    .bail()
    .custom(async (title, { req }) => {
      const event = await EventModel.findOne({
        title,
        _id: { $ne: req.params.id },
      });

      if (event) {
        throw new Error("El título ya existe");
      }
      return true;
    }),

  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("La descripción no puede estar vacía")
    .bail()
    .isLength({ min: 20 })
    .withMessage("La descripción debe tener al menos 20 caracteres"),

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("La fecha de inicio no es válida")
    .bail()
    .toDate()
    .custom((startDate, { req }) => {
      // si tambien viene endDate, la comparacion se hace en ese campo
      if (req.body.endDate) return true;

      if (req.event && new Date(req.event.endDate) <= new Date(startDate)) {
        throw new Error(
          "La fecha de inicio debe ser anterior a la de finalización",
        );
      }
      return true;
    }),

  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("La fecha de finalización no es válida")
    .bail()
    .toDate()
    .custom((endDate, { req }) => {
      const startDate = req.body.startDate || req.event?.startDate;

      if (startDate && new Date(endDate) <= new Date(startDate)) {
        throw new Error(
          "La fecha de finalización debe ser posterior a la de inicio",
        );
      }
      return true;
    }),

  body("capacity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("La capacidad debe ser un entero mayor o igual a 1")
    .bail()
    .toInt(),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El precio debe ser un número mayor o igual a 0")
    .bail()
    .toFloat(),

  body("status")
    .optional()
    .isIn(["scheduled", "cancelled", "finished"])
    .withMessage("El estado debe ser scheduled, cancelled o finished"),

  ...categoriesRules,

  body("location.venue")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El lugar no puede estar vacío")
    .bail()
    .isLength({ min: 3, max: 100 })
    .withMessage("El lugar debe tener entre 3 y 100 caracteres"),

  body("location.address")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("La dirección no puede estar vacía")
    .bail()
    .isLength({ min: 5, max: 150 })
    .withMessage("La dirección debe tener entre 5 y 150 caracteres"),

  body("location.city")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("La ciudad no puede estar vacía")
    .bail()
    .isLength({ min: 2, max: 50 })
    .withMessage("La ciudad debe tener entre 2 y 50 caracteres"),
];
