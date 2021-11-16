import webSocketConnection from "./websocket/webSocketConnection.js";
import wsLobbyEventListener from "./websocket/wsLobbyEventListener.js";
import showError from "./utils/showError.js";
import {
  getPage,
  logout,
  createGame,
  deleteGame,
  jumpToLobbyPage,
} from "./handler.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const ws = await webSocketConnection();

    await getPage("admin-page");
    wsLobbyEventListener(ws);

    document.addEventListener("click", (e) => jumpToLobbyPage(e));

    document
      .querySelector(".show-add-game-btn")
      .addEventListener("click", () => {
        createGame(ws);
      });

    document
      .querySelector(".show-delete-game-btn")
      .addEventListener("click", () => {
        deleteGame(ws);
      });

    document.querySelector(".logout").addEventListener("click", async () => {
      await logout();
    });
  } catch (error) {
    showError(error);
  }
});
