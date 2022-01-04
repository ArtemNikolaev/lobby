import createTableCardHtml from "../utils/createTableCardHtml.js";
import changePlayersViewersCount from "../utils/changePlayersViewersCount.js";
import renderChat from "../utils/renderChat.js";
import subscriptionService from "./subscription.js";

const tables = document.querySelector(".tables");

export default (client, gameId) => {
  subscriptionService.subscribeOnChatMessage(client, gameId, (history) => {
    renderChat(history);
  });

  subscriptionService.subscribeOnLeftTable(client, gameId, (table) => {
    changePlayersViewersCount(table);
  });

  subscriptionService.subscribeOnJoinTable(client, gameId, (table) => {
    changePlayersViewersCount(table);
  });

  subscriptionService.subscribeOnAddTable(client, gameId, (table) => {
    const html = createTableCardHtml(table);
    tables.insertAdjacentHTML("beforeend", html);
  });

  subscriptionService.subscribeOnDeleteTable(client, gameId, (table) => {
    document.querySelector(`#tableId-${table.id}`).remove();
  });
};
