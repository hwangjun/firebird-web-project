import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import passport from "passport";
import morgan from "morgan";
import session from "express-session";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import flash from "connect-flash";
import connect from "./schemas";
import { fileURLToPath } from "url";
// const createError = require('http-errors');
// const express = require('express');
// const path = require('path');
// const cookieParser = require('cookie-parser');
// const passport = require('passport');
// const morgan = require('morgan');
// const session = require('express-session');
// const helmet = require('helmet');
// const flash = require('connect-flash');
// const cors = require('cors');
//require('dotenv').config();
// const dotenv = require('dotenv');
// const connect = require('./schemas');
const app = express();

/**
 * NODE_ENV 설정
 * windows : set NODE_ENV=local 확인: echo %NODE_ENV%
 * linux(MAC) : export NODE_ENV=local 확인 : echo $NODE_ENV
 */
let envPath = "";
switch (process.env.NODE_ENV) {
  case "local":
    envPath = "./local.env";
    break;
  case "dev":
    envPath = "./dev.env";
    break;
  case "production":
    envPath = "./production.env";
    break;
  default:
    envPath = "./local.env";
}
dotenv.config();

// SWAGGER
// const swaggerJSDoc = require('swagger-jsdoc');
// const swaggerOption = require('./config/swagger-jsdoc');
// const swaggerSpec = swaggerJSDoc(swaggerOption);
// const swaggerUi = require('swagger-ui-express');
import swaggerJSDoc from "swagger-jsdoc";
import swaggerOption from "./config/swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
const swaggerSpec = swaggerJSDoc(swaggerOption);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connect();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    cooke: {
      httpOnly: true,
      secure: false
    }
  })
);

app.use(flash());

// require('./config/passport')(passport);
import configPassport from "./config/passport";
configPassport(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(helmet());

app.use(cors());

import indexRouter from "./routes/index";
import authRouter from "./routes/api/auth";
import userRouter from "./routes/api/user";
import productRouter from "./routes/api/prod";
import categoryRouter from "./routes/api/category";
import partnerRouter from "./routes/api/partner";
import partnerProductRouter from "./routes/api/partnerProduct";

// ROUTERS
app.use("/", indexRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/categorys", categoryRouter);
app.use("/api/partners", partnerRouter);
app.use("/api/partnerProducts", partnerProductRouter);

// SWAGGER ROUTERS
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
