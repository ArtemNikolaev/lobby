import { graphQLRequestInterceptor } from "../utils/interceptors.js";
import fetchGraphQL from "./graphQL.js";

class Table {
  constructor() {
    this.url = "/games";
  }

  async create(id, body, jwt) {
    const query = `mutation CreateTableMutation($gameId: ID!, $maxPlayers: Int!) {
      createTable(gameId: $gameId, maxPlayers: $maxPlayers) {
        code
        success
        message
        table {
          id
          creator {
            username
            id
          }
          gameId
          maxPlayers
        }
      }
    }`;

    const json = await fetchGraphQL(
      {
        query,
        variables: {
          gameId: id,
          maxPlayers: body.maxPlayers,
        },
      },
      jwt
    );

    await graphQLRequestInterceptor(json);
    return json.data.createTable.table;
  }

  async delete(gameId, tableId, jwt) {
    const query = `mutation DeleteTableMutation($id: ID!) {
      deleteTable(id: $id) {
        code
        message
        success
      }
    }`;

    const json = await fetchGraphQL(
      {
        query,
        variables: {
          id: tableId,
        },
      },
      jwt
    );

    await graphQLRequestInterceptor(json);
    return true;
  }
}

export default new Table();
