import express, { Router } from "express";
import { UserController } from "../controllers/userController";
import auth, { IAuth } from "../middleware/auth";
const router = Router();

router.post("/", UserController.createUser);
router.post("/login", UserController.login);
router.post("/logout", auth as IAuth, UserController.logout);
router.get("/profile", auth as IAuth, UserController.getProfile);
router.patch("/profile/edit", auth as IAuth, UserController.updateUser);

export default router;
