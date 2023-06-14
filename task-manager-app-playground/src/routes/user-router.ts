import { Router } from "express";
import { User } from "../models/user";

const router = Router();

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    const userResult = await user.save();
    res.status(201).send(userResult);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(201).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).send("User not found");
    }
    res.status(200).send(user);
  } catch (error: any) {
    if (error.name === "CastError") {
      return res.status(400).send("Invalid Id Passed");
    }
    res.status(500).send(error);
  }
});

router.patch("/users/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      res.status(404).send("User not found");
    }

    res.status(200).send(user);
  } catch (error: any) {
    if (error.name === "CastError") {
      return res.status(400).send("Invalid Id Passed");
    }

    res.status(500).send(error);
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error: any) {
    if (error.name === "CastError") {
      return res.status(400).send("Invalid Id Passed");
    }
    res.status(400).send(error);
  }
});

export const UserRouter = router;
