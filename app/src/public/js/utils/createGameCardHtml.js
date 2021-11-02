export default ({ id, title, description, url }) => {
  return `
    <div class="card" id="${id}">
      <img src="${url}" alt="" />
      <h6 id="game-name">${title}</h6>
      <div id="game-description">${description}</div>
      <a href="/lobby"><h6>Join to the game</h6></a>
    </div>
  `;
};
