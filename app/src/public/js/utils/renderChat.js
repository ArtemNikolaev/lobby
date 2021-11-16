import createChatMessageHtml from "./createChatMessageHtml.js";
import { getUserData } from "./localStorage.js";

const chat = document.querySelector(".chat");

export default (data) => {
  const { username } = getUserData();

  const html = data
    .map((msg) => {
      return msg.username === username
        ? createChatMessageHtml(msg)
        : createChatMessageHtml(msg, "chat-msg-you");
    })
    .join("\n");

  chat.innerText = "";
  chat.insertAdjacentHTML("afterbegin", html);
};
