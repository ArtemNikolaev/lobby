const HttpError = require("./httpError");

module.exports = class NotFoundError extends HttpError {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
};
