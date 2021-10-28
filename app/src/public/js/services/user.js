import app from "../config.js";
import jumpToStartPage from "../utils/jumpToStartPage.js";

class User {
  constructor({ host, port } = app) {
    this.url = `http://${host}:${port}/`;
    this.jwt = localStorage.getItem("lobby-token");
  }

  async send(data) {
    const { body, path, method } = data;
    return fetch(`${this.url}auth/` + path, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }

  async getUser(path, jwt) {
    if (!jwt) return null;

    const response = await fetch(this.url + path, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    const data = await response.json();

    if (response.status === 401 || response.status === 403)
      return jumpToStartPage();

    if (response.status >= 400) throw new Error(data.message);

    return data;
  }

  async logout(jwt) {
    return fetch(this.url + "auth/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
  }
}

export default new User();
