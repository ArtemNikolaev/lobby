const HttpError = require("../errors/httpError");

module.exports = (error) => {
  console.log(error);

  let statusCode = 500;
  let body = {
    message: `Unhandle Server Error: ${error.message}`,
    stack: error.stack,
  };

  if (error instanceof HttpError) {
    statusCode = error.statusCode;
    body = { message: error.message };
  }

  return { statusCode, body };
};
