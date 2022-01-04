const tokenService = require("../components/token/tokenService");

const addUserTokenToArgs = async (resolve, parent, args, context, info) => {
  if (!context || !context.req || !context.req.headers || !context.req.headers.authorization) {
    return resolve(parent, args, context, info);
  }
  const accessToken = context.req.headers.authorization;
  const payload = tokenService.verify(accessToken.split(" ")[1]);
  const argsWithUser = { userToken: payload, ...args };
  return resolve(parent, argsWithUser, context, info);
};

const middlewares = [addUserTokenToArgs];

module.exports = middlewares;
