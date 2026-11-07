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
import { authorizeRoles } from "../middlewares/authorizerole.js";
import { auth } from "../middlewares/auth.js";

const router = Router();

router.get("/", GetAllEvent);
router.get("/:id", idEventValidation, validate, GetEventId);
router.post(
  "/",
  auth,
  authorizeRoles("admin", "organizer"),
  validateCreateEvent,
  validate,
  CreateEvent,
);
router.put(
  "/:id",
  auth,
  authorizeRoles("admin", "organizer"),
  idEventValidation,
  validateUpdateEvent,
  validate,
  UpdateEvent,
);
router.delete(
  "/:id",
  auth,
  authorizeRoles("admin"),
  idEventValidation,
  validate,
  DeleteEvent,
);

export default router;
