import createGameCardHtml from "../utils/createGameCardHtml.js";
import createTableCardHtml from "../utils/createTableCardHtml.js";
import changePlayersCount from "../utils/changePlayersCount.js";
import { webSocket } from "../config.js";
import renderChat from "../utils/renderChat.js";

const {
  addGameEvent,
  deleteGameEvent,
  createTableEvent,
  deleteTableEvent,
  chatMessageEvent,
  userJoinTableEvent,
  userLeftTableEvent,
} = webSocket;
const gameCards = document.querySelector(".game-cards");
const tables = document.querySelector(".tables");

export default (ws, gameId) => {
  ws.onmessage = (response) => {
    const data = JSON.parse(response.data);

    if (data.event === chatMessageEvent && data.id === gameId) {
      renderChat(data.chatData);
    }

    if (data.event === userLeftTableEvent && data.gameId === gameId)
      changePlayersCount(data);

    if (data.event === userJoinTableEvent && data.gameId === gameId)
      changePlayersCount(data);

    if (data.event === createTableEvent && data.gameId === gameId) {
      const html = createTableCardHtml(data);
      tables.insertAdjacentHTML("beforeend", html);
    }

    if (data.event === deleteTableEvent && data.gameId === gameId) {
      document.querySelector(`#tableId-${data.tableId}`).remove();
    }

    if (data.event === addGameEvent) {
      const html = createGameCardHtml(data.game);
      gameCards.insertAdjacentHTML("beforeend", html);
    }

    if (data.event === deleteGameEvent) {
      document.querySelector(`#cardId-${data.id}`).remove();
    }
  };
};
