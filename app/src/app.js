const http = require("http");
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const authRouter = require("./components/auth/authRouter.js");
const pageRouter = require("./components/pages/pageRouter");
const gameRouter = require("./components/games/gameRouter");
const { PAGE_NOT_FOUND } = require("./helpers/messages.js");
const APIErrorsHandler = require("./middlewares/APIErrorsHandler.js");
const webSocketServerConnection = require("./webSocketServer");

const app = express();
const server = http.createServer(app);

webSocketServerConnection(server);

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
 *  Pages (admin/user/lobby)
 */
app.use(
  "/user-profile",
  express.static(path.join(__dirname, "public", "userProfile.html"))
);
app.use(
  "/admin-profile",
  express.static(path.join(__dirname, "public", "adminProfile.html"))
);
app.use(
  "/lobby-room",
  express.static(path.join(__dirname, "public", "gameLobby.html"))
);
app.use("/", pageRouter);

/**
 *  Games
 */
app.use("/games", gameRouter);

/**
 *  Lobby Room
 */
// app.use(
//   "/lobby-room",
//   express.static(path.join(__dirname, "public", "gameLobby.html"))
// );

/**
 *  Table Room
 */
app.use(
  "/table-room",
  express.static(path.join(__dirname, "public", "gameTable.html"))
);

/**
 *  Other
 */
app.get("*", (req, res) => res.send(PAGE_NOT_FOUND));

app.use(APIErrorsHandler);

module.exports = server;
