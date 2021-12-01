import wsConnection from "../websocket/wsConnection.js";
import wsLobbyEventListener from "../websocket/wsLobbyEventListener.js";
import pageHandler from "../handlers/pageHandler.js";
import tableHandler from "../handlers/tableHandler.js";
import sendChatMessageListener from "../handlers/chatHandler.js";
import { getGameId } from "../utils/localStorage.js";
import showError from "../utils/showError.js";

const gameId = getGameId();

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const ws = await wsConnection();

    await pageHandler.getLobby(ws, gameId);
    tableHandler.createTableListener(ws, gameId);
    tableHandler.joinToTableListener(ws, gameId);
    sendChatMessageListener(ws, "lobby", gameId);
    pageHandler.jumpToProfileListener();
    wsLobbyEventListener(ws, gameId);
  } catch (error) {
    showError(error);
  }
});
