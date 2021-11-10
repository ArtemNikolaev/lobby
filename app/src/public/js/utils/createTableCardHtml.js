export default ({ id, creator, players, viewers }) => {
  return `
    <div class="table-card" id="tableId-${id}">
      <h5>Table ID: ${id}</h5>
      <p>creator: ${creator}</p>
      <p>players: ${players}</p>
      <p>viewers: ${viewers}</p>
      <a class="btn btn-success table-link" id="tableId-${id}">Play</a>
    </div>
  `;
};
