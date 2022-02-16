const { MongoClient, ObjectId } = require("mongodb");
const { mongoUri, dbName, usersCollection } = require("../config");
const NotFoundError = require("../errors/notFoundError");

const client = new MongoClient(mongoUri);
const USER_NOT_FOUND = "User not found";

exports.createUser = async (userData) => {
  await client.connect();
  const users = client.db(dbName).collection(usersCollection);

  const data = await users.insertOne(userData);

  return data.insertedId.toString();
};

exports.findUserByEmail = async (email) => {
  await client.connect();
  const users = client.db(dbName).collection(usersCollection);

  const data = await users.findOne({ email });
  if (!data) throw new NotFoundError(USER_NOT_FOUND);

  return { ...data, id: data._id.toString() };
};

exports.findUserById = async (id) => {
  await client.connect();
  const users = client.db(dbName).collection(usersCollection);

  const data = await users.findOne({ _id: ObjectId(id) });
  if (!data) throw new NotFoundError(USER_NOT_FOUND);

  return { id, ...data };
};

exports.updatePassword = async ({ email, password }) => {
  await client.connect();
  const users = client.db(dbName).collection(usersCollection);

  const data = await users.updateOne({ email }, { $set: { password } });
  if (!data.matchedCount) throw new NotFoundError(USER_NOT_FOUND);
};
