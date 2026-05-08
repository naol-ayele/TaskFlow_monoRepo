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
exports.messageRouter = void 0;
const express_1 = require("express");
const messageService = __importStar(require("../services/messageService"));
exports.messageRouter = (0, express_1.Router)();
exports.messageRouter.get("/", async (req, res) => {
    try {
        const { limit, afterId } = req.query;
        const messages = await messageService.getMessages(limit ? Number(limit) : 50, afterId);
        res.json({ success: true, data: messages });
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Failed to fetch messages" });
    }
});
exports.messageRouter.post("/", async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];
        if (!userId) {
            return res
                .status(400)
                .json({ success: false, error: "x-user-id header required" });
        }
        const { body, relatedId, relatedType } = req.body;
        if (!body) {
            return res
                .status(400)
                .json({ success: false, error: "Message body is required" });
        }
        if (body.length > 500) {
            return res
                .status(400)
                .json({
                success: false,
                error: "Message must be 500 characters or less",
            });
        }
        const message = await messageService.createMessage({
            body,
            authorId: userId,
            relatedId,
            relatedType,
        });
        res.status(201).json({ success: true, data: message });
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Failed to create message" });
    }
});
