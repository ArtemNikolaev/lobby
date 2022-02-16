import { app } from "../config.js";

export default () => {
  document.location.replace(app.startPageURL);
};
