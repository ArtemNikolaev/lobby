const http = require("http");
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const authRouter = require("./components/auth/authRouter");
const pageRouter = require("./components/pages/pageRouter");
const gameRouter = require("./components/games/gameRouter");
const { PAGE_NOT_FOUND } = require("./helpers/messages");
const APIErrorsHandler = require("./middlewares/APIErrorsHandler");
const mongoDB = require("./mongodb/index");
const { init } = require("./apollo");

const startServer = () => {
    const app = express();
    const server = http.createServer(app);

    mongoDB.connect();
    init(app, mongoDB);
    server.listen(10000);

    app.use(morgan("dev"));
    app.use(express.json());
    app.use(express.static(path.join(__dirname, "public")));

    /**
     *  Auth
     */
    app.use(
        "/auth/register",
        express.static(path.join(__dirname, "public/html", "register.html"))
    );
    app.use(
        "/auth/login",
        express.static(path.join(__dirname, "public/html", "login.html"))
    );
    app.use(
        "/auth/password-reset",
        express.static(path.join(__dirname, "public/html", "resetPassword.html"))
    );
    app.use("/auth", authRouter);

    /**
     *  Pages (admin/user/lobby)
     */
    app.use(
        "/user-profile",
        express.static(path.join(__dirname, "public/html", "userProfile.html"))
    );
    app.use(
        "/admin-profile",
        express.static(path.join(__dirname, "public/html", "adminProfile.html"))
    );
    app.use(
        "/lobby-room",
        express.static(path.join(__dirname, "public/html", "gameLobby.html"))
    );
    app.use(
        "/table-room",
        express.static(path.join(__dirname, "public/html", "gameTable.html"))
    );
    app.use("/", pageRouter);

    /**
     *  Games
     */
    app.use("/games", gameRouter);

    /**
     *  not emplemented
     */
    app.get("*", (req, res) => res.send(PAGE_NOT_FOUND));

    app.use(APIErrorsHandler);
}

module.exports = { startServer };
