const pagesController = require("./pages/pagesController");

exports.handler = async (event) => {
  let response;
  global.console.log(`:: | ${event.httpMethod} | ${event.path} |`);
  const { principalId } = event.requestContext.authorizer;

  switch (true) {
    case event.httpMethod === "GET" && event.path === "/admin-page":
      response = await pagesController.getProfilePage(principalId);
      break;

    case event.httpMethod === "GET" && event.path === "/user-page":
      response = await pagesController.getProfilePage(principalId);
      break;

    case event.httpMethod === "GET" &&
      event.path === `/lobby-page/${event.pathParameters.id}`:
      response = await pagesController.getLobbyPage(event);
      break;

    case event.httpMethod === "GET" &&
      event.path === `/table-page/${event.pathParameters.id}`:
      response = await pagesController.getTablePage(event);
      break;
  }

  return response;
};
