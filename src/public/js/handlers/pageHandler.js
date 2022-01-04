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
import fetchGraphQL from "../fetchServices/graphQL.js";

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

  async getLobby(gameId) {
    try {
      const query = `query Query($gameId: ID!) {
        game(id: $gameId) {
          title
          id
          tables {
            id
            creator {
              username
            }
            count {
              players
              viewers
            }
          }
        }
      }`;

      const json = await fetchGraphQL({
        query,
        variables: {
          gameId,
        },
      });

      const game = json.data.game;

      lobbyTitle.innerText = `You are in the lobby of ${game.title}`;

      if (game.tables.length) {
        const tables = [];
        for (const table of game.tables) {
          // eslint-disable-next-line no-await-in-loop
          table.count = await getPlayersViewersCount(table.id);
          tables.push(table);
        }

        const html = game.tables
          .map((t) => createTableCardHtml(t))
          .join("\n");
        tablesEl.insertAdjacentHTML("afterbegin", html);
      }

      const chatData = await getChatHistory(gameId, "lobby");
      renderChat(chatData);
    } catch (error) {
      console.log(error)
      showError();
    }
  }

  async getTable(tableId) {
    try {
      const data = await getPage("table", getToken(), tableId);
      if (!data) return jumpToStartPage();

      const { title, id } = data;
      tableTitle.innerText = `${title}. Game Table ID: ${id}`;

      const chatData = await getChatHistory(tableId, "table");
      renderChat(chatData);
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
      document.location = role === "admin" ? adminPage : userPage;
    });
  }
}

export default new PageHandler();
