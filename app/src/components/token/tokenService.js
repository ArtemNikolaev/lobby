const jwt = require("jsonwebtoken");
const { accessSecret, accessTokenTTL } = require("../../../config").token;
const UnauthorizedError = require("../../errors/unauthorizedError");
const { AUTHORIZATION_FAILED } = require("../../helpers/messages");

class TokenService {
  generateToken(data, secret, expiryTerm) {
    const secretInUse = secret || accessSecret;
    const expiresIn = expiryTerm || accessTokenTTL;

    return jwt.sign(data, secretInUse, { expiresIn });
  }

  verify(token, secret) {
    const secretInUse = secret || accessSecret;
    try {
      return jwt.verify(token, secretInUse);
    } catch (error) {
      throw new UnauthorizedError(AUTHORIZATION_FAILED);
    }
  }
}

module.exports = new TokenService();
