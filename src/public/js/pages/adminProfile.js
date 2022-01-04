import wsConnection from "../websocket/wsConnection.js";
import wsProfileEventListener from "../websocket/wsProfileEventListener.js";
import pageHandler from "../handlers/pageHandler.js";
import gameHandler from "../handlers/gameHandler.js";
import logoutListener from "../handlers/logoutHandler.js";
import showError from "../utils/showError.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const client = wsConnection();

    await pageHandler.getProfile("admin-page");
    pageHandler.jumpToLobbyListener();
    gameHandler.createGameListener();
    gameHandler.deleteGameListener();
    wsProfileEventListener(client);
    logoutListener();
  } catch (error) {
    showError(error);
  }
});
