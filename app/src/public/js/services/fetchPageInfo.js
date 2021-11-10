import { okInterceptor } from "../utils/interceptors.js";
import jumpToStartPage from "../utils/jumpToStartPage.js";

export default async (path, jwt, id) => {
  if (!jwt) return null;

  const url = id ? `/${path}/${id}` : `/${path}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  const data = await response.json();
  okInterceptor(response, data);

  return data;
};
