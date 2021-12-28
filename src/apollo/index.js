const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const GameAPI = require("./datasources/game-api");
const TableAPI = require("./datasources/table-api");
const UserAPI = require("./datasources/user-api");

async function startApolloServer(app, mongoClient, typeDefs, resolvers) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => {
      return {
        gameAPI: new GameAPI(mongoClient.db().collection("games")),
        tableAPI: new TableAPI(mongoClient.db().collection("tables")),
        userAPI: new UserAPI(mongoClient.db().collection("users")),
      };
    },
  });

  await server.start();
  server.applyMiddleware({ app });
  await app.listen({ port: process.env.PORT || 3000 });

  console.log(`🚀  Server is running`);
}

const init = (app, mongoClient) =>
  startApolloServer(app, mongoClient, typeDefs, resolvers);

module.exports = { init };
