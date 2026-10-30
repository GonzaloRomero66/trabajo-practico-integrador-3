import { Router } from "express";
import {
  GetAllEvent,
  GetEventId,
  CreateEvent,
  UpdateEvent,
  DeleteEvent,
} from "../controllers/event.controllers.js";

import {
  validateCreateEvent,
  validateUpdateEvent,
  idEventValidation,
} from "../middlewares/validations/event.validations.js";

import { validate } from "../middlewares/validate.js";

const router = Router();

router.get("/", GetAllEvent);
router.get("/:id", idEventValidation, validate, GetEventId);
router.post("/", validateCreateEvent, validate, CreateEvent);
router.put(
  "/:id",
  idEventValidation,
  validateUpdateEvent,
  validate,
  UpdateEvent,
);
router.delete("/:id", idEventValidation, validate, DeleteEvent);

export default router;
