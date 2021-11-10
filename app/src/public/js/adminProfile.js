import webSocketConnection from "./websocket/webSocketConnection.js";
import webSocketListener from "./websocket/webSocketListener.js";
import { getRoom, logout, createGame, deleteGame } from "./handler.js";

document.addEventListener("DOMContentLoaded", async () => {
  const ws = await webSocketConnection();

  await getRoom("admin");
  document
    .querySelector(".show-add-game-btn")
    .addEventListener("click", async () => {
      await createGame(ws);
    });

  document
    .querySelector(".show-delete-game-btn")
    .addEventListener("click", async () => {
      await deleteGame(ws);
    });

  webSocketListener(ws);
});

document.querySelector(".logout").addEventListener("click", async () => {
  await logout();
});
