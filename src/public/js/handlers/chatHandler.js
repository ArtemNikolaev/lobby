import { getUserData } from "../utils/localStorage.js";
import fetchGraphQL from "../fetchServices/graphQL.js";

const chatForm = document.querySelector("#chat-form");

export default function sendChatMessageListener(chat, id) {
  const { username } = getUserData();

  chatForm.addEventListener("submit", async(e) => {
    e.preventDefault();

    const formData = new FormData(chatForm);
    const message = formData.get("message");
    const date = new Date();

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
          date,
        }
      },
    });

    chatForm.reset();
    e.target.elements.message.focus();
  });
}
