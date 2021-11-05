import {
  getRoom,
  logout,
  addNewGameListener,
  deleteGameListener,
  enterToGameLobby,
} from "./handler.js";

document.addEventListener("DOMContentLoaded", async () => {
  await getRoom("user");
  addNewGameListener();
  deleteGameListener();
});

document.addEventListener("click", async (e) => {
  e.preventDefault();
  await enterToGameLobby(e);
});

document.querySelector(".logout").addEventListener("click", async () => {
  await logout();
});
