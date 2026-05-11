import { Router } from "express";
import * as taskService from "../services/taskService";

import type { Router as RouterType } from "express"; export const taskRouter: RouterType = Router();

taskRouter.get("/", async (req, res) => {
  try {
    const { status, priority, assignedTo, sortBy } = req.query;
    const filters = {
      status: status as taskService.TaskFilters["status"],
      priority: priority as taskService.TaskFilters["priority"],
      assignedTo: assignedTo as string | undefined,
      sortBy: sortBy as taskService.TaskFilters["sortBy"],
    };
    const tasks = await taskService.getAllTasks(filters);
    res.json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch tasks" });
  }
});

taskRouter.post("/", async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, error: "x-user-id header required" });
    }

    const { title, description, priority, assignedTo, dueDate } = req.body;
    if (!title) {
      return res
        .status(400)
        .json({ success: false, error: "Title is required" });
    }
    if (title.length > 120) {
      return res
        .status(400)
        .json({
          success: false,
          error: "Title must be 120 characters or less",
        });
    }
    if (description && description.length > 500) {
      return res
        .status(400)
        .json({
          success: false,
          error: "Description must be 500 characters or less",
        });
    }

    const task = await taskService.createTask({
      title,
      description,
      priority,
      assignedTo,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      createdBy: userId,
    });
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ success: false, error: "Failed to create task" });
  }
});

taskRouter.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, assignedTo, dueDate } =
      req.body;

    const updated = await taskService.updateTask(id, {
      title,
      description,
      status,
      priority,
      assignedTo,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });

    if (!updated) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to update task" });
  }
});

taskRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers["x-user-id"] as string;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, error: "x-user-id header required" });
    }

    const deleted = await taskService.deleteTask(id, userId);
    if (!deleted) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to delete task" });
  }
});

taskRouter.get("/:id/comments", async (req, res) => {
  try {
    const { id } = req.params;
    const comments = await taskService.getTaskComments(id);
    res.json({ success: true, data: comments });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch comments" });
  }
});

taskRouter.post("/:id/comments", async (req, res) => {
  try {
    const { id: taskId } = req.params;
    const userId = req.headers["x-user-id"] as string;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, error: "x-user-id header required" });
    }

    const { body } = req.body;
    if (!body) {
      return res
        .status(400)
        .json({ success: false, error: "Comment body is required" });
    }
    if (body.length > 300) {
      return res
        .status(400)
        .json({
          success: false,
          error: "Comment must be 300 characters or less",
        });
    }

    const comment = await taskService.addTaskComment(taskId, {
      authorId: userId,
      body,
    });
    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to add comment" });
  }
});

taskRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const task = await taskService.getTaskById(id);
    if (!task) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }
    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch task" });
  }
});