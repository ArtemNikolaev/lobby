import { app } from "../config.js";
import { okInterceptor } from "../utils/interceptors.js";

export default async (path, jwt, id) => {
  if (!jwt) return null;

  const resource = id ? `${path}/${id}` : path;

  const response = await fetch(`${app.url}/pages/${resource}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  const data = await response.json();
  okInterceptor(response, data);

  return data;
};
