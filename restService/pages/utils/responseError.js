module.exports = (res, error) => {
  global.console.log(error);

  res.status(error.statusCode || 500).json({ message: error.message });
};
