const { MongoClient, ObjectId } = require("mongodb");
const NotFoundError = require("../errors/notFoundError");
const {
  mongoUri,
  dbName,
  usersCollection,
  tablesCollection,
} = require("../config");
const errorObject = require("../utils/errorObject");

const client = new MongoClient(mongoUri);
const TABLE_NOT_FOUND = "Table not found";
const USER_NOT_FOUND = "User not found";

async function create(event) {
  try {
    await client.connect();
    const users = client.db(dbName).collection(usersCollection);
    const { principalId } = event.requestContext.authorizer;

    const data = await users.findOne({ _id: ObjectId(principalId) });
    if (!data) throw new NotFoundError(USER_NOT_FOUND);

    const tableData = {
      creator: data.username,
      game_id: event.pathParameters.gameId,
      max_players: JSON.parse(event.body).maxPlayers,
    };

    const tables = client.db(dbName).collection(tablesCollection);
    const { insertedId } = await tables.insertOne({
      ...tableData,
      game_id: ObjectId(event.pathParameters.gameId),
    });

    return {
      statusCode: 201,
      body: { id: insertedId.toString(), ...tableData },
    };
  } catch (error) {
    return errorObject(error);
  }
}

async function deleteTable(id) {
  try {
    await client.connect();
    const tables = client.db(dbName).collection(tablesCollection);

    const { deletedCount } = tables.deleteOne({ _id: ObjectId(id) });
    if (deletedCount <= 0) throw new NotFoundError(TABLE_NOT_FOUND);

    return { statusCode: 204 };
  } catch (error) {
    return errorObject(error);
  }
}

module.exports = { create, deleteTable };
