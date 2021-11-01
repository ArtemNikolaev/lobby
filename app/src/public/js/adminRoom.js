import { contentLoader, logout } from "./handler.js";

const logoutBtn = document.querySelector(".logout");
const showAddGameForm = document.querySelector(".show-add-game-btn");
const addGameForm = document.querySelector(".add-game");

document.addEventListener("DOMContentLoaded", async () => {
  await contentLoader("admin-room");
});

logoutBtn.addEventListener("click", async () => {
  await logout();
});

showAddGameForm.addEventListener("click", () => {
  addGameForm.classList.toggle("hidden");

  if (!addGameForm.classList.contains("hidden")) {
    const form = document.querySelector(".add-game-form");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const body = new FormData(form);
      form.reset();

      const jwt = localStorage.getItem("game-lobby-token");
      const response = await fetch(`/games`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        body,
      });

      console.log(response.status, await response.json());
    });
  }
});
