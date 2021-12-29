const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    table(id: ID!): Table
    tableInfo: TableInfo
    games: [Game!]!
    game(id: ID!): Game
    userById: User
    userByEmail: User
    userByUsername: User
    userByLogin: User
  }

  type Mutation {
    register(
      email: String!
      username: String!
      password: String!
    ): RegisterResponse!
    login(emailOrUsername: String!, password: String!): LoginResponse!
    sendResetLink(email: String!): SendResetLinkResponse!
    resetPassword(email: String!, password: String!): ResetPasswordResponse!
    createGame(
      title: String!
      description: String
      url: String!
    ): CreateGameResponse!
    deleteGame(id: ID!): DeleteResponse!
    createTable(game_id: ID!, max_players: Int!): CreateTableResponse!
    deleteTable(id: ID!): DeleteResponse!
  }

  interface Response {
    "Similar to HTTP status code, represents the status of the mutation"
    code: Int!
    "Indicates whether the mutation was successful"
    success: Boolean!
    "Human-readable message for the UI"
    message: String!
  }

  type RegisterResponse implements Response {
    "Similar to HTTP status code, represents the status of the mutation"
    code: Int!
    "Indicates whether the mutation was successful"
    success: Boolean!
    "Human-readable message for the UI"
    message: String!
    id: ID
  }

  type LoginResponse implements Response {
    "Similar to HTTP status code, represents the status of the mutation"
    code: Int!
    "Indicates whether the mutation was successful"
    success: Boolean!
    "Human-readable message for the UI"
    message: String!
    user: User
    token: String
  }

  type SendResetLinkResponse implements Response {
    "Similar to HTTP status code, represents the status of the mutation"
    code: Int!
    "Indicates whether the mutation was successful"
    success: Boolean!
    "Human-readable message for the UI"
    message: String!
    responseMessage: Message
  }

  type ResetPasswordResponse implements Response {
    "Similar to HTTP status code, represents the status of the mutation"
    code: Int!
    "Indicates whether the mutation was successful"
    success: Boolean!
    "Human-readable message for the UI"
    message: String!
  }

  type CreateGameResponse implements Response {
    "Similar to HTTP status code, represents the status of the mutation"
    code: Int!
    "Indicates whether the mutation was successful"
    success: Boolean!
    "Human-readable message for the UI"
    message: String!
    game: Game
  }

  type DeleteResponse implements Response {
    "Similar to HTTP status code, represents the status of the mutation"
    code: Int!
    "Indicates whether the mutation was successful"
    success: Boolean!
    "Human-readable message for the UI"
    message: String!
  }

  type CreateTableResponse implements Response {
    "Similar to HTTP status code, represents the status of the mutation"
    code: Int!
    "Indicates whether the mutation was successful"
    success: Boolean!
    "Human-readable message for the UI"
    message: String!
    table: Table
  }

  type Game {
    id: ID!
    title: String!
    description: String
    url: String!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
  }

  type Table {
    id: ID!
    "User.username ???"
    creator: User!
    game_id: String!
    max_players: Int!
  }

  type TableInfo {
    id: ID!
    "User.username ???"
    creator: User!
    gameId: String!
    max_players: Int!
    title: String!
    description: String
  }

  type Message {
    message: String!
  }
`;

module.exports = typeDefs;
