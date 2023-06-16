import { Router } from "express";
import Task from "../models/task";
import { auth } from "../middleware/auth";
import User, { UserInstance } from "../models/user";

const router = Router();

router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: (req as any).user._id,
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/tasks", auth, async (req, res) => {
  try {
    let user = (req as any).user as UserInstance;
    await user.populate("tasks");
    res.status(200).send(user.tasks);

    // const tasks = await Task.find({ owner: user._id });
    // console.log(tasks);
    // res.status(200).send(tasks);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    let user = (req as any).user as UserInstance;
    const task = await Task.findOne({ _id: req.params.id, owner: user._id });

    if (!task) {
      return res.status(404).send();
    }
    updates.forEach((update) => ((task as any)[update] = req.body[update]));
    await task.save();
    res.send(task);
  } catch (error: any) {
    if (error.name === "CastError") {
      return res.status(400).send("Invalid Id Passed");
    }
    res.status(500).send(error);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    let user = (req as any).user as UserInstance;
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: user._id });

    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error: any) {
    if (error.name === "CastError") {
      return res.status(400).send("Invalid Id Passed");
    }
    res.status(500).send(error);
  }
});

export const TaskRouter = router;
