const { hash } = require("../helpers/scrypt");
const { accessSecret, linkTTL } = require("../../config").token;
const { port } = require("../../config").app;
const UnauthorizedError = require("../errors/unauthorizedError");
const { WRONG_CREDENTIALS } = require("../helpers/messages");
const { verify } = require("../helpers/scrypt");
const tokenService = require("../components/token/tokenService");
const NotFoundError = require("../errors/notFoundError");
const { USER_NOT_FOUND, CHECK_EMAIL } = require("../helpers/messages");
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
          track: null,
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
          track: null,
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
          track: null,
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
        return {
          code: 200,
          success: true,
          message: `Successfully created game ${title}`,
          game,
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
    deleteGame: async (_, { id }, { dataSources }) => {
      try {
        await dataSources.gameAPI.deleteById(id);
        return {
          code: 200,
          success: true,
          message: `Successfully deleted game ${id}`,
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
    createTable: async (_, { game_id, max_players, userToken }, { dataSources }) => {
      try {
        const table = await dataSources.tableAPI.create({
          game_id,
          max_players,
          creatorId: userToken.id
        });

        const user = await dataSources.userAPI.findById(userToken.id);
        return {
          code: 200,
          success: true,
          message: `Successfully created table ${table.id}`,
          table: {
            id: table.id,
            game_id: table.game_id,
            max_players: table.max_players,
            creator: user
          }
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
        return {
          code: 200,
          success: true,
          message: `Successfully deleted table ${id}`,
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
  },
};

module.exports = resolvers;
