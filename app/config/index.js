const app = {
  host: process.env.HOST || "0.0.0.0",
  port: parseInt(process.env.PORT, 10) || 3000,
};

const db = {
  host: process.env.MYSQL_HOST || "mysqldb",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_ROOT_PASSWORD || "123123",
  database: process.env.MYSQL_DATABASE || "lobby",
};

const token = {
  accessSecret: "ushgf873hsjvyd8173gifhsdg",
  accessTokenTTL: "3h",
  linkTTL: "15m",
};

module.exports = { app, db, token };
