import express from 'express';
import passport from "passport";
import {
  register,
  login,
  refreshToken,
  logout,
  sendMailForRegister,
  receiveCodeForRegister,
  me,
  loginWithGoogle,
  sendMailForForgetPassword,
  changePassword,
  receiveCodeForForgetPassword
} from './controller.js';

import auth from '../../middlewares/authUser.js';

const router = express.Router();

// گوگل لاگین
router.get('/google', passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  '/google/callback',
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  loginWithGoogle // اینجا توی کنترلرت JWT می‌سازی و می‌فرستی
);

// بقیه مسیرهای auth
router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, me);
router.post('/refresh', refreshToken);
router.post('/forget_password/request', sendMailForForgetPassword);
router.post('/forget_password/confirm', receiveCodeForForgetPassword);
router.get('/verify_mail/request', auth, sendMailForRegister);
router.post('/verify_mail/confirm', auth, receiveCodeForRegister);
router.post('/change_password', auth, changePassword);
router.get('/logout', auth, logout);

export default router;
