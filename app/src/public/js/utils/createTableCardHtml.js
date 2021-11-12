export default ({ tableId, creator, count }) => {
  return `
    <div class="table-card" id="tableId-${tableId}">
      <h5>Table ID: ${tableId}</h5>
      <p>creator: ${creator}</p>
      <p>players: <span id="players-${tableId}">${count}</span></p>
      <p>viewers: 0</p>
      <a class="btn btn-success table-link" id="btn-${tableId}">Play</a>
    </div>
  `;
};
