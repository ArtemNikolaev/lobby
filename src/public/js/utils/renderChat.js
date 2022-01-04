import createChatMessageHtml from "./createChatMessageHtml.js";
import { getUserData } from "./localStorage.js";
import createLocalTimeString from "./localTime.js";

const chat = document.querySelector(".chat");

export default (data) => {
  const { username } = getUserData();

  const messages = data.map(item => {
    const time = createLocalTimeString(item.utcSecondsSinceEpoch);
    return {
      username: item.username,
      message: item.message,
      time
    }
  })

  let html = createChatMessageHtml(messages.shift(), "chatbot-msg");

  if (messages.length)
    html += messages
      .map((msg) =>
        msg.username === username
          ? createChatMessageHtml(msg, "chat-msg-me")
          : createChatMessageHtml(msg)
      )
      .join("\n");

  chat.innerText = "";
  chat.insertAdjacentHTML("afterbegin", html);
  chat.scrollTop = chat.scrollHeight;
};
