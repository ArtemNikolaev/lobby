import { app } from "../config.js";
const { token, gameIdKey, userDataKey, tableIdKey } = app;

export function setGameId(id) {
  return localStorage.setItem(gameIdKey, id);
}
export function getGameId() {
  const id = localStorage.getItem(gameIdKey);

  if (id.length === 24) return id;
  return parseInt(id);
  // return parseInt(localStorage.getItem(gameIdKey));
}

export function getToken() {
  return localStorage.getItem(token);
}

export function setUserData(user) {
  localStorage.setItem(userDataKey, JSON.stringify(user));
}
export function getUserData() {
  return JSON.parse(localStorage.getItem(userDataKey));
}

export function setTableId(id) {
  localStorage.setItem(tableIdKey, id);
}
export function getTableId() {
  const id = localStorage.getItem(tableIdKey);

  if (id.length === 24) return id;
  return parseInt(id);
  // return parseInt(localStorage.getItem(tableIdKey));
}
export function deleteTableId() {
  localStorage.removeItem(tableIdKey);
}
