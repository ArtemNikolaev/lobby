module.exports = {
  maxPlayers: (data) => {
    return typeof data === "number" && data >= 2;
  },
};
