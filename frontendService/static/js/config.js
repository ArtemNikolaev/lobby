export const app = {
  url: "https://8lquunx1g9.execute-api.eu-central-1.amazonaws.com/dev",
  s3StaticURL: "http://lobby.com.s3-website.eu-central-1.amazonaws.com",
  token: "game-lobby-token",
  gameIdKey: "gameId",
  tableIdKey: "tableId",
  userDataKey: "userData",
  userPage: "/profile",
  adminPage: "/admin",
  loginPage: "/signin",
  lobbyPage: "/lobby",
  tablePage: "/table",
};

export const webSocket = {
  url: "wss://h7srn172jl.execute-api.eu-central-1.amazonaws.com/dev",
  chatHistoryEvent: "chatHistory",
  chatMessageEvent: "chatMessage",
  deleteTableEvent: "deleteTable",
  createTableEvent: "createTable",
  deleteGameEvent: "deleteGame",
  addGameEvent: "addGame",
  getPlayersCountEvent: "getPlayersCount",
  userJoinTableEvent: "userJoinTable",
  userLeftTableEvent: "userLeftTable",
};
