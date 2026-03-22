import "dotenv/config";
import express from "express";
import cors from "cors";
import { healthRouter } from "./routes/health.js";
import { resourcesRouter } from "./routes/resources.js";
import { slidesRouter } from "./routes/slides.js";

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/resources", resourcesRouter);
app.use("/api/slides", slidesRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
