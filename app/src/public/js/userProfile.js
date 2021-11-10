import webSocketConnection from "./websocket/webSocketConnection.js";
import { getRoom, logout, enterToGameLobby } from "./handler.js";
import webSocketListener from "./websocket/webSocketListener.js";

document.addEventListener("DOMContentLoaded", async () => {
  const ws = await webSocketConnection();

  await getRoom("user");

  webSocketListener(ws);
});

document.addEventListener("click", async (e) => {
  e.preventDefault();
  await enterToGameLobby(e);
});

document.querySelector(".logout").addEventListener("click", async () => {
  await logout();
});
