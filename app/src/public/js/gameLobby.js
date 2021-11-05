import { getLobbyRoom, createNewGameTable } from "./handler.js";

const createTableBtn = document.querySelector(".create-table-btn");
const deleteTableForm = document.querySelector(".delete-table-form");

document.addEventListener("DOMContentLoaded", async () => {
  await getLobbyRoom();
});

createTableBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  await createNewGameTable();
});
