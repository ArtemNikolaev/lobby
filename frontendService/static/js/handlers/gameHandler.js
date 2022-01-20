import { webSocket } from "../config.js";
import game from "../fetchServices/game.js";
import { getToken } from "../utils/localStorage.js";
import showError from "../utils/showError.js";

const { addGameEvent, deleteGameEvent } = webSocket;
const addGameForm = document.querySelector(".add-game");
const addResponseMessage = document.querySelector("#add-response-msg");
const showFormBtn = document.querySelector(".show-add-game-btn");

class GameHandler {
  createGameListener(ws) {
    showFormBtn.addEventListener("click", () => {
      addGameForm.classList.toggle("hidden");

      const form = document.querySelector(".add-game-form");
      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const gameData = new FormData(form);
        form.reset();

        try {
          const newGame = await game.create(gameData, getToken());
          ws.send(JSON.stringify({ game: newGame, event: addGameEvent }));

          addResponseMessage.innerText =
            "Game successfully added to the GameLobby";
          addResponseMessage.style.display = "block";

          setTimeout(() => {
            addResponseMessage.style.display = "none";
            addGameForm.classList.toggle("hidden");
          }, 2000);
        } catch (error) {
          showError(error);
        }
      });
    });
  }

  deleteGameListener(ws) {
    document.addEventListener("click", async (e) => {
      if (!e.target.classList.contains("delete-link")) return;

      const id = e.target.id.split("-")[1];

      try {
        const isDeleted = await game.delete(id, getToken());
        if (!isDeleted) return;

        ws.send(JSON.stringify({ id, event: deleteGameEvent }));
      } catch (error) {
        showError(error);
      }
    });
  }
}

export default new GameHandler();
