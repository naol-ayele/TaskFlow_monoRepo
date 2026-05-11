import express from "express";
import cors from "cors";


// custom imports
import { taskRouter } from "./routes/tasks";
import { noteRouter } from "./routes/notes";
import { pomodoroRouter } from "./routes/pomodoro";
import { messageRouter } from "./routes/messages";
import { db, users } from "@taskflow/db";


const app = express();
app.use(cors());
app.use(express.json());

//API routes
app.use("/api/tasks", taskRouter);
app.use("/api/notes", noteRouter);
app.use("/api/pomodoro", pomodoroRouter);
app.use("/api/messages", messageRouter);
app.get("/api/users", async (req, res) => {
  try {
    const allUsers = await db.select().from(users).all();
    res.json({ success: true, data: allUsers });
  } catch (e) {
    res.status(500).json({ success: false, error: "Failed to fetch users" });
  }
});


const PORT = 3005;
app.listen(PORT, () => {
  console.log(`TaskFlow API running on http://localhost:${PORT}/api`);
});
