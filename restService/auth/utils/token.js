const jwt = require("jsonwebtoken");

const { accessSecret, accessTokenTTL } = require("../config");
const UnauthorizedError = require("../errors/unauthorizedError");

const AUTHORIZATION_FAILED = "Authorization error occurred";

function generateToken(data, secret, expiryTerm) {
  const secretInUse = secret || accessSecret;
  const expiresIn = expiryTerm || accessTokenTTL;

  return jwt.sign(data, secretInUse, { expiresIn });
}

function verifyToken(token, secret) {
  const secretInUse = secret || accessSecret;
  try {
    return jwt.verify(token, secretInUse);
  } catch (error) {
    throw new UnauthorizedError(AUTHORIZATION_FAILED);
  }
}

module.exports = { generateToken, verifyToken };
