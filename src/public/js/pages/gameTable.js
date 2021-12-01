import wsConnection from "../websocket/wsConnection.js";
import wsTableEventListener from "../websocket/wsTableEventListener.js";
import pageHandler from "../handlers/pageHandler.js";
import tableHandler from "../handlers/tableHandler.js";
import sendChatMessageListener from "../handlers/chatHandler.js";
import { getTableId, getGameId } from "../utils/localStorage.js";
import showError from "../utils/showError.js";

const tableId = getTableId();
const gameId = getGameId();

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const ws = await wsConnection();

    await pageHandler.getTable(ws, tableId);
    tableHandler.leaveTableListener(ws, gameId, tableId);
    sendChatMessageListener(ws, "table", tableId);
    pageHandler.jumpToProfileListener();
    wsTableEventListener(ws, tableId);
  } catch (error) {
    showError(error);
  }
});
