import { Router } from "express";
import { readdir, readFile } from "fs/promises";
import { join, extname } from "path";

export const slidesRouter = Router();

const SLIDES_DIR = join(process.cwd(), "slides");

// GET /api/slides — list all available PDF slide decks
slidesRouter.get("/", async (_req, res) => {
  try {
    const files = await readdir(SLIDES_DIR);
    const pdfs = files
      .filter((f) => extname(f).toLowerCase() === ".pdf")
      .map((f) => ({ filename: f }));
    res.json({ slides: pdfs });
  } catch {
    res.json({ slides: [] });
  }
});

// GET /api/slides/:filename — serve a PDF file
slidesRouter.get("/:filename", async (req, res) => {
  const { filename } = req.params;
  if (!filename.endsWith(".pdf")) {
    res.status(400).json({ error: "Only PDF files are supported" });
    return;
  }
  const filePath = join(SLIDES_DIR, filename);
  try {
    const data = await readFile(filePath);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
    res.send(data);
  } catch {
    res.status(404).json({ error: "Slide deck not found" });
  }
});
