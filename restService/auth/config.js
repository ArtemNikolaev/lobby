module.exports = {
  clientHost: process.env.CLIENT_HOST,
  accessSecret: process.env.ACCESS_SECRET,
  accessTokenTTL: process.env.ACCESS_TOKEN_TTL,
  resetLinkTTL: process.env.RESET_LINK_TTL,
  dbName: process.env.MONGODB_NAME,
  usersCollection: process.env.MONGODB_COLLECTION_USERS,
  mongoUri: process.env.MONGODB_URI,
  apiURL: process.env.API_URL,
};
