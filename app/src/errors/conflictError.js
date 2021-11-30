const { CONFLICT } = require("../helpers/statusCodes.js");

module.exports = class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CONFLICT;
  }
};
