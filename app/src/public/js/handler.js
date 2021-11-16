import { app, webSocket } from "./config.js";
import auth from "../js/services/auth.js";
import game from "../js/services/game.js";
import table from "../js/services/table.js";
import fetchPageInfo from "./services/fetchPageInfo.js";
import jumpToStartPage from "./utils/jumpToStartPage.js";
import createGameCardHtml from "./utils/createGameCardHtml.js";
import showError from "./utils/showError.js";
import renderChat from "./utils/renderChat.js";
import createTableCardHtml from "./utils/createTableCardHtml.js";
import getPlayersViewersCount from "./websocket/wsRequests/getPlayersViewersCount.js";
import getChatHistory from "./websocket/wsRequests/getChatHistory.js";
import {
  deleteTableId,
  getToken,
  getUserData,
  setGameId,
  setTableId,
  setUserData,
} from "./utils/localStorage.js";

const { token, tablePage, lobbyPage, adminPage, userPage } = app;
const {
  addGameEvent,
  deleteGameEvent,
  deleteTableEvent,
  createTableEvent,
  chatMessageEvent,
  userJoinTableEvent,
  userLeftTableEvent,
} = webSocket;

const myUsername = document.querySelector("#username");
const myEmail = document.querySelector("#email");
const myRole = document.querySelector("#role");
const addGameForm = document.querySelector(".add-game");
const addResponseMessage = document.querySelector("#add-response-msg");
const gameCards = document.querySelector(".game-cards");
const lobbyTitle = document.querySelector("#lobby-title");
const tablesEl = document.querySelector(".tables");
const createTableBtn = document.querySelector(".create-table-btn");
const chatForm = document.querySelector("#chat-form");
const tableTitle = document.querySelector("#table-title");
const exitGameBtn = document.querySelector(".exit-game-btn");

async function logout() {
  try {
    const response = await auth.logout(getToken());

    if (response.status !== 200) throw new Error("Logout Error");

    jumpToStartPage();
    localStorage.removeItem(token);
  } catch (error) {
    showError(error);
  }
}

async function getPage(page) {
  try {
    const data = await fetchPageInfo(page, getToken());
    if (!data) return jumpToStartPage();

    const {
      user: { role, username, email },
      games,
    } = data;

    myRole.innerText = `Role: ${role}`;
    myUsername.innerText = `Nickname: ${username}`;
    myEmail.innerText = `Email: ${email}`;
    setUserData(data.user);

    if (!games.length) return;

    const html = games.map(createGameCardHtml).join("\n");
    gameCards.insertAdjacentHTML("afterbegin", html);
  } catch (error) {
    showError(error);
  }
}

function createGame(ws) {
  addGameForm.classList.toggle("hidden");

  const form = document.querySelector(".add-game-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const gameData = new FormData(form);
    form.reset();

    try {
      const newGame = await game.create(gameData, getToken());
      ws.send(JSON.stringify({ game: newGame, event: addGameEvent }));

      addResponseMessage.innerText = "Game successfully added to the GameLobby";
      addResponseMessage.style.display = "block";

      setTimeout(() => {
        addResponseMessage.style.display = "none";
        addGameForm.classList.toggle("hidden");
      }, 2000);
    } catch (error) {
      showError(error);
    }
  });
}

async function deleteGame(e, ws) {
  if (!e.target.classList.contains("delete-link")) return;

  const id = e.target.id.split("-")[1];

  try {
    const isDeleted = await game.delete(id, getToken());
    if (!isDeleted) return;

    ws.send(JSON.stringify({ id, event: deleteGameEvent }));
  } catch (error) {
    showError(error);
  }
}

async function getLobbyPage(ws, gameId) {
  const data = await fetchPageInfo("lobby", getToken(), gameId);
  if (!data) return jumpToStartPage();

  lobbyTitle.innerText = `You are in the lobby of ${data.game.title}`;

  if (data.tables.length) {
    let tables = [];
    for (let table of data.tables) {
      table.count = await getPlayersViewersCount(ws, table.id);
      tables.push(table);
    }

    const html = tables
      .map((t) => createTableCardHtml({ tableId: t.id, ...t }))
      .join("\n");
    tablesEl.insertAdjacentHTML("afterbegin", html);
  }

  const chat = await getChatHistory(ws, gameId, "lobby");
  if (chat.chatData) renderChat(chat.chatData);
}

async function getTablePage(ws, tableId) {
  const data = await fetchPageInfo("table", getToken(), tableId);
  if (!data) return jumpToStartPage();

  const { title, id } = data;
  tableTitle.innerText = `${title}. Game Table ID: ${id}`;

  const chat = await getChatHistory(ws, tableId, "table");
  renderChat(chat.chatData);
}

function createGameTable(ws, gameId) {
  createTableBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    try {
      const newTable = await table.create(gameId, getToken());

      const { id: tableId, user_id: userId, creator } = newTable;
      setTableId(tableId);

      ws.send(
        JSON.stringify({
          tableId,
          userId,
          gameId,
          creator,
          event: createTableEvent,
        })
      );

      document.location = tablePage;
    } catch (error) {
      showError(error);
    }
  });
}

function sendChatMessage(ws, chat, id) {
  const { username } = getUserData();

  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(chatForm);
    const message = formData.get("message");
    const date = new Date();

    ws.send(
      JSON.stringify({
        id,
        chatData: { username, message, date },
        chat,
        event: chatMessageEvent,
      })
    );

    chatForm.reset();
  });
}

function jumpToLobbyPage(e) {
  if (!e.target.classList.contains("card-link")) return;

  const id = e.target.id.split("-")[1];

  setGameId(id);
  document.location = lobbyPage;
}

function joinToTable(e, ws, gameId) {
  if (!e.target.classList.contains("table-link")) return;

  const tableId = parseInt(e.target.id.split("-")[1]);
  const { id: userId } = getUserData();

  ws.send(
    JSON.stringify({ tableId, userId, gameId, event: userJoinTableEvent })
  );

  setTableId(tableId);
  document.location = tablePage;
}

function leaveTable(ws, gameId, tableId) {
  exitGameBtn.addEventListener("click", async () => {
    const count = await getPlayersViewersCount(ws, tableId);

    if (count.players <= 1) {
      const isDeleted = await table.delete(gameId, tableId, getToken());

      if (isDeleted)
        ws.send(JSON.stringify({ tableId, gameId, event: deleteTableEvent }));
    } else {
      const { id: userId } = getUserData();

      ws.send(
        JSON.stringify({ tableId, gameId, userId, event: userLeftTableEvent })
      );
    }

    deleteTableId();
    document.location = lobbyPage;
  });
}

function jumpToProfilePage() {
  document.querySelector("#profile-page").addEventListener("click", (e) => {
    e.preventDefault();

    const { role } = getUserData();
    console.log(role);
    document.location = role === "admin" ? adminPage : userPage;
  });
}

export {
  getPage,
  logout,
  createGame,
  jumpToLobbyPage,
  deleteGame,
  getLobbyPage,
  getTablePage,
  createGameTable,
  sendChatMessage,
  leaveTable,
  joinToTable,
  jumpToProfilePage,
};
