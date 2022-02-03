const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../errors/unauthorizedError");
const ForbiddenError = require("../errors/forbiddenError");
const { accessSecret } = require("../config");
const HttpError = require("../errors/httpError");

const AUTHORIZATION_FAILED = "Authorization failed";
const ACCESS_DENIED = "Access denied";

module.exports = (accessToken, role) => {
  try {
    if (!accessToken) throw new UnauthorizedError(AUTHORIZATION_FAILED);

    const payload = jwt.verify(
      accessToken.replace("Bearer ", ""),
      accessSecret
    );

    if (role) {
      if (payload.role !== role) throw new ForbiddenError(ACCESS_DENIED);
    } else if (payload.role !== "user" && payload.role !== "admin")
      throw new ForbiddenError(ACCESS_DENIED);

    return { payload, error: null };
  } catch (error) {
    if (!error instanceof HttpError) {
      error.statusCode = 401;
      error.message = AUTHORIZATION_FAILED;
    }

    return { payload: null, error };
  }
};
