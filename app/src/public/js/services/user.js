import jumpToStartPage from "../utils/jumpToStartPage.js";

class User {
  async send(data) {
    const { body, path, method } = data;
    return fetch("/auth/" + path, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }

  async getUser(path, jwt) {
    if (!jwt) return null;

    const response = await fetch("/" + path, {
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
    return fetch("/auth/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
  }
}

export default new User();
