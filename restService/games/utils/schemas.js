exports.createGameSchema = {
  title: (data) => typeof data === "string",
  description: (data) => data.length >= 10,
  filepath: (data) => typeof data === "string",
  filename: (data) => typeof data === "string",
  mimeType: (data) => data.startsWith("image/"),
};

exports.createTableSchema = {
  maxPlayers: (data) => typeof data === "number" && data >= 2,
};
