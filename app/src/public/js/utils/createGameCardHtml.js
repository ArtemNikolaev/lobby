export default ({ id, title, description, url }) => {
  return `
    <div class="card" id="cardId-${id}">
      <img src="${url.split("public")[1]}" alt="" />
      <p>ID: ${id}</p>
      <h6 id="game-name">${title}</h6>
      <div id="game-description">${description}</div>
      <p><a class="card-links" id="card-${id}" href=""><h6>Game Lobby</h6></a></p>
    </div>
  `;
};
