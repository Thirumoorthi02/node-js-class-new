import { Document, HydratedDocument, Model, Types, model } from "mongoose";
import { Schema } from "mongoose";
import validator from "validator";
import { hashPasswordSync, validatePassword } from "../encryption-tools/bcrypt";
import { generateJWTAuthToken } from "../encryption-tools/jwt";
import Task, { ITask } from "./task";
// const validator = require('validator');

// Interface for user
interface IUser extends Document {
  name: string;
  email: string;
  age: number;
  password: string;
  tokens: Array<{ token: string }>;
  admin?: boolean;
}

// interface for User methods
interface IUserMethods {
  generateAuthToken(): Promise<string>;
}

// export type UserInstance = HydratedDocument<IUser, IUserMethods>;
export type UserInstance = Document<unknown, {}, IUser> &
  Omit<
    IUser & {
      _id: Types.ObjectId;
    },
    "generateAuthToken" | "tasks"
  > &
  IUserVirtual &
  IUserMethods;

interface IUserModel extends Model<IUser, {}, IUserMethods, IUserVirtual> {
  findByCredentials(email: string, password: string): UserInstance;
}

interface IUserVirtual {
  tasks: ITask;
}

const userSchema = new Schema<IUser, IUserModel>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true, // it create index and it will only accept unique values
    required: true,
    trim: true,
    lowercase: true,
    validate(value: string) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate(value: string) {
      if (value.toLowerCase().includes("password")) {
        throw new Error('Password cannot contain "password"');
      }
    },
  },
  age: {
    type: Number,
    default: 0,
    validate(value: number) {
      if (value < 0) {
        throw new Error("Age must be a postive number");
      }
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  admin: {
    type: Boolean,
    default: false,
  },
});

// to create virtual property
userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});

// to check credentials adding static method
userSchema.statics.findByCredentials = async (
  email: string,
  password: string
) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unable to login!");
  }

  const isMatch = await validatePassword(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login!");
  }

  return user;
};

/*
// Alternate way to add static methods

userSchema.static(
  "findByCredentials",
  async (email: string, password: string) => {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Unable to login!");
    }

    const isMatch = validatePassword(password, user.password);

    if (!isMatch) {
      throw new Error("Unable to login!");
    }

    return user;
  }
);
*/

// toJSON is a function which will be called to conver object in JSON before we send as response
// we can override this function to always send expected value
userSchema.methods.toJSON = function () {
  const { name, email, age, _id } = this as UserInstance;
  return { name, email, age, _id };
};

userSchema.method("generateAuthToken", async function () {
  const user = this as UserInstance;

  const token = generateJWTAuthToken({ _id: user._id });
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
});

// Hash the plain password
userSchema.pre("save", function (next: (value?: any) => void) {
  const user = this;
  if (user.isModified("password")) {
    user.password = hashPasswordSync(user.password);
  }
  next();
});

// Deleting all tasks associated with user when user is deleted
userSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next: (value?: any) => void) {
    const user = this;
    await Task.deleteMany({ owner: user._id });
    next();
  }
);

// Model name give here is a collection name which will be stored in db as small case and plural form by mongoose
// Eg: name User will be changed to "users" in db collection name
// export const User = model("User", userSchema) as Model<IUser, any, any, any> &
//   IUserStatics;
export const User = model<IUser, IUserModel>("User", userSchema);
export default User;

// const me = new User({ name: "Ajit", age: 26, email: "abc@1.com" });

// me.save().then((value: any) => {
//   console.log(value);
// });
