import user from "../js/services/user.js";
import game from "../js/services/game.js";
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
const message = document.querySelector(".response-msg");
const gameCards = document.querySelector(".game-cards");
const lobbyTitle = document.querySelector("#lobby-title");
const tables = document.querySelector(".tables");

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

    document.querySelectorAll(".card-links").forEach((cardLink) => {
      cardLink.addEventListener("click", async (e) => {
        e.preventDefault();
        const id = e.target.id.split("-")[1];
        const title =
          e.target.parentElement.previousElementSibling.previousElementSibling
            .previousElementSibling.innerText;

        const tables = await game.getTables(id, getToken());
        localStorage.setItem(gameTablesKey, JSON.stringify(tables));
        localStorage.setItem(gameIdKey, id);
        localStorage.setItem(gameTitleKey, title);

        document.location = "/lobby-room";
      });
    });
  } catch (error) {
    showError(error);
  }
}

async function createGame() {
  addGameForm.classList.toggle("hidden");

  if (!addGameForm.classList.contains("hidden")) {
    const form = document.querySelector(".add-game-form");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const gameData = new FormData(form);
      form.reset();

      try {
        await game.create(gameData, getToken());

        message.innerText = "Game successfully added to the GameLobby";
        message.style.display = "block";

        setTimeout(() => {
          message.style.display = "none";
        }, 2000);
      } catch (error) {
        showError(error);
      }
    });
  }
}

async function deleteGame() {
  deleteGameForm.classList.toggle("hidden");

  if (!deleteGameForm.classList.contains("hidden")) {
    const form = document.querySelector(".delete-game-form");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const gameData = new FormData(form);
      const id = gameData.get("id");
      form.reset();

      try {
        await game.delete(id, getToken());

        message.innerText = "Game successfully deleted!";
        message.style.display = "block";

        setTimeout(() => {
          message.style.display = "none";
        }, 2000);
      } catch (error) {
        showError(error);
      }
    });
  }
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

async function logout() {
  try {
    const response = await user.logout(getToken());

    if (response.status !== 200) throw new Error("Logout Error");

    localStorage.removeItem(token);
  } catch (error) {
    showError(error);
  }
}

async function getLobbyRoom() {
  let gameTables = getTables();

  if (gameTables) {
    localStorage.removeItem(gameTablesKey);
  } else {
    gameTables = await game.getTables(getId(), getToken());
  }

  lobbyTitle.innerText = `You are in the lobby of ${getTitle()}`;

  if (!gameTables.length) return;

  const html = gameTables.map(createTableCardHtml).join("\n");
  tables.insertAdjacentHTML("afterbegin", html);
}

async function createNewGameTable() {
  try {
    await game.createTable(getId(), getToken());
  } catch (error) {
    showError(error);
  }
}

function createNewGameTableListener() {
  //TODO: WS
  // const html = createTableCardHtml(data)
  // {id: 5, game_id: 2, creator: 2, players: 0, viewers: 0}
}

export {
  getRoom,
  logout,
  createGame,
  deleteGame,
  addNewGameListener,
  deleteGameListener,
  getLobbyRoom,
  createNewGameTable,
};
