const AWS = require("aws-sdk");

module.exports = (domainName, stage) => {
  return new AWS.ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint: `${domainName}/${stage}`,
  });
};
