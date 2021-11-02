import {
  getRoom,
  logout,
  createGame,
  deleteGame,
  addNewGameListener,
  deleteGameListener,
} from "./handler.js";

document.addEventListener("DOMContentLoaded", async () => {
  await getRoom("admin-room");
  addNewGameListener();
  deleteGameListener();
});

document.querySelector(".logout").addEventListener("click", async () => {
  await logout();
});

document
  .querySelector(".show-add-game-btn")
  .addEventListener("click", async () => {
    await createGame();
  });

document
  .querySelector(".show-delete-game-btn")
  .addEventListener("click", async () => {
    await deleteGame();
  });
