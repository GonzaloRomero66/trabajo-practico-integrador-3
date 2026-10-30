import { Router } from "express";
import {
  GetAllCategory,
  GetCategoryId,
  CreateCategory,
  UpdateCategory,
  DeleteCategory,
} from "../controllers/category.controllers.js";

import {
  createCategoryValidation,
  updateCategoryValidation,
  idCategoryValidation,
} from "../middlewares/validations/category.validations.js";

import { validate } from "../middlewares/validate.js";

const router = Router();

router.get("/", GetAllCategory);
router.get("/:id", idCategoryValidation, validate, GetCategoryId);
router.post("/", createCategoryValidation, validate, CreateCategory);
router.put(
  "/:id",
  idCategoryValidation,
  updateCategoryValidation,
  validate,
  UpdateCategory,
);
router.delete("/:id", idCategoryValidation, validate, DeleteCategory);

export default router;
