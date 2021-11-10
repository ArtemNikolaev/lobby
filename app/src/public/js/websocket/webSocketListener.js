import createChatMessageHtml from "../utils/createChatMessageHtml.js";
import createGameCardHtml from "../utils/createGameCardHtml.js";
import createTableCardHtml from "../utils/createTableCardHtml.js";

const gameCards = document.querySelector(".game-cards");
const tables = document.querySelector(".tables");
const chat = document.querySelector(".chat");

export default (ws, gameId) => {
  ws.onmessage = (response) => {
    const data = JSON.parse(response.data);

    if (data.event === "addGame") {
      const html = createGameCardHtml(data.game);
      gameCards.insertAdjacentHTML("beforeend", html);
    }

    if (data.event === "deleteGame") {
      document.querySelector(`#cardId-${data.id}`).remove();
    }

    if (data.event === "createTable" && data.table.game_id === +gameId) {
      const html = createTableCardHtml(data.table);
      tables.insertAdjacentHTML("beforeend", html);
    }

    if (data.event === "deleteTable" && data.gameId === gameId) {
      document.querySelector(`#tableId-${data.tableId}`).remove();
    }

    if (
      (data.event === "getChat" && data.id === gameId) ||
      (data.event === "chat" && data.id === gameId)
    ) {
      const { username } = JSON.parse(localStorage.getItem("userData"));

      const html = data.chatData
        .map((msg) => {
          return msg.username === username
            ? createChatMessageHtml(msg)
            : createChatMessageHtml(msg, "chat-msg-you");
        })
        .join("\n");

      chat.innerText = "";
      chat.insertAdjacentHTML("afterbegin", html);
    }
  };
};
