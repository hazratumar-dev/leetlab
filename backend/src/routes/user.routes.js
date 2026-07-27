import express from "express";
import {
  registerUser,
  loginUser,
  logOutUser,
  getMe,
} from "../controllers/user.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const userRoutes = express.Router();

userRoutes.route("/register").post(registerUser);

userRoutes.route("/login").post(loginUser);

userRoutes.route("/logout").post(verifyJWT, logOutUser);

userRoutes.route("/getMe").get(verifyJWT, getMe);
export default userRoutes;
