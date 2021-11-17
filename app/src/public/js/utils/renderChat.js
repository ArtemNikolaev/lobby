import createChatMessageHtml from "./createChatMessageHtml.js";
import { getUserData } from "./localStorage.js";

const chat = document.querySelector(".chat");

export default (data) => {
  const { username } = getUserData();

  let html = createChatMessageHtml(data.shift(), "chatbot-msg");

  if (data.length)
    html += data
      .map((msg) => {
        return msg.username === username
          ? createChatMessageHtml(msg, "chat-msg-me")
          : createChatMessageHtml(msg);
      })
      .join("\n");

  chat.innerText = "";
  chat.insertAdjacentHTML("afterbegin", html);
  chat.scrollTop = chat.scrollHeight;
};
