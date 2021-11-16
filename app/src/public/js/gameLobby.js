import webSocketConnection from "./websocket/webSocketConnection.js";
import wsLobbyEventListener from "./websocket/wsLobbyEventListener.js";
import showError from "./utils/showError.js";
import { getGameId } from "./utils/localStorage.js";
import {
  getLobbyPage,
  createGameTable,
  deleteGameTable,
  sendChatMessage,
  joinToTable,
  jumpToProfilePage,
} from "./handler.js";

const gameId = getGameId();

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const ws = await webSocketConnection();

    await getLobbyPage(ws, gameId);

    createGameTable(ws, gameId);
    deleteGameTable(ws, gameId);

    sendChatMessage(ws, "lobby", gameId);
    wsLobbyEventListener(ws, gameId);

    document.addEventListener("click", (e) => joinToTable(e, ws, gameId));
    jumpToProfilePage();
  } catch (error) {
    showError(error);
  }
});
