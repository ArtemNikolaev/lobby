import { getUserData } from "./localStorage.js";

export default ({ id, title, description, url }) => {
  const { role } = getUserData();

  let tag = "";
  if (role === "admin") {
    tag = `<a class="btn btn-danger delete-link" id="deleteCard-${id}">Delete</a>`;
  }

  return `
    <div class="card" id="cardId-${id}">
      <img src="${url.split("public")[1]}" alt="" />
      <h6 id="game-name">${title}</h6>
      <div style="margin-bottom: 0.5rem" id="game-description">${description}</div>
      <a class="btn btn-success card-link" id="card-${id}">Enter</a>
      ${tag}
    </div>
  `;
};
