const { MongoClient } = require("mongodb");
const { host, port, name } = require("../../config").mongodb;

const client = new MongoClient(`mongodb://${host}:${port}/${name}`);

const mongoDB = {
  connect: () =>
    client
      .connect()
      .then(() => console.log(`MongoDB connected! | ${host}:${port}/${name}`)),

  getCollection: (collection) => client.db("lobby").collection(collection),
};

module.exports = mongoDB;
