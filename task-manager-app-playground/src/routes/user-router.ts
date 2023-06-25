import { NextFunction, Request, Response, Router } from "express";
import { User, UserInstance } from "../models/user";
import { adminAuth, auth } from "../middleware/auth";
import multer from "multer";
import { resolve } from "path";
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
    res.status(200).send(req.user);
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

    const user = req.user as UserInstance;

    if (!user) {
      return res.status(404).send("User not found");
    }

    updates.forEach(
      // here I am setting user as { [key: string]: any } or user as any as it shows error while assinging using with index key
      (key) => {
        // (user[key] = req.body[key]) // this is shows error in Typescript

        // we can use like this or switch case for each keys
        // ((user as { [key: string]: any })[key] = req.body[key])

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

    let user = req.user as UserInstance;
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
    let user = req.user as UserInstance;
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
    let user = req.user as UserInstance;
    user.tokens = [];
    await user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

// upload demo using multer
let fileName = "index.html";
const uploadDemo = multer({
  // dest: "./../uploads", // we can give destination here or inside storage
  storage: multer.diskStorage({
    // function to set detination where file needs to be saved
    destination: function (req, file, cb) {
      cb(null, "src/uploads/");
    },
    // function to send file name by which it will be saved
    filename: function (req, file, cb) {
      req.body.upload = {
        fileProperties: file,
      };
      fileName = file.originalname;
      cb(null, file.originalname);
    },
  }),
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter(req, file, callback) {
    console.log(file);
    if (
      !file.originalname.match(
        /.(docs|doc|docx|pdf|jpg|jpeg|png|svg|html|json)$/
      )
    ) {
      callback(new Error("Only images, html, json and docs/pdf accepted"));
    }
    // callback(null, false); //  if we pass false it will not add file to the destination
    callback(null, true);
  },
});

// for upload demo
router.post(
  "/upload",
  uploadDemo.single("upload"),
  (req: Request, res: Response) => {
    res.send();
    // res.sendFile(resolve("./uploads/Screenshot.png"));
  },
  // this is error handler and error handlers are always at the last params
  (err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(400).send({ message: err.message });
  }
);

router.post(
  "/uploadMany",
  // validations and configurations will be run for individual files in multi uploads
  // uploadDemo.fields([{ name: "uploads", maxCount: 20 }]), // we can provide multiple field names and values in each fields
  uploadDemo.array("uploads", 20), // accepts multiple data with name uploads 
  // uploadDemo.any(), // accepts uploads with any field name
  // uploadDemo.none(), // accepts non files in form data and throws error if file is received
  (req: Request, res: Response) => {
    // console.log(req.body);
    // res.send(req.body);
    res.send();
    // res.sendFile(resolve("./uploads/Screenshot.png"));
  },
  // this is error handler and error handlers are always at the last params
  (err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(400).send({ message: err.message });
  }
);

/**
 * Error Handlers
 * 1. It should always starts with err param,
 * 2. It should always be after the req handler/ last param
 */

// for upload demo
router.get("/lastUpload", (req, res) => {
  res.sendFile(resolve(`src/uploads/${fileName}`));
});

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an image"));
    }

    cb(null, true);
  },
});

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as UserInstance;

    if (req.file) {
      user.avatar = req.file.buffer;
    } else {
      next(new Error("Error while uploading avatar"));
    }
    // const buffer = await sharp(req.file.buffer)
    //   .resize({ width: 250, height: 250 })
    //   .png()
    //   .toBuffer();
    // req.user.avatar = buffer;
    await user.save();
    res.send();
  },
  (error: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

router.get("/users/:id/avatar", auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
});

export const UserRouter = router;
