const { FORBIDDEN } = require("../helpers/statusCodes");

module.exports = class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = FORBIDDEN;
  }
};
