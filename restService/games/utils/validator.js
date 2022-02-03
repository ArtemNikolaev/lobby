const BadRequestError = require("../errors/badRequestError");
const VALIDATION_FAILED = "Validation error occurred";

exports.bodyValidator = (schema, req) => {
  const result = [];

  for (const [key, value] of Object.entries(req.body)) {
    result.push(schema[key](value));
  }

  const isNotValid = result.some((el) => el === false);
  if (isNotValid) throw new BadRequestError(VALIDATION_FAILED);
};

exports.idValidator = (...ids) => {
  const hex = /^[0-9a-fA-f]{24}$/;

  for (const id of ids) {
    if (!hex.test(id) || Buffer.byteLength(id, "hex") !== 12)
      throw new BadRequestError(VALIDATION_FAILED);
  }
};
