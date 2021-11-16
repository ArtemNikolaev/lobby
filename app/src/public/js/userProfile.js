import webSocketConnection from "./websocket/webSocketConnection.js";
import wsProfileEventListener from "./websocket/wsProfileEventListener.js";
import { getPage, logout, jumpToLobbyPage } from "./handler.js";
import showError from "./utils/showError.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const ws = await webSocketConnection();

    await getPage("user-page");
    wsProfileEventListener(ws);

    document.addEventListener("click", (e) => jumpToLobbyPage(e));

    document
      .querySelector(".logout")
      .addEventListener("click", async () => await logout());
  } catch (error) {
    showError(error);
  }
});
