const express = require("express");
const morgan = require("morgan");
const path = require("path");
const authRouter = require("./components/auth/authRouter.js");
const APIErrorsHandler = require("./middlewares/APIErrorsHandler.js");

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  "/auth/register",
  express.static(path.join(__dirname, "public", "register.html"))
);
app.use(
  "/auth/login",
  express.static(path.join(__dirname, "public", "login.html"))
);
app.use("/lobby", express.static(path.join(__dirname, "public", "lobby.html")));

app.use("/auth", authRouter);

app.use(APIErrorsHandler);

module.exports = app;
