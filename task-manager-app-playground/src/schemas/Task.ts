import { Schema } from "mongoose";

interface ITask {
  description: string;
  completed: boolean;
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
});

export default TaskSchema;
