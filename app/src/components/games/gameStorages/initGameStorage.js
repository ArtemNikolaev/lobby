const { UNSUPPORTED_STORAGE_TYPE } = require("../../../helpers/messages");
const GameStorageMongo = require("./gameStorageMongo");
const GameStorageMysql = require("./gameStorageMysql");

module.exports = (storageType) => {
  try {
    switch (storageType) {
      case "mysql":
        return new GameStorageMysql();

      case "mongo":
        return new GameStorageMongo();

      default:
        throw UNSUPPORTED_STORAGE_TYPE;
    }
  } catch (error) {
    throw Error(error);
  }
};
