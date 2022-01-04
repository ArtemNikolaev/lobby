export default ({ id, creator, count }) => `
    <div class="table-card" id="tableId-${id}">
      <h5>Table ID: ${id}</h5>
      <p>creator: ${creator.username}</p>
      <p>players: <span id="players-${id}">${count.players}</span></p>
      <p>viewers: <span id="viewers-${id}">${count.viewers}</span></p>
      <a class="btn btn-success table-link" id="btn-${id}">Play</a>
    </div>
  `;
