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
