import express from 'express';
import { login, sendOtp, signup, updatePassword, verifyEmail } from '../controller/authController.js';

const route = express.Router();

// for auth
route.post("/signup",signup);
route.post("/verify-email",verifyEmail);
route.post("/login",login);
route.post("/send-otp",sendOtp);
route.post("/update-password",updatePassword);

export default route;