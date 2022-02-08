const HttpError = require("./httpError");

module.exports = class UnauthorizedError extends HttpError {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
};
