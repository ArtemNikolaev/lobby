const jwt = require("jsonwebtoken");
const { accessSecret, accessTokenTTL } = require("../../../config").token;

class TokenService {
  generateToken(data) {
    return jwt.sign(data, accessSecret, {
      expiresIn: accessTokenTTL,
    });
  }

  verify(token, tokenSecret) {
    return jwt.verify(token, tokenSecret);
  }
}

module.exports = new TokenService();
