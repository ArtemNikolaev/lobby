import createGameCardHtml from "../utils/createGameCardHtml.js";
import subscriptionService from "./subscription.js"
const gameCards = document.querySelector(".game-cards");

export default (client) => {
  subscriptionService.subscribeOnAddGame(client, (game) => {
    const html = createGameCardHtml(game);
    gameCards.insertAdjacentHTML("beforeend", html);
  })

  subscriptionService.subscribeOnDeleteGame(client, (id) => {
    document.querySelector(`#cardId-${id}`).remove();
  })
};
