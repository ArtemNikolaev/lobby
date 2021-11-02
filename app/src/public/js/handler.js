import user from "../js/services/user.js";
import game from "../js/services/game.js";
import lobby from "./services/lobby.js";
import jumpToStartPage from "./utils/jumpToStartPage.js";
import createGameCardHtml from "./utils/createGameCardHtml.js";
import showError from "./utils/showError.js";
import app from "./config.js";

const { token, wsUrl } = app;
const myId = document.querySelector("#id");
const myUsername = document.querySelector("#username");
const myEmail = document.querySelector("#email");
const myRole = document.querySelector("#role");
const addGameForm = document.querySelector(".add-game");
const message = document.querySelector(".response-msg");
const gameCards = document.querySelector(".game-cards");

async function getPlayerLobby() {
  try {
    const jwt = localStorage.getItem(token);

    const data = await lobby.getRoom("lobby-room", jwt);
    if (!data) return jumpToStartPage();

    const {
      user: { role, id, username, email },
      games,
    } = data;

    if (games.length) {
      const html = games.map(createGameCardHtml).join("\n");

      gameCards.insertAdjacentHTML("afterbegin", html);
    }

    myRole.innerText = role;
    myId.innerText = id;
    myUsername.innerText = username;
    myEmail.innerText = email;
  } catch (error) {
    showError(error);
  }
}

async function getAdminLobby() {
  try {
    const jwt = localStorage.getItem(token);

    const data = await lobby.getRoom("admin-room", jwt);
    if (!data) return jumpToStartPage();

    const { role, id, username, email } = data;

    myRole.innerText = role;
    myId.innerText = id;
    myUsername.innerText = username;
    myEmail.innerText = email;
  } catch (error) {
    showError(error);
  }
}

function addNewGameListener() {
  const ws = new WebSocket(wsUrl);

  ws.onopen = () => console.log("Connection opened...");
  ws.onclose = () => console.log("Connection closed...");
  ws.onerror = (error) => showError(error);
  ws.onmessage = async (response) => {
    const data = JSON.parse(response.data);

    if (data.event === "addGame") {
      const html = createGameCardHtml(data.game);
      gameCards.insertAdjacentHTML("beforeend", html);
    }
  };
}

async function createGame() {
  addGameForm.classList.toggle("hidden");

  if (!addGameForm.classList.contains("hidden")) {
    const form = document.querySelector(".add-game-form");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const gameData = new FormData(form);
      const jwt = localStorage.getItem("game-lobby-token");
      form.reset();

      try {
        await game.create(gameData, jwt);

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

async function logout() {
  try {
    const jwt = localStorage.getItem(token);
    const response = await user.logout(jwt);

    if (response.status !== 200) throw new Error("Logout Error");

    localStorage.removeItem(token);
  } catch (error) {
    showError(error);
  }
}

export {
  getPlayerLobby,
  getAdminLobby,
  logout,
  createGame,
  addNewGameListener,
};
