import user from "../js/services/user.js";
import game from "../js/services/game.js";
import table from "../js/services/table.js";
import fetchProfileInfo from "./services/fetchProfileInfo.js";
import jumpToStartPage from "./utils/jumpToStartPage.js";
import createGameCardHtml from "./utils/createGameCardHtml.js";
import showError from "./utils/showError.js";
import app from "./config.js";
import createTableCardHtml from "./utils/createTableCardHtml.js";
import { getId, getToken } from "./utils/localStorage.js";

const { token, gameIdKey } = app;
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

async function getPage(page) {
  try {
    const data = await fetchProfileInfo(page, getToken());
    if (!data) return jumpToStartPage();

    const {
      user: { role, username, email },
      games,
    } = data;

    myRole.innerText = `Role: ${role}`;
    myUsername.innerText = `Nickname: ${username}`;
    myEmail.innerText = `Email: ${email}`;
    localStorage.setItem("userData", JSON.stringify(data.user));

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
  localStorage.setItem(gameIdKey, id);

  document.location = "/lobby-room";
}

async function createGame(ws) {
  addGameForm.classList.toggle("hidden");

  const form = document.querySelector(".add-game-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const gameData = new FormData(form);
    form.reset();

    try {
      const newGame = await game.create(gameData, getToken());
      ws.send(JSON.stringify({ game: newGame, event: "addGame" }));

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

async function deleteGame(ws) {
  deleteGameForm.classList.toggle("hidden");

  const form = document.querySelector(".delete-game-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const gameData = new FormData(form);
    const id = gameData.get("gameId");
    form.reset();

    try {
      const isDeleted = await game.delete(id, getToken());
      if (isDeleted) ws.send(JSON.stringify({ id, event: "deleteGame" }));

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
  const data = await fetchProfileInfo("lobby", getToken(), gameId);
  if (!data) return jumpToStartPage();

  ws.send(JSON.stringify({ id: gameId, event: "getChat" }));

  const { game, tables } = data;
  lobbyTitle.innerText = `You are in the lobby of ${game.title}`;

  if (!tables.length) return;
  const html = tables.map(createTableCardHtml).join("\n");
  tablesEl.insertAdjacentHTML("afterbegin", html);
}

async function createNewGameTable(ws) {
  createTableBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    try {
      const newTable = await table.create(getId(), getToken());
      ws.send(JSON.stringify({ table: newTable, event: "createTable" }));
    } catch (error) {
      showError(error);
    }
  });
}

async function deleteGameTable(ws) {
  deleteTableForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(deleteTableForm);
    const tableId = formData.get("id");
    deleteTableForm.reset();

    const gameId = getId();
    const isDeleted = await table.delete(gameId, tableId, getToken());

    if (isDeleted)
      ws.send(JSON.stringify({ gameId, tableId, event: "deleteTable" }));
  });
}

function sendChatMessage(ws, gameId) {
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(chatForm);
    const message = formData.get("message");
    const { username } = JSON.parse(localStorage.getItem("userData"));
    const date = new Date().toISOString();

    ws.send(
      JSON.stringify({
        id: gameId,
        chatData: { username, message, date },
        event: "chat",
      })
    );

    chatForm.reset();
  });
}

export {
  getPage,
  logout,
  createGame,
  enterToGameLobby,
  deleteGame,
  getLobbyPage,
  createNewGameTable,
  deleteGameTable,
  sendChatMessage,
};
