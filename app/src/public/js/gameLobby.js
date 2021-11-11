import { app } from "./config.js";
import webSocketConnection from "./websocket/webSocketConnection.js";
import wsLobbyEventListener from "./websocket/wsLobbyEventListener.js";
import showError from "./utils/showError.js";
import { getGameId } from "./utils/localStorage.js";
import {
  getLobbyPage,
  createGameTable,
  deleteGameTable,
  sendChatMessage,
  jumpToPage,
} from "./handler.js";

const { tableIdKey, tablePage } = app;
const gameId = getGameId();

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const ws = await webSocketConnection();

    await getLobbyPage(ws, gameId);
    createGameTable(ws, gameId);
    deleteGameTable(ws, gameId);

    sendChatMessage(ws, "lobby", gameId);
    wsLobbyEventListener(ws, gameId);

    document.addEventListener("click", (e) =>
      jumpToPage(e, "table-link", tableIdKey, tablePage)
    );
  } catch (error) {
    showError(error);
  }
});
