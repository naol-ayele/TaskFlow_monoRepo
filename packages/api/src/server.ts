import express from "express";
import cors from "cors";


// custom imports
import { taskRouter } from "./routes/tasks";
import { noteRouter } from "./routes/notes";
import { pomodoroRouter } from "./routes/pomodoro";
import { messageRouter } from "./routes/messages";



const app = express();
app.use(cors());
app.use(express.json());

//API routes
app.use("/api/tasks", taskRouter);
app.use("/api/notes", noteRouter);
app.use("/api/pomodoro", pomodoroRouter);
app.use("/api/messages", messageRouter);


const PORT = 3005;
app.listen(PORT, () => {
  console.log(`TaskFlow API running on http://localhost:${PORT}/api`);
});
