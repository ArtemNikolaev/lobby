const { NOT_FOUND } = require("../helpers/statusCodes");

module.exports = class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NOT_FOUND;
  }
};
