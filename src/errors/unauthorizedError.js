const { UNAUTHORIZED } = require("../helpers/statusCodes");

module.exports = class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED;
  }
};
