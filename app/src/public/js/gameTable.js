import webSocketConnection from "./websocket/webSocketConnection.js";
import wsTableEventListener from "./websocket/wsTableEventListener.js";
import showError from "./utils/showError.js";
import { getTableId } from "./utils/localStorage.js";
import { getTablePage, sendChatMessage } from "./handler.js";

const tableId = getTableId();

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const ws = await webSocketConnection();

    await getTablePage(ws, tableId);

    sendChatMessage(ws, "table", tableId);
    wsTableEventListener(ws, tableId);
  } catch (error) {
    showError(error);
  }
});
