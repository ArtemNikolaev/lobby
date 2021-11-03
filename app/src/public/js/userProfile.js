import {
  getRoom,
  logout,
  addNewGameListener,
  deleteGameListener,
} from "./handler.js";

document.addEventListener("DOMContentLoaded", async () => {
  await getRoom("user");
  addNewGameListener();
  deleteGameListener();
});

document.querySelector(".logout").addEventListener("click", async () => {
  await logout();
});
