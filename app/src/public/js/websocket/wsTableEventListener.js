import { webSocket } from "../config.js";
import renderChat from "../utils/renderChat.js";

const { chatHistoryEvent, chatMessageEvent } = webSocket;

export default (ws, tableId) => {
  ws.onmessage = (response) => {
    const data = JSON.parse(response.data);

    if (
      (data.event === chatHistoryEvent && data.id === tableId) ||
      (data.event === chatMessageEvent && data.id === tableId)
    ) {
      renderChat(data.chatData);
    }
  };
};
