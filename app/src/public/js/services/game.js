import {
  createdInterceptor,
  noContentInterceptor,
} from "../utils/interceptors.js";

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

    await createdInterceptor(response);
  }

  async delete(id, jwt) {
    const response = await fetch(this.url + `/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    await noContentInterceptor(response);
  }
}

export default new Game();
