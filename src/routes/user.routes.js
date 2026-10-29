import { Router } from "express";
import {
  GetAllUsers,
  GetUserId,
  CreateUser,
  UpdateUser,
  DeleteUser,
} from "../controllers/user.controllers.js";

import validateCreateUser from "../middlewares/user.validations.js";
const router = Router();

router.get("/", GetAllUsers);
router.get("/:id", GetUserId);
router.post("/", validateCreateUser, CreateUser);
router.put("/:id", UpdateUser);
router.delete("/:id", DeleteUser);

export default router;
