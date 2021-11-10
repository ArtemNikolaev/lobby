import webSocketConnection from "./websocket/webSocketConnection.js";
import { getPage, logout, enterToGameLobby } from "./handler.js";
import webSocketListener from "./websocket/webSocketListener.js";
import showError from "./utils/showError.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const ws = await webSocketConnection();
    await getPage("user-page");
    webSocketListener(ws);

    document.addEventListener("click", async (e) => {
      e.preventDefault();
      await enterToGameLobby(e);
    });

    document.querySelector(".logout").addEventListener("click", async () => {
      await logout();
    });
  } catch (error) {
    showError(error);
  }
});
