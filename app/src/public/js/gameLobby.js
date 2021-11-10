import app from "./config.js";
import webSocketConnection from "./websocket/webSocketConnection.js";
import webSocketListener from "./websocket/webSocketListener.js";
import showError from "./utils/showError.js";
import { getGameId } from "./utils/localStorage.js";
import {
  getLobbyPage,
  createNewGameTable,
  deleteGameTable,
  sendChatMessage,
  jumpToPage,
} from "./handler.js";

const { tableIdKey, tablePage } = app;

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const ws = await webSocketConnection();
    const gameId = getGameId();

    await getLobbyPage(ws, gameId);

    await createNewGameTable(ws, gameId);
    await deleteGameTable(ws, gameId);

    sendChatMessage(ws, gameId);
    webSocketListener(ws, gameId);

    document.addEventListener("click", (e) =>
      jumpToPage(e, "table-link", tableIdKey, tablePage)
    );
  } catch (error) {
    showError(error);
  }
});
