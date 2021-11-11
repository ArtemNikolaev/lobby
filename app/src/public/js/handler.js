import auth from "../js/services/auth.js";
import game from "../js/services/game.js";
import table from "../js/services/table.js";
import fetchPageInfo from "./services/fetchPageInfo.js";
import jumpToStartPage from "./utils/jumpToStartPage.js";
import createGameCardHtml from "./utils/createGameCardHtml.js";
import showError from "./utils/showError.js";
import { app, webSocket } from "./config.js";
import createTableCardHtml from "./utils/createTableCardHtml.js";
import { getToken, getUserData, setUserData } from "./utils/localStorage.js";

const { token, tableIdKey, tablePage, lobbyPage } = app;
const {
  addGameEvent,
  deleteGameEvent,
  deleteTableEvent,
  createTableEvent,
  chatHistoryEvent,
  chatMessageEvent,
} = webSocket;

const myUsername = document.querySelector("#username");
const myEmail = document.querySelector("#email");
const myRole = document.querySelector("#role");
const addGameForm = document.querySelector(".add-game");
const deleteGameForm = document.querySelector(".delete-game");
const addResponseMessage = document.querySelector("#add-response-msg");
const delResponseMessage = document.querySelector("#del-response-msg");
const gameCards = document.querySelector(".game-cards");
const lobbyTitle = document.querySelector("#lobby-title");
const tablesEl = document.querySelector(".tables");
const createTableBtn = document.querySelector(".create-table-btn");
const deleteTableForm = document.querySelector(".delete-table-form");
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

function deleteGame(ws) {
  deleteGameForm.classList.toggle("hidden");

  const form = document.querySelector(".delete-game-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const gameData = new FormData(form);
    const id = gameData.get("gameId");
    form.reset();

    try {
      const isDeleted = await game.delete(id, getToken());
      if (isDeleted) ws.send(JSON.stringify({ id, event: deleteGameEvent }));

      delResponseMessage.innerText = "Game successfully deleted!";
      delResponseMessage.style.display = "block";

      setTimeout(() => {
        delResponseMessage.style.display = "none";
        deleteGameForm.classList.toggle("hidden");
      }, 2000);
    } catch (error) {
      showError(error);
    }
  });
}

async function getLobbyPage(ws, gameId) {
  const data = await fetchPageInfo("lobby", getToken(), gameId);
  if (!data) return jumpToStartPage();

  ws.send(
    JSON.stringify({
      id: gameId,
      chat: "lobby",
      event: chatHistoryEvent,
    })
  );

  const { game, tables } = data;
  lobbyTitle.innerText = `You are in the lobby of ${game.title}`;

  if (!tables.length) return;
  const html = tables.map(createTableCardHtml).join("\n");
  tablesEl.insertAdjacentHTML("afterbegin", html);
}

async function getTablePage(ws, tableId) {
  const data = await fetchPageInfo("table", getToken(), tableId);
  if (!data) return jumpToStartPage();

  ws.send(
    JSON.stringify({
      id: tableId,
      chat: "table",
      event: chatHistoryEvent,
    })
  );

  const { title, id } = data;
  tableTitle.innerText = `${title}. Game Table ID: ${id}`;
}

function createGameTable(ws, gameId) {
  createTableBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    try {
      const newTable = await table.create(gameId, getToken());
      ws.send(JSON.stringify({ table: newTable, event: createTableEvent }));

      localStorage.setItem(tableIdKey, newTable.id);
      document.location = tablePage;
    } catch (error) {
      showError(error);
    }
  });
}

function deleteGameTable(ws, gameId) {
  deleteTableForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(deleteTableForm);
    const tableId = formData.get("id");
    deleteTableForm.reset();

    const isDeleted = await table.delete(gameId, tableId, getToken());

    if (isDeleted)
      ws.send(JSON.stringify({ gameId, tableId, event: deleteTableEvent }));
  });
}

function sendChatMessage(ws, chat, id) {
  const { username } = getUserData();

  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(chatForm);
    const message = formData.get("message");
    const date = new Date().toISOString();

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

function jumpToPage(e, className, key, page) {
  if (!e.target.classList.contains(className)) return;

  const id = e.target.id.split("-")[1];
  localStorage.setItem(key, id);

  document.location = page;
}

function exitGame(ws, gameId, tableId) {
  exitGameBtn.addEventListener("click", async () => {
    const isDeleted = await table.delete(gameId, tableId, getToken());

    if (isDeleted)
      ws.send(JSON.stringify({ gameId, tableId, event: deleteTableEvent }));

    document.location = lobbyPage;
  });
}

export {
  getPage,
  logout,
  createGame,
  jumpToPage,
  deleteGame,
  getLobbyPage,
  getTablePage,
  createGameTable,
  deleteGameTable,
  sendChatMessage,
  exitGame,
};
