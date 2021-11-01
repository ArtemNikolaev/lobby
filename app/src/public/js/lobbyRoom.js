import { contentLoader, logout } from "./handler.js";

const logoutBtn = document.querySelector(".logout");

document.addEventListener("DOMContentLoaded", async () => {
  await contentLoader("lobby-room");
});

logoutBtn.addEventListener("click", async () => {
  await logout();
});
