const { mongodbUri } = require("../../config").mongodb;

module.exports = async (client) => {
  if (!mongodbUri.startsWith("mongodb+srv://")) return;

  const users = client.db("lobby").collection("users");
  const admin = await users.findOne({ role: "admin" });
  if (admin) return;

  await users.insertOne({
    username: "admin",
    role: "admin",
    email: "admin@gmail.com",
    password: "76f7aa2c3c54dec0b003bc8cbe2d9f35:b4e1fbe96ee21cd188767047", // 123123
  });
};
