import { Router } from "express";
import Task from "../models/task";
import { auth } from "../middleware/auth";
import { UserInstance } from "../models/user";

const router = Router();

router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: (req.user as UserInstance)._id,
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt:desc
router.get("/tasks", auth, async (req, res) => {
  const match: { completed?: boolean } = {};
  const sort: { [key: string]: any } = {};

  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }

  if (req.query.sortBy) {
    const parts = (req.query.sortBy as string).split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  try {
    await (req.user as UserInstance)
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit as string),
          skip: parseInt(req.query.skip as string),
          sort,
        },
      })
    res.send(req.user.tasks);
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/allTasks", auth, async (req, res) => {
  try {
    let user = req.user as UserInstance;
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

router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id

  try {
      const task = await Task.findOne({ _id, owner: (req.user as UserInstance)._id })

      if (!task) {
          return res.status(404).send()
      }

      res.send(task)
  } catch (e) {
      res.status(500).send()
  }
})

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
    let user = req.user as UserInstance;
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
    let user = req.user as UserInstance;
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: user._id,
    });

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
