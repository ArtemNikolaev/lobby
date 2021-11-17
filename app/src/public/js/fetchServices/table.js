import {
  noContentInterceptor,
  createdInterceptor,
} from "../utils/interceptors.js";
import showError from "../utils/showError.js";

class Table {
  constructor() {
    this.url = "/games";
  }

  async create(id, jwt) {
    try {
      const response = await fetch(this.url + `/${id}/tables`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      const data = await response.json();

      await createdInterceptor(response, data);

      return data;
    } catch (error) {
      showError(error);
    }
  }

  async delete(gameId, tableId, jwt) {
    try {
      const response = await fetch(this.url + `/${gameId}/tables/${tableId}`, {
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

export default new Table();
