const { BAD_REQUEST } = require("../helpers/statusCodes");

module.exports = class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = BAD_REQUEST;
  }
};
