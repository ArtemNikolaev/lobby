const { MongoClient } = require("mongodb");
const { storageType } = require("../../config").app;
const { mongodbUri } = require("../../config").mongodb;
const seedData = require("./seedData");

const client = new MongoClient(mongodbUri);

const mongoDB = {
  connect: () => {
    if (storageType === "mongo") {
      client
        .connect()
        .then(seedData)
        .then(() => global.console.log(`MongoDB connected! | ${mongodbUri}`));
    }
  },
  getCollection: (collection) => client.db("lobby").collection(collection),
};

module.exports = mongoDB;
