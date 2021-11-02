export default (error) => {
  console.log(error);
  alert("Ouch!\n" + "Error: " + error.message);
};
