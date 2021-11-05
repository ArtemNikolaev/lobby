import {
  getLobbyRoom,
  createNewGameTable,
  createNewGameTableListener,
} from "./handler.js";
import { getId } from "./utils/localStorage.js";

const createTableBtn = document.querySelector(".create-table-btn");
const deleteTableForm = document.querySelector(".delete-table-form");

document.addEventListener("DOMContentLoaded", async () => {
  const gameId = +getId();
  await getLobbyRoom(gameId);
  createNewGameTableListener(gameId);
});

createTableBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  await createNewGameTable();
});
