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

  if (response.status === 401 || response.status === 403)
    return jumpToStartPage();

  const data = await response.json();
  if (response.status >= 400) throw new Error(data.message);

  return data;
};
