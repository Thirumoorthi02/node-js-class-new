const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const connectionURL = "mongodb://127.0.0.1:27017";
const dbName = "task-manager";

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true }).then(
  (client) => {
    console.log("Connected to MongoDB");
    const db = client.db(dbName);
    db.collection("users").insertOne({
        name:"Thiru",
        age:26
    })
  }
).catch((error)=>{
    return console.log("some error occured while connecting to db");
});
