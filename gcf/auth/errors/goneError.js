const HttpError = require("./httpError");

module.exports = class GoneError extends HttpError {
  constructor(message) {
    super(message);
    this.statusCode = 410;
  }
};
