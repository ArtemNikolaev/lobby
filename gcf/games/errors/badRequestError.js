const HttpError = require("./httpError");

module.exports = class BadRequestError extends HttpError {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
};
