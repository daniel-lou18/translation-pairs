import FuzzySearchService from "@/services/FuzzySearchService";
import { getAllText } from "@/db/queries/getAll";
import { EmbeddingsService } from "@/services/EmbeddingsService";
import SimilarityPipeline from "@/services/SimilarityPipeline";
import { SimilarityService } from "@/services/SimilarityService";
import { NextFunction, Request, Response } from "express";

export async function fuzzySearch(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { searchTerms } = req.body;
    console.log(searchTerms);

    if (!searchTerms || searchTerms?.length === 0) {
      throw new Error("Did not receive any searchterms");
    }

    const fuzzySearchService = await FuzzySearchService.init(getAllText);
    const data = fuzzySearchService.search(searchTerms);

    res.status(200).json({ status: "success", data });
  } catch (error: unknown) {
    console.error(
      "Search controller error: ",
      error instanceof Error ? error.message : "Unknown error"
    );

    next(error);
  }
}

export default class SearchController {
  private static instance: SearchController | null = null;
  private similarityService: SimilarityService | null = null;

  static async getInstance() {
    if (this.instance === null) {
      this.instance = new SearchController();
      await this.instance.init();
    }

    return this.instance;
  }

  private async init() {
    const similarityPipeline = await SimilarityPipeline.getInstance();
    const embeddingsService = new EmbeddingsService(similarityPipeline);
    this.similarityService = new SimilarityService(embeddingsService);
  }

  async search(req: Request, res: Response, next: NextFunction) {
    try {
      const { searchTerms }: { searchTerms: string[] } = req.body;
      console.log(searchTerms);

      if (!searchTerms || searchTerms?.length === 0) {
        throw new Error("Did not receive any searchterms");
      }

      if (!this.similarityService) {
        throw new Error("Similarity service is not initialized");
      }

      const data = await this.similarityService.search(searchTerms);

      res.status(200).json({ status: "success", data });
    } catch (error) {
      console.error(
        "Search error: ",
        error instanceof Error ? error.message : "Unknown error"
      );

      next(error);
    }
  }
}
