import {
  noContentInterceptor,
  createdInterceptor,
} from "../utils/interceptors.js";

class Table {
  constructor() {
    this.url = "/games";
  }

  async create(id, jwt) {
    const response = await fetch(this.url + `/${id}/tables`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    const data = await response.json();

    await createdInterceptor(response, data);

    return data;
  }

  async delete(gameId, tableId, jwt) {
    const response = await fetch(this.url + `/${gameId}/tables/${tableId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    await noContentInterceptor(response);

    return true;
  }
}

export default new Table();
