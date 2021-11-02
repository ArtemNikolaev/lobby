import jumpToStartPage from "../utils/jumpToStartPage.js";

class Lobby {
  async getRoom(path, jwt) {
    if (!jwt) return null;

    const response = await fetch("/" + path, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (response.status === 401 || response.status === 403)
      return jumpToStartPage();

    const data = await response.json();
    if (response.status >= 400) throw new Error(data.message);

    return data;
  }
}

export default new Lobby();
