const { MongoClient } = require("mongodb");
const { host, port, name } = require("../../config").mongodb;

const client = new MongoClient(`mongodb://${host}:${port}/${name}`);

module.exports = client;
