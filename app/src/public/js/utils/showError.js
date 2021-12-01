export default (error) => {
  window.console.log(error);
  // eslint-disable-next-line no-alert
  alert(`Ouch!\nError: ${error.message}`);
};
