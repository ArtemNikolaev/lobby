import { app } from "../config.js";

class Auth {
  async send(data) {
    const { body, path, method } = data;

    return fetch(`${app.url}/auth/${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }

  async logout(jwt) {
    const response = await fetch(`${app.url}/auth/signout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (response.status !== 200) throw new Error("Logout Error");
  }
}

export default new Auth();
