import { Schema } from "mongoose";

export default new Schema({
  description: {
    type: String
  },
  completed: {
    type: Boolean,
  },
});
