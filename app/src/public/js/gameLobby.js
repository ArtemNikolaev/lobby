import {
  getLobbyRoom,
  createNewGameTable,
  createNewGameTableListener,
  deleteGameTable,
  deleteGameTableListener,
} from "./handler.js";
import { getId } from "./utils/localStorage.js";

document.addEventListener("DOMContentLoaded", async () => {
  const gameId = getId();

  await getLobbyRoom(gameId);
  await createNewGameTable();
  createNewGameTableListener(gameId); // WebSocket
  deleteGameTableListener(gameId); // WebSocket

  await deleteGameTable();
});
