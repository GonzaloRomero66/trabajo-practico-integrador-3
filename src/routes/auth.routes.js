import { Router } from "express";
import {
  Register,
  Login,
  Logout,
  GetProfile,
} from "../controllers/auth.controller.js";

import {
  validateRegister,
  validateLogin,
} from "../middlewares/validations/auth.validations.js";

import { auth } from "../middlewares/auth.js";

import { validate } from "../middlewares/validate.js";

const router = Router();

router.post("/register", validateRegister, validate, Register);
router.post("/login", validateLogin, validate, Login);
router.post("/logout", auth, Logout);
router.get("/profile", auth, GetProfile);

export default router;
