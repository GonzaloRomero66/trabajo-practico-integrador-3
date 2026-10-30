import { Router } from "express";
import {
  GetAllUsers,
  GetUserId,
  CreateUser,
  UpdateUser,
  DeleteUser,
} from "../controllers/user.controller.js";

import {
  validateCreateUser,
  validateUpdateUser,
  idParamValidation,
} from "../middlewares/validations/user.validations.js";

import { validate } from "../middlewares/validate.js";
import { authorizeRoles } from "../middlewares/authorizerole.js";
import { auth } from "../middlewares/auth.js";

const router = Router();

router.get("/", auth, authorizeRoles("admin"), GetAllUsers);
router.get(
  "/:id",
  auth,
  authorizeRoles("admin"),
  idParamValidation,
  validate,
  GetUserId,
);

router.put(
  "/:id",
  auth,
  authorizeRoles("admin"),
  idParamValidation,
  validateUpdateUser,
  validate,
  UpdateUser,
);
router.delete(
  "/:id",
  auth,
  authorizeRoles("admin"),
  idParamValidation,
  validate,
  DeleteUser,
);

export default router;
