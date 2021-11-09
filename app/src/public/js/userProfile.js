import webSocketConnection from "./utils/webSocketConnection.js";
import {
  getRoom,
  logout,
  gameEventsListener,
  enterToGameLobby,
} from "./handler.js";

document.addEventListener("DOMContentLoaded", async () => {
  const ws = webSocketConnection();

  await getRoom("user");

  gameEventsListener(ws);
});

document.addEventListener("click", async (e) => {
  e.preventDefault();
  await enterToGameLobby(e);
});

document.querySelector(".logout").addEventListener("click", async () => {
  await logout();
});
