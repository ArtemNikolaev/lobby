import fetchGraphQL from "../../fetchServices/graphQL.js";

export default async (id, chat) => {
  const query = `query ChatHistory($id: ID!, $chat: String!) {
    chatHistory(id: $id, chat: $chat) {
      username
      message
      utcSecondsSinceEpoch
    }
  }`;

  try {
    const json = await fetchGraphQL({
      query,
      variables: {
        id,
        chat
      },
    });

    const res = json.data.chatHistory;
    return res;
  } catch (error) {

  }
};
