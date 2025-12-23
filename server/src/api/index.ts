import { Request, Response, Router } from "express";
import * as fs from "fs";
import * as path from "path";
import { fetchNews } from "../services/newsapi.service";
import { summarizeArticle } from "../services/openai.service";

const categoriesPath = path.join(__dirname, "../db/categories.json");
const categories: string[] = JSON.parse(
  fs.readFileSync(categoriesPath, "utf-8")
);

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Darrow's News Scanner API");
});

router.get("/categories", async (req: Request, res: Response) => {
  try {
    const formattedCategories = categories.map((cat) => ({
      value: cat.toLowerCase(),
      displayName: cat,
    }));
    res.json({ categories: formattedCategories });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

router.get("/news", async (req: Request, res: Response) => {
  try {
    const { category, query, page = "1", pageSize = "6" } = req.query;

    if (!category || typeof category !== "string") {
      res.status(400).json({ error: "Category is required" });
      return;
    }

    if (!query || typeof query !== "string") {
      res.status(400).json({ error: "Query is required" });
      return;
    }

    const result = await fetchNews({
      category,
      query,
      page: parseInt(page as string, 10),
      pageSize: parseInt(pageSize as string, 10),
    });

    res.json(result);
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to fetch news",
    });
  }
});

router.post("/summary", async (req: Request, res: Response) => {
  try {
    const { title, description, content, source, url } = req.body;

    if (!title || !url) {
      res.status(400).json({ error: "Title and URL are required" });
      return;
    }

    const result = await summarizeArticle({
      title,
      description,
      content,
      source,
      url,
    });

    res.json(result);
  } catch (error) {
    console.error("Error generating summary:", error);
    res.status(500).json({
      error:
        error instanceof Error ? error.message : "Failed to generate summary",
    });
  }
});

export default router;
