const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./schema");
const mainResolver = require("./resolvers");
const middlewares = require("./middlewares");
const GameAPI = require("./datasources/game-api");
const TableAPI = require("./datasources/table-api");
const UserAPI = require("./datasources/user-api");
const { applyMiddleware } = require("graphql-middleware");
const { makeExecutableSchema } = require("@graphql-tools/schema");

async function startApolloServer(app, mongoClient, typeDefs, resolvers) {
  const executableSchema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const schemaWithMiddleware = applyMiddleware(executableSchema, ...middlewares);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req, res }) => ({ req, res }), // now we can access express objects from apollo context arg
    schema: schemaWithMiddleware,
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
  startApolloServer(app, mongoClient, typeDefs, [mainResolver]);

module.exports = { init };
