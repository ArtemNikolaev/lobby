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
    creator: User
    playersViewersCount(tableId: ID!): PlayersViewersCount
    chatHistory(id: ID!, chat: String!): [ChatMessage!]
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
    createTable(gameId: ID!, maxPlayers: Int!): CreateTableResponse!
    deleteTable(id: ID!): DeleteResponse!
    leaveTable(id: ID!, userId: ID!): LeaveTableResponse!
    joinTable(id: ID!, userId: ID!): LeaveTableResponse!
    addMessageToChat(id: ID!, chat: String!, chatData: ChatMessageInput!): AddMessageToChatResponse!
  }
  
  type Subscription {
    chatMessageAdded(id: ID!): [ChatMessage!]!
    gameAdded: Game!
    gameDeleted: ID!
    tableAdded(gameId: ID!): Table!
    tableDeleted(gameId: ID!): ID!
    userJoinedTable(gameId: ID!): TableUpdate!
    userLeftTable(gameId: ID!): TableUpdate!
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
    id: ID!
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
  
  type LeaveTableResponse implements Response {
    "Similar to HTTP status code, represents the status of the mutation"
    code: Int!
    "Indicates whether the mutation was successful"
    success: Boolean!
    "Human-readable message for the UI"
    message: String!
    id: ID
  }
  
  type AddMessageToChatResponse implements Response {
    "Similar to HTTP status code, represents the status of the mutation"
    code: Int!
    "Indicates whether the mutation was successful"
    success: Boolean!
    "Human-readable message for the UI"
    message: String!
    id: ID
  }

  type Game {
    id: ID!
    title: String!
    description: String
    url: String!
    tables: [Table!]!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
  }

  type Table {
    id: ID!
    creator: User!
    gameId: String!
    maxPlayers: Int!
    count: PlayersViewersCount!
  }
  
  type TableUpdate {
    id: ID!
    userId: ID!
    count: PlayersViewersCount!
  }

  type TableInfo {
    id: ID!
    "User.username ???"
    creator: User!
    gameId: String!
    maxPlayers: Int!
    title: String!
    description: String
  }

  type Message {
    message: String!
  }
  
  type ChatMessage {
    username: String!
    message: String!
    date: String!
  }
  
  type PlayersViewersCount {
    players: Int!
    viewers: Int!
  }
  
  input ChatMessageInput {
    username: String!
    message: String!
    date: String!
  }
`;

module.exports = typeDefs;
