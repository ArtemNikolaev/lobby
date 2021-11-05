class Game {
  constructor() {
    this.url = "/games";
  }

  async create(body, jwt) {
    const response = await fetch(this.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body,
    });

    if (response.status !== 201) {
      const data = await response.json();
      throw new Error(data.message);
    }
  }

  async delete(id, jwt) {
    const response = await fetch(this.url + `/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (response.status !== 204) {
      const data = await response.json();
      throw new Error(data.message);
    }
  }

  async getTables(id, jwt) {
    const response = await fetch(this.url + `/${id}/tables`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    const data = await response.json();
    if (response.status !== 200) {
      throw new Error(data.message);
    }

    return data;
  }

  async createTable(id, jwt) {
    const response = await fetch(this.url + `/${id}/tables`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (response.status !== 201) {
      const data = await response.json();
      throw new Error(data.message);
    }
  }
}

export default new Game();
