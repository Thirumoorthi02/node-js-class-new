import * as mongoose from "mongoose";
import UserSchema from "./../schemas/User";
import TaskSchema from "./../schemas/Task";

const connectionURL = "mongodb://127.0.0.1:27017";
const dbName = "task-manager-api";

// mongoose.connect(`${connectionURL}/${dbName}`)
mongoose.connect(connectionURL, { dbName });

// Model name give here is a collection name which will in stored in db as small case and plural form by mongoose
// Eg: name USER will be changed to "users" in db collection name
const User = mongoose.model("USER", UserSchema);
const Task = mongoose.model("tasks", TaskSchema);

const me = new User({ name: "Ajit", age: 26 });

me.save().then((value: any) => {
  console.log(value);
});

const task1 = new Task({ description: "Walking", completed: false });

task1.save().then((value: any) => {
  console.log(value);
});
