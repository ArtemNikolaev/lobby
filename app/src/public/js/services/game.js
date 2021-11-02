import jumpToStartPage from "../utils/jumpToStartPage.js";

class Game {
  async create(body, jwt) {
    const response = await fetch("/games", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body,
    });

    if (response.status !== 201) throw new Error("Upload Server Error");
  }
}

export default new Game();
