import { Router } from "express";
import { readdir, readFile } from "fs/promises";
import { join, basename, extname } from "path";
import { fileURLToPath } from "url";

export const resourcesRouter = Router();

const RESOURCES_DIR = join(fileURLToPath(import.meta.url), "../../../../resources");

// GET /api/resources — list all available .html resource files
resourcesRouter.get("/", async (_req, res) => {
  try {
    const files = await readdir(RESOURCES_DIR);
    const htmlFiles = files
      .filter((f) => extname(f) === ".html")
      .map((f) => ({ id: basename(f, ".html"), filename: f }));
    res.json({ resources: htmlFiles });
  } catch {
    res.json({ resources: [] });
  }
});

// GET /api/resources/:id — serve a single resource's HTML content
resourcesRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const filePath = join(RESOURCES_DIR, `${id}.html`);
  try {
    const html = await readFile(filePath, "utf-8");
    res.json({ id, html });
  } catch {
    res.status(404).json({ error: "Resource not found" });
  }
});
