require("dotenv").config();
const app = require("./src/app");
const { host, port } = require("./config").app;

app.listen(port, host, () => {
  global.console.log(`Server has been started! | ${host}:${port}`);
});
