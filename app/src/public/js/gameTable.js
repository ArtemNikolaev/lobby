import webSocketConnection from "./websocket/webSocketConnection.js";
import webSocketListener from "./websocket/webSocketListener.js";
import showError from "./utils/showError.js";
import { getTableId } from "./utils/localStorage.js";
import { getTablePage } from "./handler.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const ws = await webSocketConnection();
    const tableId = getTableId();

    await getTablePage(ws, tableId);

    // await createNewGameTable(ws, tableId);
    // await deleteGameTable(ws, tableId);

    // sendChatMessage(ws, tableId);
    // webSocketListener(ws, tableId);
  } catch (error) {
    showError(error);
  }
});
