import express from "express";
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import path from "path";
import passport from "passport";
import "./src/utils/passport.js";

import authRoute from './src/modules/auth/router.js';
import linkRoute from './src/modules/links/router.js';
import userRoute from './src/modules/users/router.js';
import appRoute from './src/modules/apps/router.js';
import socialRoute from './src/modules/socials/router.js';
import iconRoute from './src/modules/icons/router.js';


export const app = express();


app.use("/public", express.static(path.join(process.cwd(), "public")));


app.use(passport.initialize());


app.use(cors({
  origin: 'http://localhost:3000',  // آدرس فرانت
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api/auth', authRoute);
app.use('/api/links', linkRoute);
app.use('/api/users', userRoute);
app.use('/api/apps', appRoute);
app.use('/api/socials', socialRoute);
app.use('/api/icons', iconRoute);

app.use((req, res, next) => {
  return res.status(404).json({
    error: {
      message: "آدرس اشتباه!",
    },
  });
});
