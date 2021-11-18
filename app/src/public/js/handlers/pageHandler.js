import { app } from "../config.js";
import getPage from "../fetchServices/getPage.js";
import getPlayersViewersCount from "../websocket/wsRequests/getPlayersViewersCount.js";
import getChatHistory from "../websocket/wsRequests/getChatHistory.js";
import createTableCardHtml from "../utils/createTableCardHtml.js";
import createGameCardHtml from "../utils/createGameCardHtml.js";
import renderChat from "../utils/renderChat.js";
import jumpToStartPage from "../utils/jumpToStartPage.js";
import showError from "../utils/showError.js";
import {
  getToken,
  getUserData,
  setGameId,
  setUserData,
} from "../utils/localStorage.js";

const { lobbyPage, adminPage, userPage } = app;
const myUsername = document.querySelector("#username");
const myEmail = document.querySelector("#email");
const myRole = document.querySelector("#role");
const gameCards = document.querySelector(".game-cards");
const lobbyTitle = document.querySelector("#lobby-title");
const tablesEl = document.querySelector(".tables");
const tableTitle = document.querySelector("#table-title");

class PageHandler {
  async getProfile(page) {
    try {
      const data = await getPage(page, getToken());
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

  async getLobby(ws, gameId) {
    try {
      const data = await getPage("lobby", getToken(), gameId);
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
      renderChat(chat.chatData);
    } catch (error) {
      showError();
    }
  }

  async getTable(ws, tableId) {
    try {
      const data = await getPage("table", getToken(), tableId);
      if (!data) return jumpToStartPage();

      const { title, id } = data;
      tableTitle.innerText = `${title}. Game Table ID: ${id}`;

      const chat = await getChatHistory(ws, tableId, "table");
      renderChat(chat.chatData);
    } catch (error) {
      showError();
    }
  }

  jumpToLobbyListener() {
    document.addEventListener("click", (e) => {
      if (!e.target.classList.contains("card-link")) return;

      const id = e.target.id.split("-")[1];

      setGameId(id);
      document.location = lobbyPage;
    });
  }

  jumpToProfileListener() {
    document.querySelector("#profile-page").addEventListener("click", (e) => {
      e.preventDefault();

      const { role } = getUserData();
      console.log(role);
      document.location = role === "admin" ? adminPage : userPage;
    });
  }
}

export default new PageHandler();
