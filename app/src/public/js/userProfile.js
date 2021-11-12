import webSocketConnection from "./websocket/webSocketConnection.js";
import wsLobbyEventListener from "./websocket/wsLobbyEventListener.js";
import { getPage, logout, jumpToLobbyPage } from "./handler.js";
import showError from "./utils/showError.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const ws = await webSocketConnection();

    await getPage("user-page");
    wsLobbyEventListener(ws);

    document.addEventListener("click", (e) => jumpToLobbyPage(e));

    document
      .querySelector(".logout")
      .addEventListener("click", async () => await logout());
  } catch (error) {
    showError(error);
  }
});
