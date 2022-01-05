const userService = require("../components/user/userService");
const ConflictError = require("../errors/conflictError");
const { USERNAME_TAKEN, EMAIL_REGISTERED } = require("../helpers/messages");

module.exports = (next) => async (root, args, context, info) => {
  const { username, email } = args;

  const user = await userService.findByEmail(email);
  if (user) throw new ConflictError(EMAIL_REGISTERED);

  const userByUsername = await userService.findByUsername(username);
  if (userByUsername) throw new ConflictError(USERNAME_TAKEN);

  return next(root, args, context, info);
};
