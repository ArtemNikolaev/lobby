const apiConnection = require("./utils/apiConnection");
const eventController = require("./eventController");

exports.handler = async (event) => {
  const { connectionId, routeKey, domainName, stage } = event.requestContext;
  const client = apiConnection(domainName, stage);
  let response = { statusCode: 200 };

  switch (routeKey) {
    case "$connect":
      console.log(`CONNECTION APPEARED: ${connectionId}`);

      await eventController.saveConnectionId(connectionId);
      break;

    case "$disconnect":
      await eventController.deleteConnectionId(connectionId);
      break;

    case "chatMessage":
      await eventController.saveChatMessage(client, event.body);
      break;

    case "chatHistory":
      await eventController.getChatHistory(client, connectionId, event.body);
      break;

    case "addGame":
      await eventController.addGame(client, event.body);
      break;

    case "deleteGame":
      await eventController.deleteGame(client, event.body);
      break;

    case "createTable":
      await eventController.createTable(client, event.body);
      break;

    case "deleteTable":
      await eventController.deleteTable(client, event.body);
      break;

    case "userJoinTable":
      await eventController.userJoinTable(client, event.body);
      break;

    case "userLeftTable":
      await eventController.userLeftTable(client, event.body);
      break;

    case "getPlayersCount":
      await eventController.getPlayersViewersCount(
        client,
        connectionId,
        event.body
      );
      break;

    default:
      response.statusCode = 501;
      break;
  }

  return response;
};
