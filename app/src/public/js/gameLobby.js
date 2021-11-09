import {
  getLobbyRoom,
  createNewGameTable,
  deleteGameTable,
  chatListener,
  loadChat,
  tableEventsListener,
} from "./handler.js";
import { getId } from "./utils/localStorage.js";
import webSocketConnection from "./utils/webSocketConnection.js";

document.addEventListener("DOMContentLoaded", async () => {
  const ws = webSocketConnection();

  const gameId = getId();

  await getLobbyRoom(gameId);

  await createNewGameTable(ws);
  await deleteGameTable(ws);

  tableEventsListener(ws, gameId);
  // chatListener();
  // loadChat(gameId);
});
