const userStorage = require("../components/user/userStorage");
const { USERNAME_TAKEN, EMAIL_REGISTERED } = require("../helpers/messages");
const ConflictError = require("../errors/conflictError");

module.exports = async (req, res, next) => {
  const { username, email } = req.body;

  try {
    const user = await userStorage.findByEmail(email);
    if (user) throw new ConflictError(EMAIL_REGISTERED);

    const userByUsername = await userStorage.findByUsername(username);
    if (userByUsername) throw new ConflictError(USERNAME_TAKEN);

    return next();
  } catch (error) {
    return next(error);
  }
};
