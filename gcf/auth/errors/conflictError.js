const HttpError = require("./httpError");

module.exports = class ConflictError extends HttpError {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
};
