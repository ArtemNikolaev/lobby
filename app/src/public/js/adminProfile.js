import webSocketConnection from "./utils/webSocketConnection.js";
import {
  getRoom,
  logout,
  createGame,
  deleteGame,
  gameEventsListener,
} from "./handler.js";

document.addEventListener("DOMContentLoaded", async () => {
  const ws = webSocketConnection();

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

  gameEventsListener(ws);
});

document.querySelector(".logout").addEventListener("click", async () => {
  await logout();
});
