const { GONE } = require("../helpers/statusCodes.js");

module.exports = class GoneError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = GONE;
  }
};
