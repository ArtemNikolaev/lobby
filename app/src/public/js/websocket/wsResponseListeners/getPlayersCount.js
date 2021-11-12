import { webSocket } from "../../config.js";

const { getPlayersCountEvent } = webSocket;

export default async (ws) =>
  new Promise((resolve, reject) => {
    ws.onmessage = (response) => {
      const data = JSON.parse(response.data);

      if (data.event === getPlayersCountEvent) resolve(data.count);
    };
  });
