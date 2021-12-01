const { INTERNAL_SERVER_ERROR } = require("../helpers/statusCodes");

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  global.console.log(err);
  const status = err.statusCode || INTERNAL_SERVER_ERROR;
  return res.status(status).json({ error: err, message: err.message });
};
