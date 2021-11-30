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
  url: `ws://${window.location.host}`,
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
