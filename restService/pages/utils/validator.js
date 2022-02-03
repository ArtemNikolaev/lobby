const BadRequestError = require("../errors/badRequestError");
const VALIDATION_FAILED = "Validation error occurred";

exports.idValidator = (...ids) => {
  const hex = /^[0-9a-fA-f]{24}$/;

  for (const id of ids) {
    if (!hex.test(id) || Buffer.byteLength(id, "hex") !== 12)
      throw new BadRequestError(VALIDATION_FAILED);
  }
};
