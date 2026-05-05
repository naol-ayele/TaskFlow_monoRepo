import express from "express";
import cors from "cors";
import { taskRouter } from "./routes/tasks";
const app = express();
app.use(cors());
app.use(express.json());

//API routes
app.use("/api/tasks", taskRouter);

const PORT = 3005;
app.listen(PORT, () => {
  console.log(`TaskFlow API running on http://localhost:${PORT}/api`);
});
