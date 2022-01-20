const { ObjectId } = require("mongodb");
const { usersCollection } = require("../config");
const getCollection = require("../utils/mongoDB");
const { verify } = require("../utils/scrypt");
const NotFoundError = require("../errors/notFoundError");
const ConflictError = require("../errors/conflictError");
const UnauthorizedError = require("../errors/unauthorizedError");

const USER_NOT_FOUND = "User not found";
const EMAIL_REGISTERED = "This email is already registered";
const USERNAME_TAKEN = "This username is already taken";
const WRONG_CREDENTIALS = "Wrong credentials";

async function createUser(userData) {
  const collection = await getCollection(usersCollection);
  const data = await collection.insertOne(userData);

  return data.insertedId.toString();
}

async function findUserById(id) {
  const collection = await getCollection(usersCollection);

  const data = await collection.findOne({ _id: ObjectId(id) });
  if (!data) throw new NotFoundError(USER_NOT_FOUND);

  return { id, ...data };
}

async function findUserByEmail(email) {
  const collection = await getCollection(usersCollection);

  const data = await collection.findOne({ email });
  if (!data) throw new NotFoundError(USER_NOT_FOUND);

  return { id: data._id.toString(), ...data };
}

async function checkUsername(body) {
  const collection = await getCollection(usersCollection);
  const { username, email } = body;

  const user = await collection.findOne({ email });
  if (user) throw new ConflictError(EMAIL_REGISTERED);

  const userByUsername = await collection.findOne({ username });
  if (userByUsername) throw new ConflictError(USERNAME_TAKEN);
}

async function checkCredentials(credential) {
  const collection = await getCollection(usersCollection);
  const { login, password } = credential;

  const data = await collection.findOne({
    $or: [{ username: login }, { email: login }],
  });

  if (!data) throw new UnauthorizedError(WRONG_CREDENTIALS);

  const isMatch = await verify(data.password, password);
  if (!isMatch) throw new UnauthorizedError(WRONG_CREDENTIALS);

  return { id: data._id.toString(), ...data };
}

async function updatePassword(userData) {
  const collection = await getCollection(usersCollection);
  const { email, password } = userData;

  const data = await collection.updateOne({ email }, { $set: { password } });

  if (!data.matchedCount) throw new NotFoundError(USER_NOT_FOUND);
}

module.exports = {
  createUser,
  findUserById,
  findUserByEmail,
  checkUsername,
  checkCredentials,
  updatePassword,
};
