import { app } from "../config.js";

const { token, gameIdKey, userDataKey, tableIdKey } = app;

export function setGameId(id) {
  return localStorage.setItem(gameIdKey, id);
}
export function getGameId() {
  return localStorage.getItem(gameIdKey);
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
  return localStorage.getItem(tableIdKey);
}
export function deleteTableId() {
  localStorage.removeItem(tableIdKey);
}
