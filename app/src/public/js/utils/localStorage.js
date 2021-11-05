import app from "../config.js";
const { token, gameTablesKey, gameTitleKey, gameIdKey } = app;

export function getId() {
  return localStorage.getItem(gameIdKey);
}

export function getToken() {
  return localStorage.getItem(token);
}

export function getTitle() {
  return localStorage.getItem(gameTitleKey);
}

export function getTables() {
  const json = localStorage.getItem(gameTablesKey);

  if (json) {
    return JSON.parse(json);
  }
}
