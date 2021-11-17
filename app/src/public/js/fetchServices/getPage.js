import { okInterceptor } from "../utils/interceptors.js";
import showError from "../utils/showError.js";

export default async (path, jwt, id) => {
  if (!jwt) return null;

  const url = id ? `/${path}/${id}` : `/${path}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    const data = await response.json();
    okInterceptor(response, data);

    return data;
  } catch (error) {
    showError(error);
  }
};
