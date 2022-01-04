const { createClient } = graphqlWs;

export default () => {
  const GRAPHQL_ENDPOINT = "ws://localhost:8000/graphql";

  const client = createClient({
    url: GRAPHQL_ENDPOINT,
  });

  return client;
};
