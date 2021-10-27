import app from "../config.js";
import jumpToStartPage from "../utils/jumpToStartPage.js";

class User {
  constructor({ host, port } = app) {
    this.url = `http://${host}:${port}`;
    this.jwt = localStorage.getItem("jwt-token");
  }

  async sendData(data, action) {
    return fetch(`${this.url}/auth/` + action, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }

  async getUser() {
    if (!this.jwt) return null;

    const response = await fetch(this.url + "/my-lobby", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.jwt}`,
      },
    });

    const data = await response.json();

    if (response.status === 401) return jumpToStartPage();
    if (response.status >= 400) throw new Error(data.message);

    return data;
  }

  async logout() {
    await fetch(this.url + "/auth/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.jwt}`,
      },
    });

    localStorage.removeItem("jwt-token");
  }
}

export default new User();
