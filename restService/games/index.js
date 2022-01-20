const gameController = require("./games/gameController");

exports.handler = async (event) => {
  let response;
  global.console.log(`:: | ${event.httpMethod} | ${event.path} |`);

  switch (true) {
    case event.httpMethod === "POST" && event.path === "/games":
      response = await gameController.createGame(event);
      break;

    case event.httpMethod === "DELETE" &&
      event.path === `/games/${event.pathParameters.gameId}`:
      response = await gameController.deleteGame(event);
      break;

    case event.httpMethod === "POST" &&
      event.path === `/games/${event.pathParameters.gameId}/tables`:
      response = await gameController.createTable(event);
      break;

    case event.httpMethod === "DELETE" &&
      event.path ===
        `/games/${event.pathParameters.gameId}/tables/${event.pathParameters.tableId}`:
      response = await gameController.deleteTable(event.pathParameters.tableId);
      break;
  }

  return response;
};
