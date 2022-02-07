const { MongoClient } = require("mongodb");
const { verify } = require("../utils/scrypt");
const UnauthorizedError = require("../errors/unauthorizedError");
const { usersCollection, dbName, mongoUri } = require("../config");

const client = new MongoClient(mongoUri);
const WRONG_CREDENTIALS = "Wrong credentials";

module.exports = async ({ login, password }) => {
  await client.connect();
  const users = client.db(dbName).collection(usersCollection);

  const data = await users.findOne({
    $or: [{ username: login }, { email: login }],
  });
  if (!data) throw new UnauthorizedError(WRONG_CREDENTIALS);

  const isMatch = await verify(data.password, password);
  if (!isMatch) throw new UnauthorizedError(WRONG_CREDENTIALS);

  return { id: data._id.toString(), ...data };
};
