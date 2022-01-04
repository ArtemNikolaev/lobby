import fetchGraphQL from "../../fetchServices/graphQL.js";

export default async (tableId) => {
  const query = `query PlayersViewersCountQuery($tableId: ID!) {
    playersViewersCount(tableId: $tableId) {
      players
      viewers
    }
  }`;

  try {
    const json = await fetchGraphQL({
      query,
      variables: {
        tableId,
      },
    });

    const res = json.data.playersViewersCount;
    return res;
  } catch (error) {

  }
};