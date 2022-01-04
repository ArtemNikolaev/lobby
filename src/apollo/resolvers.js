const { hash } = require("../helpers/scrypt");
const { accessSecret, linkTTL } = require("../../config").token;
const { port } = require("../../config").app;
const UnauthorizedError = require("../errors/unauthorizedError");
const { WRONG_CREDENTIALS } = require("../helpers/messages");
const { verify } = require("../helpers/scrypt");
const tokenService = require("../components/token/tokenService");
const NotFoundError = require("../errors/notFoundError");
const { USER_NOT_FOUND, CHECK_EMAIL } = require("../helpers/messages");
const { pubsub } = require("./pubsub");
const { wsEvents } = require("../../config");
const eventController = require("../webSocketServer/eventController");
const resolvers = {
  Query: {
    table: (_, { id }, { dataSources }) => {
      return dataSources.tableAPI.findById(id);
    },
    tableInfo: (_, { id }, { dataSources }) => {
      return dataSources.tableAPI.getTableInfo(id);
    },

    games: (_, __, { dataSources }) => {
      return dataSources.gameAPI.getAll();
    },

    game: (_, { id }, { dataSources }) => {
      return dataSources.gameAPI.findById(id);
    },
    userById: (_, { id }, { dataSources }) => {
      return dataSources.userAPI.findById(id);
    },
    userByEmail: (_, { email }, { dataSources }) => {
      return dataSources.userAPI.findByEmail(email);
    },
    userByUsername: (_, { username }, { dataSources }) => {
      return dataSources.userAPI.findByUsername(username);
    },
    userByLogin: (_, { emailOrUsername }, { dataSources }) => {
      return dataSources.userAPI.findByLogin(emailOrUsername);
    },
    playersViewersCount: async (_, { tableId }) => {
      return await eventController.getPlayersViewersCount(tableId);
    },
    chatHistory: async (_, { id, chat }) => {
      return await eventController.getChatHistory(id, chat);
    },
  },
  Game: {
    tables: async ({ id }, _, { dataSources }) => {
      const tables = await dataSources.tableAPI.findByGameId(id);
      return tables.map(async (table) => {
        const count = await eventController.getPlayersViewersCount(id);
        return {
          ...table,
          count,
        };
      });
    },
  },
  Table: {
    creator: ({ creatorId, creator }, _, { dataSources } = {}) => {
      if (creator) {
        return creator;
      }
      return dataSources.userAPI.findById(creatorId);
    },
  },
  Mutation: {
    register: async (_, { email, username, password }, { dataSources }) => {
      try {
        const userData = {
          role: "user",
          email,
          username,
          password: await hash(password),
        };
        const id = await dataSources.userAPI.create(userData);
        return {
          code: 200,
          success: true,
          message: `Successfully created user ${username}`,
          id,
        };
      } catch (err) {
        return {
          code: err.extensions.response.status,
          success: false,
          message: err.extensions.response.body,
          track: null,
        };
      }
    },
    login: async (_, { emailOrUsername, password }, { dataSources }) => {
      try {
        const user = await dataSources.userAPI.findByLogin(emailOrUsername);
        if (!user) throw new UnauthorizedError(WRONG_CREDENTIALS);

        const isMatch = await verify(user.password, password);
        if (!isMatch) throw new UnauthorizedError(WRONG_CREDENTIALS);

        const token = tokenService.generateToken({
          id: user.id,
          role: user.role,
        });

        return {
          code: 200,
          success: true,
          message: `Successfully login user ${user.username}`,
          user,
          token,
        };
      } catch (err) {
        return {
          code: err.statusCode || err.extensions.response.status,
          success: false,
          message: err.message || err.extensions.response.body,
          user: null,
          token: null
        };
      }
    },
    sendResetLink: async (_, { email }, { dataSources }) => {
      try {
        const user = await dataSources.userAPI.findByEmail(email);
        if (!user) throw new NotFoundError(USER_NOT_FOUND);

        const payload = { id: user.id, email: user.email };
        const secret = accessSecret + user.password;

        const token = tokenService.generateToken(payload, secret, linkTTL);

        const link = `http://localhost:${port}/auth/password-reset-link/${user.id}/${token}`;

        // TODO: Logic with sending the link to user email
        global.console.log("\n\nClick to reset password:\n\n", link, "\n\n");

        return {
          code: 200,
          success: true,
          message: `Successfully send reset link to user ${user.username}`,
          responseMessage: { message: CHECK_EMAIL },
        };
      } catch (err) {
        return {
          code: err.statusCode || err.extensions.response.status,
          success: false,
          message: err.message || err.extensions.response.body,
          responseMessage: null,
        };
      }
    },
    resetPassword: async (_, { email, password }, { dataSources }) => {
      try {
        const updated = await dataSources.userAPI.updatePassword({
          email,
          password: await hash(password),
        });

        if (!updated) throw new NotFoundError(USER_NOT_FOUND);

        return {
          code: 200,
          success: true,
          message: `Successfully send reset link to user ${user.username}`,
          responseMessage: { message: CHECK_EMAIL },
        };
      } catch (err) {
        return {
          code: err.statusCode || err.extensions.response.status,
          success: false,
          message: err.message || err.extensions.response.body,
          responseMessage: null,
        };
      }
    },
    createGame: async (_, { title, description, url }, { dataSources }) => {
      try {
        const game = await dataSources.gameAPI.create({
          title,
          description,
          url,
        });

        await pubsub.publish("GAME_ADDED", game);
        return {
          code: 200,
          success: true,
          message: `Successfully created game ${id}`,
          game
        };
      } catch (err) {
        return {
          code: err.extensions.response.status,
          success: false,
          message: err.extensions.response.body,
          game: null,
        };
      }
    },
    deleteGame: async (_, { id }, { dataSources }) => {
      try {
        await dataSources.gameAPI.deleteById(id);

        await pubsub.publish("GAME_ADDED", id);
        return {
          code: 200,
          success: true,
          message: `Successfully deleted game ${id}`,
          id
        };
      } catch (err) {
        return {
          code: err.extensions.response.status,
          success: false,
          message: err.extensions.response.body,
          game: null,
        };
      }
    },
    createTable: async (
      _,
      { gameId, maxPlayers, userToken },
      { dataSources }
    ) => {
      try {
        const table = await dataSources.tableAPI.create({
          gameId,
          maxPlayers,
          creatorId: userToken.id,
        });

        const user = await dataSources.userAPI.findById(userToken.id);
        const result = {
          id: table.id,
          gameId: table.gameId,
          maxPlayers: table.maxPlayers,
          creator: user,
        };

        await eventController.createTable({
          id: result.id,
          gameId: result.gameId,
          creator: result.creator,
          maxPlayers: result.maxPlayers,
        });
        return {
          code: 200,
          success: true,
          message: `Successfully created table ${table.id}`,
          table: result,
        };
      } catch (err) {
        return {
          code: err.extensions.response.status,
          success: false,
          message: err.extensions.response.body,
          table: null,
        };
      }
    },
    deleteTable: async (_, { id }, { dataSources }) => {
      try {
        await dataSources.tableAPI.deleteById(id);
        await eventController.deleteTable(id);
        return {
          code: 200,
          success: true,
          message: `Successfully deleted table ${id}`,
          id
        };
      } catch (err) {
        return {
          code: err.extensions.response.status,
          success: false,
          message: err.extensions.response.body,
          id: null,
        };
      }
    },
    leaveTable: async (_, { id, userId }) => {
      try {
        await eventController.userLeftTable(id, userId);
        return {
          code: 200,
          success: true,
          message: `User ${userId} successfully left table ${id}`,
          id,
        };
      } catch (err) {
        return {
          code: err.extensions ? err.extensions.response.status : 500,
          success: false,
          message: err.extensions ? err.extensions.response.body : err.message,
          id: null,
        };
      }
    },
    joinTable: async (_, { id, userId }) => {
      try {
        await eventController.userJoinTable(id, userId);
        return {
          code: 200,
          success: true,
          message: `User ${userId} successfully joined table ${id}`,
          id,
        };
      } catch (err) {
        return {
          code: err.extensions ? err.extensions.response.status : 500,
          success: false,
          message: err.extensions ? err.extensions.response.body : err.message,
          id: null,
        };
      }
    },
    addMessageToChat: async (_, { id, chat, chatData }) => {
      try {
        await eventController.saveChatMessage(id, chat, chatData);
        return {
          code: 200,
          success: true,
          message: `Successfully added message to chat ${chat}`,
          id,
        };
      } catch (err) {
        return {
          code: err.extensions ? err.extensions.response.status : 500,
          success: false,
          message: err.extensions ? err.extensions.response.body : err.message,
          id: null,
        };
      }
    },
  },
  Subscription: {
    chatMessageAdded: {
      resolve: (value) => {
        return value;
      },
      subscribe: () => pubsub.asyncIterator(wsEvents.chatMessageEvent),
    },
    gameAdded: {
      resolve: (value) => {
        return value;
      },
      subscribe: () => pubsub.asyncIterator("GAME_ADDED"),
    },
    gameDeleted: {
      resolve: (value) => {
        return value;
      },
      subscribe: () => pubsub.asyncIterator("GAME_DELETED"),
    },
    tableAdded: {
      resolve: (value) => {
        return value;
      },
      subscribe: () => pubsub.asyncIterator(wsEvents.createTableEvent),
    },
    tableDeleted: {
      resolve: (value) => {
        return value;
      },
      subscribe: () => pubsub.asyncIterator(wsEvents.deleteTableEvent),
    },
    userJoinedTable: {
      resolve: (value) => {
        return value;
      },
      subscribe: () => pubsub.asyncIterator(wsEvents.userJoinTableEvent),
    },
    userLeftTable: {
      resolve: (value) => {
        return value;
      },
      subscribe: () => pubsub.asyncIterator(wsEvents.userLeftTableEvent),
    },
  },
};

module.exports = resolvers;
