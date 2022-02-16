const storage = require("./storage");
const checkCredentials = require("../helpers/checkCredentials");
const { generateToken, verifyToken } = require("../utils/token");
const { hash } = require("../utils/scrypt");
const userDto = require("../utils/userDto");
const GoneError = require("../errors/goneError");
const { accessSecret, resetLinkTTL, apiURL } = require("../config");

const IVALID_LINK = "This link is no longer valid";

async function register(body) {
  const userData = {
    role: "user",
    ...body,
    password: await hash(body.password),
  };

  const id = await storage.createUser(userData);

  return { id, ...userData };
}

async function login(body) {
  const user = await checkCredentials(body);
  const { id, role } = user;

  return { user: userDto(user), token: generateToken({ id, role }) };
}

async function sendResetLinkToEmail(email) {
  const { id, password } = await storage.findUserByEmail(email);

  const payload = { id, email };
  const secret = accessSecret + password;

  const token = generateToken(payload, secret, resetLinkTTL);

  const link = `${apiURL}/auth/password-reset-link/${id}/${token}`;

  // TODO: Logic with sending the link to user email
  global.console.log("\n\nClick to reset password:\n\n", link, "\n\n");

  return { message: "Check your email, please!" };
}

async function verifyLink({ id, token }) {
  const { password } = await storage.findUserById(id);
  const secret = accessSecret + password;

  try {
    verifyToken(token, secret);
  } catch (error) {
    throw new GoneError(IVALID_LINK);
  }
}

async function resetPassword(body) {
  const { email, password } = body;

  await storage.updatePassword({ email, password: await hash(password) });
}

module.exports = {
  register,
  login,
  sendResetLinkToEmail,
  verifyLink,
  resetPassword,
};
