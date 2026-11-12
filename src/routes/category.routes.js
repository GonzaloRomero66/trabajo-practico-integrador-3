import { Router } from "express";
import {
  GetAllCategory,
  GetCategoryId,
  CreateCategory,
  UpdateCategory,
  DeleteCategory,
} from "../controllers/category.controller.js";

import { adminMiddleware } from "../middlewares/authorizerole.js";
import { authMiddleware } from "../middlewares/auth.js";
import {
  createCategoryValidation,
  updateCategoryValidation,
  idCategoryValidation,
} from "../middlewares/validations/category.validations.js";

import { validate } from "../middlewares/validate.js";

const router = Router();

router.get("/", authMiddleware, GetAllCategory);
router.get(
  "/:id",
  authMiddleware,
  idCategoryValidation,
  validate,
  GetCategoryId,
);
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createCategoryValidation,
  validate,
  CreateCategory,
);
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  idCategoryValidation,
  updateCategoryValidation,
  validate,
  UpdateCategory,
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  idCategoryValidation,
  validate,
  DeleteCategory,
);

export default router;
