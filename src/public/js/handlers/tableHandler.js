import { app } from "../config.js";
import table from "../fetchServices/table.js";
import getPlayersViewersCount from "../websocket/wsRequests/getPlayersViewersCount.js";
import showError from "../utils/showError.js";
import {
  deleteTableId,
  getToken,
  getUserData,
  setTableId,
} from "../utils/localStorage.js";
import fetchGraphQL from "../fetchServices/graphQL.js";

const { tablePage, lobbyPage } = app;

const createTableBtn = document.querySelector(".create-table-btn");
const exitGameBtn = document.querySelector(".exit-game-btn");

class TableHandler {
  createTableListener(gameId) {
    createTableBtn.addEventListener("click", () => {
      const form = document.querySelector(".create-form");

      form.classList.toggle("hidden");
      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const string = new FormData(form).get("maxPlayers");
        const body = { maxPlayers: parseInt(string, 10) };
        form.reset();

        try {
          const newTable = await table.create(gameId, body, getToken());

          const { id: tableId } = newTable;

          setTableId(tableId);

          document.location = tablePage;
        } catch (error) {
          showError(error);
        }
      });
    });
  }

  joinToTableListener() {
    document.addEventListener("click", async (e) => {
      if (!e.target.classList.contains("table-link")) return;

      const tableId = e.target.id.split("-")[1];
      const { id: userId } = getUserData();

      const query = `mutation JoinTableMutation($id: ID!, $userId: ID!) {
        joinTable(id: $id, userId: $userId) {
          code
          success
          message
          id
        }
      }`;

      await fetchGraphQL({
        query,
        variables: {
          id: tableId,
          userId,
        },
      });

      setTableId(tableId);
      document.location = tablePage;
    });
  }

  leaveTableListener(gameId, tableId) {
    exitGameBtn.addEventListener("click", async () => {
      try {
        const count = await getPlayersViewersCount(tableId);

        if (count.players <= 1) {
          await table.delete(gameId, tableId, getToken());
        } else {
          const { id: userId } = getUserData();

          const query = `mutation LeaveTableMutation($id: ID!, $userId: ID!) {
            leaveTable(id: $id, userId: $userId) {
              code
              success
              message
              id
            }
          }`;

          await fetchGraphQL({
            query,
            variables: {
              id: tableId,
              userId,
            },
          });
        }

        deleteTableId();
        document.location = lobbyPage;
      } catch (error) {
        showError();
      }
    });
  }
}

export default new TableHandler();
