import { Router } from "express";
import {
  Register,
  Login,
  Logout,
  GetProfile,
  UpdateProfile,
} from "../controllers/auth.controller.js";

import {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
} from "../middlewares/validations/auth.validations.js";

import { authMiddleware } from "../middlewares/auth.js";

import { validate } from "../middlewares/validate.js";

const router = Router();

router.post("/register", validateRegister, validate, Register);
router.post("/login", validateLogin, validate, Login);
router.post("/logout", authMiddleware, Logout);
router.get("/profile", authMiddleware, GetProfile);
router.put(
  "/profile",
  authMiddleware,
  validateUpdateProfile,
  validate,
  UpdateProfile,
);

export default router;
