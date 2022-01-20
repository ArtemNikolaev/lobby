import { webSocket } from "../config.js";
import { getUserData } from "../utils/localStorage.js";

const { chatMessageEvent } = webSocket;
const chatForm = document.querySelector("#chat-form");

export default function sendChatMessageListener(ws, chat, id) {
  const { username } = getUserData();

  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(chatForm);
    const message = formData.get("message");
    const date = new Date();

    ws.send(
      JSON.stringify({
        id,
        chatData: { username, message, date },
        chat,
        event: chatMessageEvent,
      })
    );

    chatForm.reset();
    e.target.elements.message.focus();
  });
}
