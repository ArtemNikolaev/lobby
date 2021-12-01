module.exports = class CatchError extends Error {
  constructor(error) {
    super(error.message);

    if (error.statusCode) {
      this.statusCode = error.statusCode;
    }
  }
};
