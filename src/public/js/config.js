export const app = {
  url: "",
  token: "game-lobby-token",
  gameIdKey: "gameId",
  tableIdKey: "tableId",
  userDataKey: "userData",
  userPage: "/user-profile",
  adminPage: "/admin-profile",
  loginPage: "/auth/login",
  lobbyPage: "/lobby-room",
  tablePage: "/table-room",
};

export const webSocket = {
  url: "wss://0r7n80lhic.execute-api.us-east-1.amazonaws.com/test",
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
