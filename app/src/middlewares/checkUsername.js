const userService = require("../components/user/userService");
const ConflictError = require("../errors/conflictError");
const { USERNAME_TAKEN, EMAIL_REGISTERED } = require("../helpers/messages");

module.exports = async (req, res, next) => {
  const { username, email } = req.body;

  try {
    const user = await userService.findByEmail(email);
    if (user) throw new ConflictError(EMAIL_REGISTERED);

    const userByUsername = await userService.findByUsername(username);
    if (userByUsername) throw new ConflictError(USERNAME_TAKEN);

    return next();
  } catch (error) {
    return next(error);
  }
};
