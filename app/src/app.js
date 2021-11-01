const express = require("express");
const morgan = require("morgan");
const path = require("path");
const authRouter = require("./components/auth/authRouter.js");
const lobbyRouter = require("./components/lobby/lobbyRouter");
const adminRouter = require("./components/admin/adminRouter");
const gameRouter = require("./components/games/gameRouter");
const { PAGE_NOT_FOUND } = require("./helpers/messages.js");
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
app.use(
  "/auth/password-reset",
  express.static(path.join(__dirname, "public", "resetPassword.html"))
);
app.use("/auth", authRouter);

/**
 *  Lobby
 */
app.use(
  "/lobby",
  express.static(path.join(__dirname, "public", "lobbyRoom.html"))
);
app.use("/lobby-room", checkAuth("user"));
app.use("/lobby-room", lobbyRouter);

/**
 *  Admin Room
 */
app.use(
  "/admin",
  express.static(path.join(__dirname, "public", "adminRoom.html"))
);
app.use("/admin-room", checkAuth("admin"));
app.use("/admin-room", adminRouter);
app.use("/games", gameRouter);

/**
 *  Other
 */
app.get("*", (req, res) => res.send(PAGE_NOT_FOUND));

app.use(APIErrorsHandler);

module.exports = app;
