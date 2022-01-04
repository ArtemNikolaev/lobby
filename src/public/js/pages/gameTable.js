import wsConnection from "../websocket/wsConnection.js";
import wsChatEventListener from "../websocket/wsChatEventListener.js";
import pageHandler from "../handlers/pageHandler.js";
import tableHandler from "../handlers/tableHandler.js";
import sendChatMessageListener from "../handlers/chatHandler.js";
import { getTableId, getGameId } from "../utils/localStorage.js";
import showError from "../utils/showError.js";

const tableId = getTableId();
const gameId = getGameId();

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const client = wsConnection();

    await pageHandler.getTable(tableId);
    tableHandler.leaveTableListener(gameId, tableId);
    sendChatMessageListener("table", tableId);
    pageHandler.jumpToProfileListener();
    wsChatEventListener(client, tableId);
  } catch (error) {
    showError(error);
  }
});
