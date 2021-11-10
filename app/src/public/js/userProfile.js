import webSocketConnection from "./websocket/webSocketConnection.js";
import { getPage, logout, enterToGameLobby } from "./handler.js";
import webSocketListener from "./websocket/webSocketListener.js";

document.addEventListener("DOMContentLoaded", async () => {
  const ws = await webSocketConnection();

  await getPage("user-page");

  webSocketListener(ws);
});

document.addEventListener("click", async (e) => {
  e.preventDefault();
  await enterToGameLobby(e);
});

document.querySelector(".logout").addEventListener("click", async () => {
  await logout();
});
