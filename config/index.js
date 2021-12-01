const app = {
  host: process.env.HOST || "0.0.0.0",
  port: parseInt(process.env.PORT, 10) || 3000,
  uploadsFolder: "uploads",
  storageType: process.env.STORAGE_TYPE,
};

const db = {
  host: process.env.MYSQLDB_HOST || "mysqldb",
  user: process.env.MYSQLDB_USER || "root",
  password: process.env.MYSQLDB_ROOT_PASSWORD || "123123",
  database: process.env.MYSQLDB_DATABASE || "lobby",
};

const {
  MONGODB_USER,
  MONGODB_PASSWORD,
  MONGODB_HOST,
  MONGODB_PORT,
  MONGODB_DATABASE,
} = process.env;

const mongodb = {
  mongodbUri:
    process.env.MONGODB_ATLAS_URI ||
    `mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DATABASE}?authSource=admin`,
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
