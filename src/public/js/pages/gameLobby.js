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
    const client = wsConnection();

    await pageHandler.getLobby(gameId);
    tableHandler.createTableListener(gameId);
    tableHandler.joinToTableListener();
    sendChatMessageListener("lobby", gameId);
    pageHandler.jumpToProfileListener();
    wsLobbyEventListener(client, gameId);
  } catch (error) {
    showError(error);
  }
});
