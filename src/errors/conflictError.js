const { CONFLICT } = require("../helpers/statusCodes");

module.exports = class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CONFLICT;
  }
};
