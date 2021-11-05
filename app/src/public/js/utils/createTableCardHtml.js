export default ({ id, creator, players, viewers }) => {
  return `
    <div class="table-card">
      <h5>Table ID: ${id}</h5>
      <p>creator: ${creator}</p>
      <p>players: ${players}</p>
      <p>viewers: ${viewers}</p>
      <a class="btn btn-success play-btn" id="tableId-${id}" href="/table-room">Play</a>
    </div>
  `;
};
