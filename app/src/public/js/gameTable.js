import webSocketConnection from "./websocket/webSocketConnection.js";
import wsTableEventListener from "./websocket/wsTableEventListener.js";
import showError from "./utils/showError.js";
import { getTableId, getGameId } from "./utils/localStorage.js";
import { getTablePage, sendChatMessage, leaveTable } from "./handler.js";

const tableId = getTableId();
const gameId = getGameId();

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const ws = await webSocketConnection();

    await getTablePage(ws, tableId);
    leaveTable(ws, gameId, tableId);

    sendChatMessage(ws, "table", tableId);
    wsTableEventListener(ws, tableId);
  } catch (error) {
    showError(error);
  }
});
