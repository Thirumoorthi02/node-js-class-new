import { Router } from "express";
import { User, UserInstance } from "../models/user";
import { adminAuth, auth } from "../middleware/auth";

const router = Router();

// Router for signup user
router.post("/users/signup", async (req, res) => {
  try {
    const user = new User(req.body);
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Router for login user
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token: string = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

// router to get list of all users only for admins
/**
 * We can add middleware as second param and it will be triggered before the actual route function
 */
router.get("/users", auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

// router to get particular user
router.get("/users/myprofile", auth, async (req, res) => {
  try {
    res.status(200).send((req as any)["user"]);
  } catch (error: any) {
    res.status(500).send(error);
  }
});

// router to update user details
router.patch("/users", auth, async (req, res) => {
  const updates: string[] = Object.keys(req.body);
  const allowedUpdates: string[] = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    /*
    // If we use findByIdAndUpdate() we can apply middleware as it bypasses mongoose, 
    // since it bypasses mongoose we are passing extra params for runValidators and all

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // We will run it separately by finding the document and save it
    */

    // // with findOne, findById methods we will get the install of mongoose model and it will update in the mongodb by save() function
    // const user = await User.findOne({ _id: req.params.id });

    const user = (req as any).user as UserInstance;

    if (!user) {
      return res.status(404).send("User not found");
    }

    updates.forEach(
      // here I am setting user as { [key: string]: any } or user as any as it shows error while assinging using with index key
      (key) =>
        // (user[key] = req.body[key]) // this is shows error in Typescript

        // we can use like this or switch case for each keys
        // ((user as { [key: string]: any })[key] = req.body[key])
        {
          switch (key) {
            case "name":
              user["name"] = req.body.name;
              break;
            case "password":
              user["password"] = req.body.password;
              break;
            case "age":
              user["age"] = req.body.age;
              break;
            case "email":
              user["email"] = req.body.email;
              break;
            default:
              break;
          }
        }
    );
    await user.save();

    res.status(200).send(user);
  } catch (error: any) {
    if (error.name === "CastError") {
      return res.status(400).send("Invalid Id Passed");
    }

    res.status(500).send(error);
  }
});

// router to delete my account user
router.delete("/users/me", auth, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.params.id);

    let user = (req as any).user as UserInstance;
    await user.deleteOne();
    res.send(user);
  } catch (error: any) {
    if (error.name === "CastError") {
      return res.status(400).send("Invalid Id Passed");
    }
    res.status(400).send(error);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    let user = (req as any).user as UserInstance;
    user.tokens = user.tokens.filter((token) => {
      return token.token !== (req as any).token;
    });
    await user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    let user = (req as any).user as UserInstance;
    user.tokens = [];
    await user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

export const UserRouter = router;
