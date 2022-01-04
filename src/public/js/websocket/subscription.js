class SubscriptionService {
  subscribeOnChatMessage(client, gameId, onNext) {
    this.subcribe(
      client,
      `subscription { chatMessageAdded(id: "${gameId}") { username message utcSecondsSinceEpoch } }`,
      (response) => {
        onNext(response.data.chatMessageAdded)
      }
    );
  };

  subscribeOnAddGame(client, onNext) {
    this.subcribe(
      client,
      `subscription { gameAdded { id title description url } }`,
      (response) => {
        onNext(response.data.gameAdded)
      }
    );
  };

  subscribeOnDeleteGame(client, onNext) {
    this.subcribe(
      client,
      `subscription { gameDeleted }`,
      (response) => {
        onNext(response.data.gameDeleted)
      }
    );
  };

  subscribeOnAddTable(client, gameId, onNext) {
    this.subcribe(
      client,
      `subscription { tableAdded(gameId: "${gameId}") { id creator { username } gameId maxPlayers count { players viewers } } }`,
      (response) => {
        onNext(response.data.tableAdded)
      }
    );
  };

  subscribeOnDeleteTable(client, gameId, onNext) {
    this.subcribe(
      client,
      `subscription { tableDeleted(gameId: "${gameId}") }`,
      (response) => {
        onNext(response.data.tableDeleted)
      }
    );
  };

  subscribeOnJoinTable(client, gameId, onNext) {
    this.subcribe(
      client,
      `subscription { userJoinedTable(gameId: "${gameId}") { id, userId, count { players viewers } } }`,
      (response) => {
        onNext(response.data.userJoinedTable)
      }
    );
  };

  subscribeOnLeftTable(client, gameId, onNext) {
    this.subcribe(
      client,
      `subscription { userLeftTable(gameId: "${gameId}") { id, userId, count { players viewers } } }`,
      (response) => {
        onNext(response.data.userLeftTable)
      }
    );
  };


  async subcribe(client, query, onNext) {
    try {
      await new Promise((resolve, reject) => {
        const unsubscribe = client.subscribe(
          {
            query,
          },
          {
            next: onNext,
            error: reject,
            complete: resolve,
          }
        );
      });
    } catch (error) {
      console.error(error);
    }
  };
}

export default new SubscriptionService();
