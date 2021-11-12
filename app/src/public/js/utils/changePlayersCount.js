export default ({ tableId, count }) => {
  const targetTable = document.querySelector(`#players-${tableId}`);

  targetTable.innerText = count;
};
