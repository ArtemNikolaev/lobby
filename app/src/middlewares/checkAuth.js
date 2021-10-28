const tokenService = require("../components/token/tokenService");
const { TOKEN_REQUIRED, ACCESS_DENIED } = require("../helpers/messages");
const UnauthorizedError = require("../errors/unauthorizedError");
const ForbiddenError = require("../errors/forbiddenError");

module.exports = (role) => (req, res, next) => {
  try {
    const accessToken = req.headers.authorization;
    if (!accessToken) throw new UnauthorizedError(TOKEN_REQUIRED);

    const payload = tokenService.verify(accessToken.split(" ")[1]);
    if (payload.role !== role) throw new ForbiddenError(ACCESS_DENIED);

    req.user = payload;
    return next();
  } catch (error) {
    return next(error);
  }
};
