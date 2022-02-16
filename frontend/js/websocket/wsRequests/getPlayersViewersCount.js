/* eslint-disable no-param-reassign */
import { webSocket } from "../../config.js";

const { getPlayersCountEvent } = webSocket;

export default async (ws, tableId) => {
  ws.send(JSON.stringify({ tableId, event: getPlayersCountEvent }));

  return new Promise((resolve, reject) => {
    ws.onmessage = (response) => {
      const data = JSON.parse(response.data);

      if (data.event === getPlayersCountEvent) resolve(data.count);
    };

    ws.onerror = (error) => reject(error);
  });
};
