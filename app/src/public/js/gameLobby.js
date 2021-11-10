import webSocketConnection from "./websocket/webSocketConnection.js";
import webSocketListener from "./websocket/webSocketListener.js";
import showError from "./utils/showError.js";
import { getGameId } from "./utils/localStorage.js";
import {
  getLobbyPage,
  createNewGameTable,
  deleteGameTable,
  sendChatMessage,
} from "./handler.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const ws = await webSocketConnection();
    const gameId = getGameId();

    await getLobbyPage(ws, gameId);

    await createNewGameTable(ws, gameId);
    await deleteGameTable(ws, gameId);

    sendChatMessage(ws, gameId);
    webSocketListener(ws, gameId);
  } catch (error) {
    showError(error);
  }
});
