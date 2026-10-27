import express from "express";
import { authController } from "./auth.controller";
const router = express.Router();

router.post("/admin-login", authController.loginController);
router.post("/logout", authController.logoutController);

export const authRouters = router;
