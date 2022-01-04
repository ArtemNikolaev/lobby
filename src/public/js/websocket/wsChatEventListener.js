import subscriptionService from "./subscription.js";
import renderChat from "../utils/renderChat.js";

export default (client, id) => {
  subscriptionService.subscribeOnChatMessage(client, id, (history) => {
    renderChat(history);
  });
}