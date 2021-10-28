const { NOT_FOUND } = require("../helpers/statusCodes.js");

module.exports = class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NOT_FOUND;
  }
};
