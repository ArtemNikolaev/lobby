const { MongoClient, ObjectId } = require("mongodb");
const NotFoundError = require("../errors/notFoundError");
const errorObject = require("../utils/errorObject");
const { uploadToS3, deleteFromS3 } = require("../utils/s3");
const parseMultipartFormData = require("../utils/parseMultipartFormData");
const { mongoUri, dbName, gamesCollection } = require("../config");

const client = new MongoClient(mongoUri);
const GAME_NOT_FOUND = "Game not found";

async function deleteGame(id) {
  try {
    await client.connect();
    const games = client.db(dbName).collection(gamesCollection);

    const data = await games.findOne({ _id: ObjectId(id) });
    if (!data) throw new NotFoundError(GAME_NOT_FOUND);

    const s3ImageKey = data.url.split(".com/")[1];

    await games.deleteOne({ _id: ObjectId(id) });
    await deleteFromS3(s3ImageKey);

    return { statusCode: 204 };
  } catch (error) {
    if (error.errno === 1451) error.message = "Database Error: cannot delete.";
    return errorObject(error);
  }
}

async function create(event) {
  try {
    await client.connect();
    const games = client.db(dbName).collection(gamesCollection);

    const parsedForm = await parseMultipartFormData(event);
    const url = await uploadToS3(parsedForm);

    const { title, description } = parsedForm;
    const data = await games.insertOne({ title, description, url });

    return {
      statusCode: 201,
      body: { id: data.insertedId.toString(), title, description, url },
    };
  } catch (error) {
    return errorObject(error);
  }
}

module.exports = { create, deleteGame };
