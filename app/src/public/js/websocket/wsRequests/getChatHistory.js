import { webSocket } from "../../config.js";

const { chatHistoryEvent } = webSocket;

export default async (ws, id, chat) => {
  ws.send(JSON.stringify({ id, chat, event: chatHistoryEvent }));

  return new Promise((resolve, reject) => {
    ws.onmessage = (response) => {
      const data = JSON.parse(response.data);

      if (data.event === chatHistoryEvent) resolve(data);
    };
  });
};
