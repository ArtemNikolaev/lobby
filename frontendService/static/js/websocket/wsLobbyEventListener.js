import createTableCardHtml from "../utils/createTableCardHtml.js";
import changePlayersViewersCount from "../utils/changePlayersViewersCount.js";
import { webSocket } from "../config.js";
import renderChat from "../utils/renderChat.js";

const {
  createTableEvent,
  deleteTableEvent,
  chatMessageEvent,
  userJoinTableEvent,
  userLeftTableEvent,
} = webSocket;
const tables = document.querySelector(".tables");

export default (ws, gameId) => {
  // eslint-disable-next-line no-param-reassign
  ws.onmessage = (response) => {
    const data = JSON.parse(response.data);

    if (data.event === chatMessageEvent && data.id === gameId) {
      renderChat(data.chatData);
    }

    if (data.event === userLeftTableEvent && data.gameId === gameId)
      changePlayersViewersCount(data);

    if (data.event === userJoinTableEvent && data.gameId === gameId)
      changePlayersViewersCount(data);

    if (data.event === createTableEvent && data.gameId === gameId) {
      const html = createTableCardHtml(data);
      tables.insertAdjacentHTML("beforeend", html);
    }

    if (data.event === deleteTableEvent && data.gameId === gameId) {
      document.querySelector(`#tableId-${data.tableId}`).remove();
    }
  };
};
