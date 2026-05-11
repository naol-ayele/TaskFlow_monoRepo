"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskRouter = void 0;
const express_1 = require("express");
const taskService = __importStar(require("../services/taskService"));
exports.taskRouter = (0, express_1.Router)();
exports.taskRouter.get("/", async (req, res) => {
    try {
        const { status, priority, assignedTo, sortBy } = req.query;
        const filters = {
            status: status,
            priority: priority,
            assignedTo: assignedTo,
            sortBy: sortBy,
        };
        const tasks = await taskService.getAllTasks(filters);
        res.json({ success: true, data: tasks });
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Failed to fetch tasks" });
    }
});
exports.taskRouter.post("/", async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];
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
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Failed to create task" });
    }
});
exports.taskRouter.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status, priority, assignedTo, dueDate } = req.body;
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
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Failed to update task" });
    }
});
exports.taskRouter.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.headers["x-user-id"];
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
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Failed to delete task" });
    }
});
exports.taskRouter.get("/:id/comments", async (req, res) => {
    try {
        const { id } = req.params;
        const comments = await taskService.getTaskComments(id);
        res.json({ success: true, data: comments });
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Failed to fetch comments" });
    }
});
exports.taskRouter.post("/:id/comments", async (req, res) => {
    try {
        const { id: taskId } = req.params;
        const userId = req.headers["x-user-id"];
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
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Failed to add comment" });
    }
});
