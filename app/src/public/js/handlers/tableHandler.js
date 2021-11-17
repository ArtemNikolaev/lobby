import { app, webSocket } from "../config.js";
import table from "../fetchServices/table.js";
import getPlayersViewersCount from "../websocket/wsRequests/getPlayersViewersCount.js";
import showError from "../utils/showError.js";
import {
  deleteTableId,
  getToken,
  getUserData,
  setTableId,
} from "../utils/localStorage.js";

const { tablePage, lobbyPage } = app;
const {
  deleteTableEvent,
  createTableEvent,
  userJoinTableEvent,
  userLeftTableEvent,
} = webSocket;

const createTableBtn = document.querySelector(".create-table-btn");
const exitGameBtn = document.querySelector(".exit-game-btn");

class TableHandler {
  createTableListener(ws, gameId) {
    createTableBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      try {
        const newTable = await table.create(gameId, getToken());

        const { id: tableId, user_id: userId, creator } = newTable;
        setTableId(tableId);

        ws.send(
          JSON.stringify({
            tableId,
            userId,
            gameId,
            creator,
            event: createTableEvent,
          })
        );

        document.location = tablePage;
      } catch (error) {
        showError(error);
      }
    });
  }

  joinToTableListener(ws, gameId) {
    document.addEventListener("click", (e) => {
      if (!e.target.classList.contains("table-link")) return;

      const tableId = parseInt(e.target.id.split("-")[1]);
      const { id: userId } = getUserData();

      ws.send(
        JSON.stringify({ tableId, userId, gameId, event: userJoinTableEvent })
      );

      setTableId(tableId);
      document.location = tablePage;
    });
  }

  leaveTableListener(ws, gameId, tableId) {
    exitGameBtn.addEventListener("click", async () => {
      const count = await getPlayersViewersCount(ws, tableId);

      if (count.players <= 1) {
        const isDeleted = await table.delete(gameId, tableId, getToken());

        if (isDeleted)
          ws.send(JSON.stringify({ tableId, gameId, event: deleteTableEvent }));
      } else {
        const { id: userId } = getUserData();

        ws.send(
          JSON.stringify({ tableId, gameId, userId, event: userLeftTableEvent })
        );
      }

      deleteTableId();
      document.location = lobbyPage;
    });
  }
}

export default new TableHandler();
