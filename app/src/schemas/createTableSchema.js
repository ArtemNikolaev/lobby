module.exports = {
  maxPlayers: (data) => typeof data === "number" && data >= 2,
};
