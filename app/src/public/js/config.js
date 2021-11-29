export const app = {
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
  url: "ws://3.218.61.1",
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
