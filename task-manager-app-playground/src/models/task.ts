import { model } from "mongoose";
import TaskSchema from "../schemas/Task";

// Model name give here is a collection name which will be stored in db as small case and plural form by mongoose
// Eg: name USER will be changed to "users" in db collection name
export const Task = model("tasks", TaskSchema);
export default Task;