const { MongoClient } = require("mongodb");
const { host, port, name } = require("../../config").mongodb;

const client = new MongoClient(`mongodb://${host}:${port}/${name}`);
// let db;

// async function mongodbConnect() {
//   try {
//     await client.connect();

//     return client.db("lobby");
//   } finally {
//     await client.close();
//   }
// }

// mongodbConnect().then((data) => {
//   db = data;
// });
// console.log(db);

module.exports = client;
