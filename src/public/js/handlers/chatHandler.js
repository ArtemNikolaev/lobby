import { getUserData } from "../utils/localStorage.js";
import fetchGraphQL from "../fetchServices/graphQL.js";

const chatForm = document.querySelector("#chat-form");

export default function sendChatMessageListener(chat, id) {
  const { username } = getUserData();

  chatForm.addEventListener("submit", async(e) => {
    e.preventDefault();

    const formData = new FormData(chatForm);
    const message = formData.get("message");
    const utcSecondsSinceEpoch = Math.round(Date.now() / 1000);

    const query = `mutation AddMessageToChatMutation($id: ID!, $chat: String!, $chatData: ChatMessageInput!) {
      addMessageToChat(id: $id, chat: $chat, chatData: $chatData) {
        code
        success
        message
        id
      }
    }`;

    const json = await fetchGraphQL({
      query,
      variables: {
        id,
        chat,
        chatData: {
          message,
          username,
          utcSecondsSinceEpoch,
        }
      },
    });

    chatForm.reset();
    e.target.elements.message.focus();
  });
}
