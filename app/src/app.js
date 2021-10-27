const express = require("express");
const morgan = require("morgan");
const path = require("path");
const authRouter = require("./components/auth/authRouter.js");
const lobbyRouter = require("./components/lobby/lobbyRouter");
const APIErrorsHandler = require("./middlewares/APIErrorsHandler.js");
const checkAuth = require("./middlewares/checkAuth.js");

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/**
 *  Auth
 */
app.use(
  "/auth/register",
  express.static(path.join(__dirname, "public", "register.html"))
);
app.use(
  "/auth/login",
  express.static(path.join(__dirname, "public", "login.html"))
);
app.use("/auth", authRouter);

/**
 *  Lobby
 */
app.use("/lobby", express.static(path.join(__dirname, "public", "lobby.html")));
app.use("/", checkAuth);
app.use("/my-lobby", lobbyRouter);

app.use(APIErrorsHandler);

module.exports = app;
