import { Router } from "express";
import {
  GetAllUsers,
  GetUserId,
  UpdateUser,
  DeleteUser,
} from "../controllers/user.controller.js";

import {
  validateUpdateUser,
  idParamValidation,
} from "../middlewares/validations/user.validations.js";

import { validate } from "../middlewares/validate.js";
import { adminMiddleware } from "../middlewares/authorizerole.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

// todas las rutas de usuarios son solo para admin
router.use(authMiddleware, adminMiddleware);

router.get("/", GetAllUsers);
router.get("/:id", idParamValidation, validate, GetUserId);
router.put(
  "/:id",
  idParamValidation,
  validateUpdateUser,
  validate,
  UpdateUser,
);
router.delete("/:id", idParamValidation, validate, DeleteUser);

export default router;
