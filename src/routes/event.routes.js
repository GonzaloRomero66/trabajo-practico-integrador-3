import { Router } from "express";
import {
  GetAllEvent,
  GetMyEvents,
  GetEventId,
  CreateEvent,
  UpdateEvent,
  DeleteEvent,
} from "../controllers/event.controller.js";

import {
  validateCreateEvent,
  validateUpdateEvent,
  idEventValidation,
} from "../middlewares/validations/event.validations.js";

import { validate } from "../middlewares/validate.js";
import { authMiddleware } from "../middlewares/auth.js";
import { ownerOrAdminMiddleware } from "../middlewares/ownerOrAdmin.js";

const router = Router();

// todas las rutas de eventos necesitan usuario autenticado
router.use(authMiddleware);

router.get("/my", GetMyEvents);
router.get("/", GetAllEvent);
router.get("/:id", idEventValidation, validate, GetEventId);
router.post("/", validateCreateEvent, validate, CreateEvent);
router.put(
  "/:id",
  idEventValidation,
  validate,
  ownerOrAdminMiddleware,
  validateUpdateEvent,
  validate,
  UpdateEvent,
);
router.delete(
  "/:id",
  idEventValidation,
  validate,
  ownerOrAdminMiddleware,
  DeleteEvent,
);

export default router;
