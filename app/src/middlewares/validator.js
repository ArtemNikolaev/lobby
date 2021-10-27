const BadRequestError = require("../errors/badRequestError");
const { VALIDATION_FAILED } = require("../helpers/messages");

module.exports = (schema) => (req, res, next) => {
  try {
    const result = [];

    for (const [key, value] of Object.entries(req.body)) {
      result.push(schema[key](value));
    }

    const isNotValid = result.some((el) => el === false);
    if (isNotValid) throw new BadRequestError(VALIDATION_FAILED);

    return next();
  } catch (error) {
    return next(error);
  }
};
