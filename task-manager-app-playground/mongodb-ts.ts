import * as mongodb from "mongodb";
import { MongoClient, Db } from "mongodb";

const connectionURL = "mongodb://127.0.0.1:27017";
const dbName = "task-manager";

const connectToDb = async () => {
  const client: MongoClient = new MongoClient(connectionURL);
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const db: Db = client.db(dbName);
    // await insertToDb(db);
    // await findOperationInDb(db);
    // await updateInDb(db);
    // await deleteInDb(db);
  } catch (error) {
    console.log("some error occured while connecting to db", error);
  } finally {
    client.close();
  }
};

async function deleteInDb(db: Db) {
  const deleteOne = async () => {
    const deletedResult = await db
      .collection("users")
      .deleteOne({ name: "Ajit" });
    console.log(deletedResult);
  };
  const deleteMany = async () => {
    const deletedResult = await db
      .collection("tasks")
      .deleteMany({ completed: false });
    console.log(deletedResult);
  };

  await deleteOne();
  await deleteMany();
}

async function updateInDb(db: Db) {
  const updateOne = async () => {
    const updateResult = await db
      .collection("users")
      .updateOne({ name: "Thiru" }, { $set: { name: "Ajit" } });
    //  update one will update the first result it finds and it takes two params one is to determine key and other is update operators
    console.log(updateResult);
  };
  const updateMany = async () => {
    const updateResult = await db
      .collection("tasks")
      .updateMany({ completed: false }, { $set: { incompletedTask: true } });
    //  update one will update the first result it finds and it takes two params one is to determine key and other is update operators
    console.log(updateResult);
  };

  const updateWithoutUpdateOperator = async () => {
    const updateResult = await db
      .collection("users")
      .updateOne({ name: "Thiru" }, { completedTask: true, taskName: "New" });
    // it will will throw any error as it required update operator
  };

  await updateOne();
  await updateMany();
  // await updateWithoutUpdateOperator();
}

async function findOperationInDb(db: Db) {
  const findOne = async () => {
    const user = await db.collection("users").findOne({ name: "Thiru" });
    console.log(user);
  };
  const findMany = async () => {
    const userList = await db
      .collection("tasks")
      .find({ completed: false })
      .toArray();
    // .find() will fetch all results and gives us cursor obj
    console.log(userList);
  };
  await findOne();
  await findMany();
}

async function insertToDb(db: Db) {
  const inserOne = async () => {
    const record = await db.collection("users").insertOne({
      name: "Thiru",
      age: 26,
    });
    console.log(record);

    /*
    // connect to db alternate method

    MongoClient.connect(connectionURL)
      .then((client) => {
        console.log("Connected to MongoDB");
        const db = client.db(dbName);
        db.collection("users").insertOne({
          name: "Thiru",
          age: 26,
        });
      })
      .catch((error) => {
        return console.log("some error occured while connecting to db");
      });

    */
  };

  const insertMany = async () => {
    try {
      const result = await db.collection("tasks").insertMany([
        {
          description: "Clean the house",
          completed: true,
        },
        {
          description: "Renew inspection",
          completed: false,
        },
      ]);
      console.log(result);
    } catch (error) {
      console.log("Unable to insert tasks!", error);
    }
  };

  await inserOne();
  await insertMany();
}

connectToDb();
