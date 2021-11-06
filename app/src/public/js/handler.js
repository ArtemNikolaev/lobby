import user from "../js/services/user.js";
import game from "../js/services/game.js";
import table from "../js/services/table.js";
import fetchProfileInfo from "./services/fetchProfileInfo.js";
import jumpToStartPage from "./utils/jumpToStartPage.js";
import createGameCardHtml from "./utils/createGameCardHtml.js";
import showError from "./utils/showError.js";
import app from "./config.js";
import createTableCardHtml from "./utils/createTableCardHtml.js";
import { getId, getTables, getTitle, getToken } from "./utils/localStorage.js";

const { token, wsUrl, gameTablesKey, gameTitleKey, gameIdKey } = app;
const myUsername = document.querySelector("#username");
const myEmail = document.querySelector("#email");
const myRole = document.querySelector("#role");
const addGameForm = document.querySelector(".add-game");
const deleteGameForm = document.querySelector(".delete-game");
const addResponseMessage = document.querySelector("#add-response-msg");
const delResponseMessage = document.querySelector("#del-response-msg");
const gameCards = document.querySelector(".game-cards");
const lobbyTitle = document.querySelector("#lobby-title");
const tables = document.querySelector(".tables");
const createTableBtn = document.querySelector(".create-table-btn");
const deleteTableForm = document.querySelector(".delete-table-form");

async function logout() {
  try {
    const response = await user.logout(getToken());

    if (response.status !== 200) throw new Error("Logout Error");

    jumpToStartPage();
    localStorage.removeItem(token);
  } catch (error) {
    showError(error);
  }
}

async function getRoom(room) {
  try {
    const data = await fetchProfileInfo(room, getToken());
    if (!data) return jumpToStartPage();

    const {
      user: { role, username, email },
      games,
    } = data;

    myRole.innerText = `Role: ${role}`;
    myUsername.innerText = `Nickname: ${username}`;
    myEmail.innerText = `Email: ${email}`;

    if (!games.length) return;

    const html = games.map(createGameCardHtml).join("\n");
    gameCards.insertAdjacentHTML("afterbegin", html);
  } catch (error) {
    showError(error);
  }
}

async function enterToGameLobby(e) {
  if (e.target.className !== "card-links") return;

  const id = e.target.id.split("-")[1];
  const title =
    e.target.parentElement.previousElementSibling.previousElementSibling
      .previousElementSibling.innerText;

  const tables = await table.getAll(id, getToken());
  localStorage.setItem(gameTablesKey, JSON.stringify(tables));
  localStorage.setItem(gameIdKey, id);
  localStorage.setItem(gameTitleKey, title);

  document.location = "/lobby-room";
}

async function createGame() {
  addGameForm.classList.toggle("hidden");

  const form = document.querySelector(".add-game-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const gameData = new FormData(form);
    form.reset();

    try {
      await game.create(gameData, getToken());

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

async function deleteGame() {
  deleteGameForm.classList.toggle("hidden");

  const form = document.querySelector(".delete-game-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const gameData = new FormData(form);
    const id = gameData.get("id");
    form.reset();

    try {
      await game.delete(id, getToken());

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

function addNewGameListener() {
  const ws = new WebSocket(wsUrl);

  ws.onopen = () => console.log("WS: Listen 'addGame' event...");
  ws.onclose = () => console.log("WS: Connection closed...");
  ws.onerror = (error) => showError(error);
  ws.onmessage = (response) => {
    const data = JSON.parse(response.data);

    if (data.event === "addGame") {
      const html = createGameCardHtml(data.game);
      gameCards.insertAdjacentHTML("beforeend", html);
    }
  };
}

function deleteGameListener() {
  const ws = new WebSocket(wsUrl);

  ws.onopen = () => console.log("WS: Listen 'deleteGame' event...");
  ws.onclose = () => console.log("WS: Connection closed...");
  ws.onerror = (error) => showError(error);
  ws.onmessage = (response) => {
    const data = JSON.parse(response.data);

    if (data.event === "deleteGame") {
      document.querySelector(`#cardId-${data.id}`).remove();
    }
  };
}

async function getLobbyRoom(gameId) {
  let gameTables = getTables();

  if (gameTables) {
    localStorage.removeItem(gameTablesKey);
  } else {
    gameTables = await table.getAll(gameId, getToken());
  }

  lobbyTitle.innerText = `You are in the lobby of ${getTitle()}`;

  if (!gameTables.length) return;

  const html = gameTables.map(createTableCardHtml).join("\n");
  tables.insertAdjacentHTML("afterbegin", html);
}

async function createNewGameTable() {
  createTableBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    try {
      await table.create(getId(), getToken());
    } catch (error) {
      showError(error);
    }
  });
}

async function deleteGameTable() {
  deleteTableForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(deleteTableForm);
    const tableId = formData.get("id");
    deleteTableForm.reset();

    await table.delete(getId(), tableId, getToken());
  });
}

function createNewGameTableListener(gameId) {
  const ws = new WebSocket(wsUrl);

  ws.onopen = () => console.log("WS: Listen 'createTable' event...");
  ws.onclose = () => console.log("WS: Connection closed...");
  ws.onerror = (error) => showError(error);
  ws.onmessage = (response) => {
    const data = JSON.parse(response.data);

    if (data.event === "createTable" && data.table.game_id === +gameId) {
      const html = createTableCardHtml(data.table);
      tables.insertAdjacentHTML("beforeend", html);
    }
  };
}

function deleteGameTableListener(gameId) {
  const ws = new WebSocket(wsUrl);

  ws.onopen = () => console.log("WS: Listen 'deleteTable' event...");
  ws.onclose = () => console.log("WS: Connection closed...");
  ws.onerror = (error) => showError(error);
  ws.onmessage = (response) => {
    const data = JSON.parse(response.data);

    if (data.event === "deleteTable" && data.gameId === gameId) {
      document.querySelector(`#tableId-${data.tableId}`).remove();
    }
  };
}

export {
  getRoom,
  logout,
  createGame,
  enterToGameLobby,
  deleteGame,
  addNewGameListener,
  deleteGameListener,
  getLobbyRoom,
  createNewGameTable,
  deleteGameTable,
  createNewGameTableListener,
  deleteGameTableListener,
};
