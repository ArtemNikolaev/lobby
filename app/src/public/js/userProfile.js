import { app } from "./config.js";
import webSocketConnection from "./websocket/webSocketConnection.js";
import wsLobbyEventListener from "./websocket/wsLobbyEventListener.js";
import { getPage, logout, jumpToPage } from "./handler.js";
import showError from "./utils/showError.js";

const { gameIdKey, lobbyPage } = app;

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const ws = await webSocketConnection();

    await getPage("user-page");
    wsLobbyEventListener(ws);

    document.addEventListener("click", (e) =>
      jumpToPage(e, "card-link", gameIdKey, lobbyPage)
    );

    document
      .querySelector(".logout")
      .addEventListener("click", async () => await logout());
  } catch (error) {
    showError(error);
  }
});
