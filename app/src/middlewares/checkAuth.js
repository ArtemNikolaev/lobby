const tokenService = require("../components/token/tokenService");
const { TOKEN_REQUIRED, AUTHORIZATION_FAILED } = require("../helpers/messages");
const UnauthorizedError = require("../errors/unauthorizedError");

module.exports = (req, res, next) => {
  try {
    const accessToken = req.headers.authorization;
    if (!accessToken) throw new UnauthorizedError(TOKEN_REQUIRED);

    const payload = tokenService.verify(accessToken.split(" ")[1]);

    req.user = payload;
    return next();
  } catch (error) {
    throw new UnauthorizedError(AUTHORIZATION_FAILED);
  }
};
