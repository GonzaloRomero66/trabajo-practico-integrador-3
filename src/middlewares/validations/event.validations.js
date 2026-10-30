import { body } from "express-validator";
import mongoose from "mongoose";
import EventModel from "../../models/event.model.js";
import CategoryModel from "../../models/category.model.js";
import { param } from "express-validator";
export const idEventValidation = [
  param("id").isMongoId().withMessage("El ID del evento no es válido"),
];

export const validateCreateEvent = [
  body("title")
    .notEmpty()
    .withMessage("El título no puede estar vacío")
    .isLength({ min: 3, max: 150 })
    .withMessage("El título debe tener entre 3 y 150 caracteres")
    .custom(async (title) => {
      const event = await EventModel.findOne({ title });

      if (event) {
        throw new Error("El título ya existe");
      }

      return true;
    }),

  body("description")
    .notEmpty()
    .withMessage("La descripción no puede estar vacía")
    .isLength({ min: 20 })
    .withMessage("La descripción debe tener al menos 20 caracteres"),

  body("startDate")
    .notEmpty()
    .withMessage("La fecha de inicio es obligatoria")
    .isDate()
    .withMessage("La fecha de inicio no es válida"),

  body("endDate")
    .notEmpty()
    .withMessage("La fecha de finalización es obligatoria")
    .isDate()
    .withMessage("La fecha de finalización no es válida")
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
    .isInt({ min: 1 })
    .withMessage("La capacidad debe ser un entero mayor o igual a 1"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El precio debe ser un número mayor o igual a 0"),

  body("status")
    .optional()
    .isIn(["scheduled", "cancelled", "finished"])
    .withMessage("El estado debe ser scheduled, cancelled o finished"),

  body("categories")
    .optional()
    .isArray()
    .withMessage("Las categorías deben enviarse como un array")
    .custom(async (categories) => {
      for (const id of categories) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new Error("Una categoría contiene un ID inválido");
        }

        const category = await CategoryModel.findById(id);

        if (!category) {
          throw new Error("Una de las categorías no existe");
        }
      }

      return true;
    }),

  body("location.venue")
    .notEmpty()
    .withMessage("El lugar es obligatorio")
    .isLength({ min: 3, max: 100 })
    .withMessage("El lugar debe tener entre 3 y 100 caracteres"),

  body("location.address")
    .notEmpty()
    .withMessage("La dirección es obligatoria")
    .isLength({ min: 5, max: 150 })
    .withMessage("La dirección debe tener entre 5 y 150 caracteres"),

  body("location.city")
    .notEmpty()
    .withMessage("La ciudad es obligatoria")
    .isLength({ min: 2, max: 50 })
    .withMessage("La ciudad debe tener entre 2 y 50 caracteres"),
];

export const validateUpdateEvent = [
  body("title")
    .optional()
    .notEmpty()
    .withMessage("El título no puede estar vacío")
    .isLength({ min: 3, max: 150 })
    .withMessage("El título debe tener entre 3 y 150 caracteres")
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
    .notEmpty()
    .withMessage("La descripción no puede estar vacía")
    .isLength({ min: 20 })
    .withMessage("La descripción debe tener al menos 20 caracteres"),

  body("startDate")
    .optional()
    .isDate()
    .withMessage("La fecha de inicio no es válida"),

  body("endDate")
    .optional()
    .isDate()
    .withMessage("La fecha de finalización no es válida")
    .custom(async (endDate, { req }) => {
      const event = await EventModel.findById(req.params.id);

      if (!event) {
        throw new Error("Evento no encontrado");
      }
      const startDate = req.body.startDate || event.startDate;
      if (new Date(endDate) <= new Date(startDate)) {
        throw new Error(
          "La fecha de finalización debe ser posterior a la de inicio",
        );
      }
      return true;
    }),
  body("capacity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("La capacidad debe ser un entero mayor o igual a 1"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El precio debe ser un número mayor o igual a 0"),
  body("status")
    .optional()
    .isIn(["scheduled", "cancelled", "finished"])
    .withMessage("El estado debe ser scheduled, cancelled o finished"),
  body("categories")
    .optional()
    .isArray()
    .withMessage("Las categorías deben enviarse como un array")
    .custom(async (categories) => {
      for (const id of categories) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new Error("Una categoría contiene un ID inválido");
        }
        const category = await CategoryModel.findById(id);
        if (!category) {
          throw new Error("Una de las categorías no existe");
        }
      }
      return true;
    }),
  body("location.venue")
    .optional()
    .notEmpty()
    .withMessage("El lugar no puede estar vacío")
    .isLength({ min: 3, max: 100 })
    .withMessage("El lugar debe tener entre 3 y 100 caracteres"),
  body("location.address")
    .optional()
    .notEmpty()
    .withMessage("La dirección no puede estar vacía")
    .isLength({ min: 5, max: 150 })
    .withMessage("La dirección debe tener entre 5 y 150 caracteres"),
  body("location.city")
    .optional()
    .notEmpty()
    .withMessage("La ciudad no puede estar vacía")
    .isLength({ min: 2, max: 50 })
    .withMessage("La ciudad debe tener entre 2 y 50 caracteres"),
];

export const eventExistsValidation = [
  param("id")
    .isMongoId()
    .withMessage("El ID del evento no es válido")
    .bail()
    .custom(async (id, { req }) => {
      const event = await Event.findOne({
        _id: id,
        deleted: false,
      });

      if (!event) {
        throw new Error("Evento no encontrado");
      }

      if (
        req.user.role !== "ADMIN" &&
        event.creator.toString() !== req.user.id
      ) {
        throw new Error("No tenés permiso para modificar este evento");
      }

      return true;
    }),
];

export default validateCreateEvent;
