import app from "../config.js";
const { token, gameTitleKey, gameIdKey } = app;

export function getId() {
  return localStorage.getItem(gameIdKey);
}

export function getToken() {
  return localStorage.getItem(token);
}

export function getTitle() {
  return localStorage.getItem(gameTitleKey);
}
