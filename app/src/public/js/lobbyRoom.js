import {
  getPlayerLobby,
  logout,
  addNewGameListener,
  deleteGameListener,
} from "./handler.js";

document.addEventListener("DOMContentLoaded", async () => {
  await getPlayerLobby();
  addNewGameListener();
  deleteGameListener();
});

document.querySelector(".logout").addEventListener("click", async () => {
  await logout();
});
