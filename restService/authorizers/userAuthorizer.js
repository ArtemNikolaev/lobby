const jwt = require("jsonwebtoken");
const buildResponse = require("./utils/buildResponse");
const accessSecret = process.env.ACCESS_SECRET;

exports.handler = (event, context, callback) => {
  const { authorizationToken: token, methodArn } = event;

  if (!token) return callback(null, "Unauthorized");

  try {
    const payload = jwt.verify(token.replace("Bearer ", ""), accessSecret);

    if (payload.role !== "user")
      return callback(null, buildResponse(methodArn));

    return callback(null, buildResponse(methodArn, payload, "Allow"));
  } catch (error) {
    console.info(error);
    return callback(null, buildResponse(methodArn));
  }
};
