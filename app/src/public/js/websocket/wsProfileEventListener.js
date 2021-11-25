import createGameCardHtml from "../utils/createGameCardHtml.js";
import { webSocket } from "../config.js";

const { addGameEvent, deleteGameEvent } = webSocket;
const gameCards = document.querySelector(".game-cards");

export default (ws) => {
  ws.onmessage = (response) => {
    const data = JSON.parse(response.data);

    if (data.event === addGameEvent) {
      const html = createGameCardHtml(data.game);
      gameCards.insertAdjacentHTML("beforeend", html);
    }

    if (data.event === deleteGameEvent) {
      document.querySelector(`#cardId-${data.id}`).remove();
    }
  };
};
