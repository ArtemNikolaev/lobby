const jwt = require("jsonwebtoken");
const { accessSecret, accessTokenTTL } = require("../../../config").token;

class TokenService {
  generateToken(data, secret, expiryTerm) {
    const secretInUse = secret || accessSecret;
    const expiresIn = expiryTerm || accessTokenTTL;

    return jwt.sign(data, secretInUse, { expiresIn });
  }

  verify(token, secret) {
    const secretInUse = secret || accessSecret;

    return jwt.verify(token, secretInUse);
  }
}

module.exports = new TokenService();
