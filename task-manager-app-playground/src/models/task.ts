import { Types, model } from "mongoose";
import { Schema } from "mongoose";

export interface ITask {
  description: string;
  completed: boolean;
  owner: any;
}

const TaskSchema = new Schema<ITask>({
  description: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: Types.ObjectId,
    required: true,
    ref: "User", // should be the model name given
  },
});

// Model name give here is a collection name which will be stored in db as small case and plural form by mongoose
// Eg: name USER will be changed to "users" in db collection name
export const Task = model("Task", TaskSchema);
export default Task;
