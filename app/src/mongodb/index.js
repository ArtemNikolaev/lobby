const { MongoClient } = require("mongodb");
const { storageType } = require("../../config").app;
const { host, port, name } = require("../../config").mongodb;

const client = new MongoClient(`mongodb://${host}:${port}/${name}`);

const mongoDB = {
  connect: () => {
    if (storageType === "mongo") {
      client
        .connect()
        .then(() =>
          console.log(`MongoDB connected! | mongodb://${host}:${port}/${name}`)
        );
    }
  },
  getCollection: (collection) => client.db("lobby").collection(collection),
};

module.exports = mongoDB;
