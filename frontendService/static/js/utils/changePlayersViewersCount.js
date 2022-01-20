export default ({ tableId, count }) => {
  const playersCount = document.querySelector(`#players-${tableId}`);
  const viewersCount = document.querySelector(`#viewers-${tableId}`);

  playersCount.innerText = count.players;
  viewersCount.innerText = count.viewers;
};
