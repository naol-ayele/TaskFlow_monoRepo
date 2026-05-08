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
exports.noteRouter = void 0;
const express_1 = require("express");
const noteService = __importStar(require("../services/noteService"));
exports.noteRouter = (0, express_1.Router)();
exports.noteRouter.get("/", async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];
        if (!userId) {
            return res
                .status(400)
                .json({ success: false, error: "x-user-id header required" });
        }
        const notes = await noteService.getAllNotes(userId);
        res.json({ success: true, data: notes });
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Failed to fetch notes" });
    }
});
exports.noteRouter.post("/", async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];
        if (!userId) {
            return res
                .status(400)
                .json({ success: false, error: "x-user-id header required" });
        }
        const { title, body, isShared } = req.body;
        if (!title) {
            return res
                .status(400)
                .json({ success: false, error: "Title is required" });
        }
        if (title.length > 100) {
            return res
                .status(400)
                .json({
                success: false,
                error: "Title must be 100 characters or less",
            });
        }
        if (body && body.length > 5000) {
            return res
                .status(400)
                .json({
                success: false,
                error: "Body must be 5000 characters or less",
            });
        }
        const note = await noteService.createNote({
            title,
            body,
            isShared,
            createdBy: userId,
        });
        res.status(201).json({ success: true, data: note });
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Failed to create note" });
    }
});
exports.noteRouter.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.headers["x-user-id"];
        if (!userId) {
            return res
                .status(400)
                .json({ success: false, error: "x-user-id header required" });
        }
        const { title, body, isShared } = req.body;
        const updated = await noteService.updateNote(id, userId, {
            title,
            body,
            isShared,
        });
        if (!updated) {
            return res.status(403).json({ success: false, error: "Not authorized" });
        }
        res.json({ success: true, data: updated });
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Failed to update note" });
    }
});
exports.noteRouter.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.headers["x-user-id"];
        if (!userId) {
            return res
                .status(400)
                .json({ success: false, error: "x-user-id header required" });
        }
        const deleted = await noteService.deleteNote(id, userId);
        if (!deleted) {
            return res.status(403).json({ success: false, error: "Not authorized" });
        }
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Failed to delete note" });
    }
});
