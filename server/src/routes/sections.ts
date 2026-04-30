// server/src/routes/sections.ts
import { Router } from "express";
import { readdir, readFile } from "fs/promises";
import { join, basename, extname, resolve } from "path";

export const sectionsRouter = Router();

const RESOURCES_DIR = join(process.cwd(), "resources");
const ALLOWED_SECTIONS = ["exam1", "exam2", "new", "visualizations"];

function isValidSection(section: string): boolean {
  return ALLOWED_SECTIONS.includes(section);
}

// Resolve a path safely inside resources/<section>/, returning null if it would escape.
function safeResolve(section: string, filename: string): string | null {
  const sectionDir = resolve(RESOURCES_DIR, section);
  const target = resolve(sectionDir, filename);
  if (!target.startsWith(sectionDir + "/") && target !== sectionDir) {
    return null;
  }
  return target;
}

// GET /api/sections/:section — list .html files in resources/<section>/
sectionsRouter.get("/:section", async (req, res) => {
  const { section } = req.params;
  if (!isValidSection(section)) {
    return res.status(404).json({ error: "Section not found" });
  }
  try {
    const files = await readdir(join(RESOURCES_DIR, section));
    const htmlFiles = files
      .filter((f) => extname(f) === ".html")
      .map((f) => ({ id: basename(f, ".html"), filename: f }));
    res.json({ resources: htmlFiles });
  } catch {
    res.json({ resources: [] });
  }
});

// GET /api/sections/:section/:id/raw — serve the HTML file for iframe rendering
sectionsRouter.get("/:section/:id/raw", async (req, res) => {
  const { section, id } = req.params;
  if (!isValidSection(section)) {
    return res.status(404).send("Section not found");
  }
  const filePath = safeResolve(section, `${id}.html`);
  if (!filePath) {
    return res.status(404).send("Resource not found");
  }
  try {
    const html = await readFile(filePath, "utf-8");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  } catch {
    res.status(404).send("Resource not found");
  }
});
