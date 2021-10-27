import app from "../config.js";
const { host, port } = app;

export default () => {
  location.replace(`http://${host}:${port}`);
};
