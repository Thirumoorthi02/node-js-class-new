import { Router } from "express";
import { TaskRouter } from "./task-router";
import { UserRouter } from "./user-router";

const router = Router();

router.use(TaskRouter);
router.use(UserRouter);

export { router };
