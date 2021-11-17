import {
  createdInterceptor,
  noContentInterceptor,
} from "../utils/interceptors.js";
import showError from "../utils/showError.js";

class Game {
  constructor() {
    this.url = "/games";
  }

  async create(body, jwt) {
    try {
      const response = await fetch(this.url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        body,
      });
      const data = await response.json();

      await createdInterceptor(response, data);
      return data;
    } catch (error) {
      showError(error);
    }
  }

  async delete(id, jwt) {
    try {
      const response = await fetch(this.url + `/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      await noContentInterceptor(response);

      return true;
    } catch (error) {
      showError(error);
    }
  }
}

export default new Game();
