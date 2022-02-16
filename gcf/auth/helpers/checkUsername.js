const { MongoClient } = require("mongodb");
const ConflictError = require("../errors/conflictError");
const { usersCollection, dbName, mongoUri } = require("../config");

const client = new MongoClient(mongoUri);
const EMAIL_REGISTERED = "This email is already registered";
const USERNAME_TAKEN = "This username is already taken";

module.exports = async (body) => {
  await client.connect();
  const users = client.db(dbName).collection(usersCollection);

  const { username, email } = body;

  const user = await users.findOne({ email });
  if (user) throw new ConflictError(EMAIL_REGISTERED);

  const userByUsername = await users.findOne({ username });
  if (userByUsername) throw new ConflictError(USERNAME_TAKEN);
};
