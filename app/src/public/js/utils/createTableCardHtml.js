export default ({ tableId, creator, count }) => `
    <div class="table-card" id="tableId-${tableId}">
      <h5>Table ID: ${tableId}</h5>
      <p>creator: ${creator}</p>
      <p>players: <span id="players-${tableId}">${count.players}</span></p>
      <p>viewers: <span id="viewers-${tableId}">${count.viewers}</span></p>
      <a class="btn btn-success table-link" id="btn-${tableId}">Play</a>
    </div>
  `;
