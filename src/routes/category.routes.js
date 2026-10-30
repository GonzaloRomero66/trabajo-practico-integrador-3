import { Router } from "express";
import {
  GetAllCategory,
  GetCategoryId,
  CreateCategory,
  UpdateCategory,
  DeleteCategory,
} from "../controllers/category.controller.js";

import { authorizeRoles } from "../middlewares/authorizerole.js";
import { auth } from "../middlewares/auth.js";
import {
  createCategoryValidation,
  updateCategoryValidation,
  idCategoryValidation,
} from "../middlewares/validations/category.validations.js";

import { validate } from "../middlewares/validate.js";

const router = Router();

router.get("/", GetAllCategory);
router.get("/:id", idCategoryValidation, validate, GetCategoryId);
router.post(
  "/",
  auth,
  authorizeRoles("admin"),
  createCategoryValidation,
  validate,
  CreateCategory,
);
router.put(
  "/:id",
  auth,
  authorizeRoles("admin"),
  idCategoryValidation,
  updateCategoryValidation,
  validate,
  UpdateCategory,
);
router.delete(
  "/:id",
  auth,
  authorizeRoles("admin"),
  idCategoryValidation,
  validate,
  DeleteCategory,
);

export default router;
