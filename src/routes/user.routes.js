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

const router = Router();

router.get("/", GetAllUsers);
router.get("/:id", idParamValidation, validate, GetUserId);
router.post("/", validateCreateUser, CreateUser);
router.put("/:id", idParamValidation, validateUpdateUser, validate, UpdateUser);
router.delete("/:id", idParamValidation, DeleteUser);

export default router;
