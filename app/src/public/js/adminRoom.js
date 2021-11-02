import { getAdminLobby, logout, createGame } from "./handler.js";

const logoutBtn = document.querySelector(".logout");
const showAddGameForm = document.querySelector(".show-add-game-btn");

document.addEventListener("DOMContentLoaded", async () => {
  await getAdminLobby();
});

logoutBtn.addEventListener("click", async () => {
  await logout();
});

showAddGameForm.addEventListener("click", async () => {
  await createGame();
});
