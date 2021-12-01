const { UNSUPPORTED_STORAGE_TYPE } = require("../../../helpers/messages");
const UserStorageMongo = require("./userStorageMongo");
const UserStorageMysql = require("./userStorageMysql");

module.exports = (storageType) => {
  try {
    switch (storageType) {
      case "mysql":
        return new UserStorageMysql();

      case "mongo":
        return new UserStorageMongo();

      default:
        throw UNSUPPORTED_STORAGE_TYPE;
    }
  } catch (error) {
    throw Error(error);
  }
};
