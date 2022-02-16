import wsConnection from "../websocket/wsConnection.js";
import wsProfileEventListener from "../websocket/wsProfileEventListener.js";
import pageHandler from "../handlers/pageHandler.js";
import logoutListener from "../handlers/logoutHandler.js";
import showError from "../utils/showError.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const ws = await wsConnection();

    await pageHandler.getProfile("user-page");
    pageHandler.jumpToLobbyListener();
    wsProfileEventListener(ws);
    logoutListener();
  } catch (error) {
    showError(error);
  }
});
