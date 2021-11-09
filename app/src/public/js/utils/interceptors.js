import jumpToStartPage from "./jumpToStartPage.js";

export async function noContentInterceptor(response) {
  if (response.status === 401) jumpToStartPage();

  if (response.status !== 204) {
    const data = await response.json();
    throw new Error(data.message);
  }
}

export async function createdInterceptor(response, data) {
  if (response.status === 401 || response.status === 403) jumpToStartPage();

  if (response.status !== 201) throw new Error(data.message);
}

export function okInterceptor(response, data) {
  if (response.status === 401 || response.status === 403) jumpToStartPage();

  if (response.status !== 200) {
    throw new Error(data.message);
  }
}
