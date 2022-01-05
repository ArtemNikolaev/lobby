import {
  graphQLRequestInterceptor,
} from "../utils/interceptors.js";
import fetchGraphQL from "./graphQL.js";

class Game {
  constructor() {
    this.url = "/games";
  }

  async create(body, jwt) {
    const query = `mutation CreateGameMutation($title: String!, $description: String, $url: String!) {
      createGame(title: $title, description: $description, url: $url) {
        code
        success
        message
        game {
          id
          title
          description
          url
        }
      }
    }`;
    const json = await fetchGraphQL({
      query,
      variables: {
        title: body.title,
        description: body.description,
        url: body.url,
      },
    }, jwt);

    await graphQLRequestInterceptor(json);
    return json.data.createGame.game;
  }

  async delete(id, jwt) {
    const query = `mutation DeleteGameMutation($id: ID!) {
      deleteGame(id: $id) {
        code
        success
        message
      }
    }`;
    const json = await fetchGraphQL({
      query,
      variables: { id },
    }, jwt);

    await graphQLRequestInterceptor(json);
    return true;
  }
}

export default new Game();
