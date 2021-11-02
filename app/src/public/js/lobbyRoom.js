import { getPlayerLobby, logout, addNewGameListener } from "./handler.js";

const logoutBtn = document.querySelector(".logout");

document.addEventListener("DOMContentLoaded", async () => {
  await getPlayerLobby();
  addNewGameListener();
});

logoutBtn.addEventListener("click", async () => {
  await logout();
});
