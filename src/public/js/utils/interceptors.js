import jumpToStartPage from "./jumpToStartPage.js";

export async function graphQLRequestInterceptor(response) {
  if (response.errors) {
    console.log(response.errors);
    jumpToStartPage();
    throw new Error("Error in graphql response");
  }
}

export function okInterceptor(response, data) {
  if (response.status === 401 || response.status === 403) {
    jumpToStartPage();
    throw new Error(data.message);
  }

  if (response.status !== 200) throw new Error(data.message);
}
