module.exports = ({ statusCode, body }, headers = null) => ({
  statusCode,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
    ...headers,
  },
  body: JSON.stringify(body),
});
