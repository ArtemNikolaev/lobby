export default ({ id, title, description, url }) => {
  return `
    <div class="card" id="cardId-${id}">
      <img src="${url.split("public")[1]}" alt="" />
      <p>ID: ${id}</p>
      <h6 id="game-name">${title}</h6>
      <div id="game-description">${description}</div>
      <a href=""><h6>Join to the game</h6></a>
    </div>
  `;
};
