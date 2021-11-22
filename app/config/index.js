const app = {
  host: process.env.HOST || "0.0.0.0",
  port: parseInt(process.env.PORT, 10) || 3000,
  uploadsFolder: "uploads",
  storageType: process.env.STORAGE_TYPE,
};

const db = {
  host: process.env.MYSQL_HOST || "mysqldb",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_ROOT_PASSWORD || "123123",
  database: process.env.MYSQL_DATABASE || "lobby",
};

const mongodb = {
  host: process.env.MONGODB_HOST || "mongodb",
  port: process.env.MONGODB_PORT || "27017",
  name: process.env.MONGODB_NAME || "lobby",
};

const token = {
  accessSecret: "ushgf873hsjvyd8173gifhsdg",
  accessTokenTTL: "3h",
  linkTTL: "15m",
};

const wsEvents = {
  chatMessageEvent: "chatMessage",
  chatHistoryEvent: "chatHistory",
  createTableEvent: "createTable",
  deleteTableEvent: "deleteTable",
  userJoinTableEvent: "userJoinTable",
  userLeftTableEvent: "userLeftTable",
  getPlayersCountEvent: "getPlayersCount",
};

module.exports = { app, db, token, wsEvents, mongodb };
