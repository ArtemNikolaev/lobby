module.exports = {
  mongoUri: process.env.MONGODB_URI,
  dbName: process.env.MONGODB_NAME,
  usersCollection: process.env.MONGODB_COLLECTION_USERS,
  gamesCollection: process.env.MONGODB_COLLECTION_GAMES,
  tablesCollection: process.env.MONGODB_COLLECTION_TABLES,
  accessSecret: process.env.ACCESS_SECRET,
};
