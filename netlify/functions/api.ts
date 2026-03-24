import serverless from "serverless-http";
import "dotenv/config";
import express from "express";
import cors from "cors";
import { healthRouter } from "../../server/src/routes/health.js";
import { resourcesRouter } from "../../server/src/routes/resources.js";
import { slidesRouter } from "../../server/src/routes/slides.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL ?? "http://localhost:5173",
  })
);
app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/resources", resourcesRouter);
app.use("/api/slides", slidesRouter);

export const handler = serverless(app, {
  binary: ["application/pdf"],
});
