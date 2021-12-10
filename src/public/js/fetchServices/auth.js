class Auth {
  async send(data) {
    const { body, path, method } = data;

    return fetch(`/auth/${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }

  async logout(jwt) {
    const response = await fetch("/auth/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (response.status !== 200) throw new Error("Logout Error");
  }
}

export default new Auth();
