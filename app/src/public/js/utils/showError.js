export default (error) => {
  console.log(error);
  alert(
    `Ouch!\n` +
      `An error occurred while uploading data\n` +
      "Error: " +
      error.message
  );
};
