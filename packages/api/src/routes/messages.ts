import { Router } from "express";
import * as messageService from "../services/messageService";

import type { Router as RouterType } from "express"; export const messageRouter: RouterType = Router();

messageRouter.get("/", async (req, res) => {
  try {
    const { limit, afterId } = req.query;
    const messages = await messageService.getMessages(
      limit ? Number(limit) : 50,
      afterId as string | undefined,
    );
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch messages" });
  }
});

messageRouter.post("/", async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] as string;
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
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to create message" });
  }
});