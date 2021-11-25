const { UNSUPPORTED_STORAGE_TYPE } = require("../../../helpers/messages");
const TableStorageMongo = require("./tableStorageMongo");
const TableStorageMysql = require("./tableStorageMysql");

module.exports = (storageType) => {
  try {
    switch (storageType) {
      case "mysql":
        return new TableStorageMysql();

      case "mongo":
        return new TableStorageMongo();

      default:
        throw UNSUPPORTED_STORAGE_TYPE;
    }
  } catch (error) {
    throw Error(error);
  }
};
