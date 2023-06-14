import { model } from "mongoose";
import UserSchema from "../schemas/User";

// Model name give here is a collection name which will be stored in db as small case and plural form by mongoose
// Eg: name USER will be changed to "users" in db collection name
export const User = model("USER", UserSchema);
export default User;
// module.exports = User;

// const me = new User({ name: "Ajit", age: 26, email: "abc@1.com" });

// me.save().then((value: any) => {
//   console.log(value);
// });
