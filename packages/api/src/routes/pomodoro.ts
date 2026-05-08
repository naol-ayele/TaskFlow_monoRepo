import { Router } from "express";
import * as pomodoroService from "../services/pomodoroService";

import type { Router as RouterType } from "express"; export const pomodoroRouter: RouterType = Router();

pomodoroRouter.get("/", async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    const { date, team } = req.query;

    if (team === "true") {
      const sessions = await pomodoroService.getTeamSessions(
        date as string | undefined,
      );
      return res.json({ success: true, data: sessions });
    }

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, error: "x-user-id header required" });
    }

    const sessions = await pomodoroService.getSessions(
      userId,
      date as string | undefined,
    );
    res.json({ success: true, data: sessions });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch sessions" });
  }
});

pomodoroRouter.post("/", async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, error: "x-user-id header required" });
    }

    const { taskId, durationMinutes, type } = req.body;

    const session = await pomodoroService.createSession({
      userId,
      taskId,
      durationMinutes: durationMinutes ?? 25,
      type: type ?? "focus",
    });
    res.status(201).json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to create session" });
  }
});