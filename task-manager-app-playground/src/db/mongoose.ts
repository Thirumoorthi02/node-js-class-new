import * as mongoose from "mongoose";

const connectionURL = "mongodb://127.0.0.1:27017";
const dbName = "task-manager-api";

// mongoose.connect(`${connectionURL}/${dbName}`)
mongoose.connect(connectionURL, { dbName });
