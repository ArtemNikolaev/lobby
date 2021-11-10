import app from "../config.js";
const { token, gameIdKey, userDataKey, tableIdKey } = app;

export function getGameId() {
  return localStorage.getItem(gameIdKey);
}

export function getTableId() {
  return localStorage.getItem(tableIdKey);
}

export function getToken() {
  return localStorage.getItem(token);
}

export function getUserData() {
  return JSON.parse(localStorage.getItem(userDataKey));
}

export function setUserData(user) {
  localStorage.setItem(userDataKey, JSON.stringify(user));
}
