import createChatMessageHtml from "../utils/createChatMessageHtml.js";
import { getUserData } from "../utils/localStorage.js";
import { webSocket } from "../config.js";

const { chatHistoryEvent, chatMessageEvent } = webSocket;
const chat = document.querySelector(".chat");
const { username } = getUserData();

export default (ws, tableId) => {
  ws.onmessage = (response) => {
    const data = JSON.parse(response.data);

    if (
      (data.event === chatHistoryEvent && data.id === tableId) ||
      (data.event === chatMessageEvent && data.id === tableId)
    ) {
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
