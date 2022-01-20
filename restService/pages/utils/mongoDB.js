const { MongoClient } = require("mongodb");
const { mongoUri, dbName } = require("../config");

async function getCollection(collection) {
  const client = new MongoClient(mongoUri);
  await client.connect();

  return client.db(dbName).collection(collection);
}

module.exports = getCollection;
