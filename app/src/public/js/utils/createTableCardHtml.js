export default ({ id, creator }) => {
  return `
    <div class="table-card" id="tableId-${id}">
      <h5>Table ID: ${id}</h5>
      <p>creator: ${creator}</p>
      <p>players: 0</p>
      <p>viewers: 0</p>
      <a class="btn btn-success table-link" id="tableId-${id}">Play</a>
    </div>
  `;
};
