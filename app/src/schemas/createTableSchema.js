module.exports = {
  maxPlayers: (data) => {
    console.log(typeof data);
    return typeof data === "number" && data >= 2;
  },
};
