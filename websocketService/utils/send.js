module.exports = async (client, connectionId, data) => {
  await client
    .postToConnection({
      ConnectionId: connectionId,
      Data: JSON.stringify(data),
    })
    .promise();
};
