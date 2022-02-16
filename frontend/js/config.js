export const app = {
  url: "https://<region>-<projectName>.cloudfunctions.net",
  startPageURL:
    "https://<staticWebsiteBucketName>.storage.googleapis.com/index.html",
  token: "game-lobby-token",
  gameIdKey: "gameId",
  tableIdKey: "tableId",
  userDataKey: "userData",
  userPage: "/profile/index.html",
  adminPage: "/admin/index.html",
  loginPage: "/signin/index.html",
  lobbyPage: "/lobby/index.html",
  tablePage: "/table/index.html",
};

export const webSocket = {
  url: "websocketUrlString",
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
