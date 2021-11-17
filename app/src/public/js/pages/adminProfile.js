import wsConnection from "../websocket/wsConnection.js";
import wsProfileEventListener from "../websocket/wsProfileEventListener.js";
import pageHandler from "../handlers/pageHandler.js";
import gameHandler from "../handlers/gameHandler.js";
import logoutListener from "../handlers/logoutHandler.js";
import showError from "../utils/showError.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const ws = await wsConnection();

    await pageHandler.getProfile("admin-page");
    pageHandler.jumpToLobbyListener();
    gameHandler.createGameListener(ws);
    gameHandler.deleteGameListener(ws);
    wsProfileEventListener(ws);
    logoutListener();
  } catch (error) {
    showError(error);
  }
});
