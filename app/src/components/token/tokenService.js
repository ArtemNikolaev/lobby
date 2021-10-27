const jwt = require("jsonwebtoken");
const { accessSecret, accessTokenTTL } = require("../../../config").token;

class TokenService {
  generateToken(data) {
    return jwt.sign(data, accessSecret, {
      expiresIn: accessTokenTTL,
    });
  }

  verify(token) {
    return jwt.verify(token, accessSecret);
  }
}

module.exports = new TokenService();
