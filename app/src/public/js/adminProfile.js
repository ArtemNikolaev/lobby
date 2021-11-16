import webSocketConnection from "./websocket/webSocketConnection.js";
import wsProfileEventListener from "./websocket/wsProfileEventListener.js";
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
    wsProfileEventListener(ws);

    document.addEventListener("click", (e) => jumpToLobbyPage(e));
    document.addEventListener("click", async (e) => await deleteGame(e, ws));

    document
      .querySelector(".show-add-game-btn")
      .addEventListener("click", () => {
        createGame(ws);
      });

    document.querySelector(".logout").addEventListener("click", async () => {
      await logout();
    });
  } catch (error) {
    showError(error);
  }
});
