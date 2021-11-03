require("dotenv").config();
const server = require("./src/app");
const { host, port } = require("./config").app;

server.listen(port, host, () => {
  global.console.log(`Server has been started! | ${host}:${port}`);
});
