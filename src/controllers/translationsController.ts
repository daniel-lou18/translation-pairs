import { getAllPairs, getAllSourceText } from "@/db/queries/getAll";
import { updateSourceEmbeddings } from "@/db/queries/update";
import { EmbeddingsService } from "@/services/EmbeddingsService";
import FuzzySearchService from "@/services/FuzzySearchService";
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

    const fuzzySearchService = await FuzzySearchService.init(getAllPairs);
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

export default class TranslationsController {
  private static instance: TranslationsController | null = null;
  private similarityService: SimilarityService | null = null;

  public static async getInstance() {
    if (this.instance === null) {
      this.instance = new TranslationsController();
      await this.instance.init();
    }

    return this.instance;
  }

  private async init() {
    const similarityPipeline = await SimilarityPipeline.getInstance();
    const embeddingsService = new EmbeddingsService(similarityPipeline);
    this.similarityService = new SimilarityService(embeddingsService);
  }

  async loadSourceEmbeddings(req: Request, res: Response, next: NextFunction) {
    try {
      if (!this.similarityService) {
        throw new Error("Similarity service is not initialized");
      }

      const textArray = await getAllSourceText();
      const output =
        await this.similarityService.loadSourceEmbeddings(textArray);
      const embeddingsCount = output.size;

      res.status(201).json({
        status: "success",
        message: `${embeddingsCount} embeddings have been successfully created`,
      });
    } catch (error: unknown) {
      console.error(
        "Error while loading embeddings: ",
        error instanceof Error ? error.message : "Unknown error"
      );

      next(error);
    }
  }

  async storeSourceEmbeddings(req: Request, res: Response, next: NextFunction) {
    try {
      if (!this.similarityService) {
        throw new Error("Similarity service is not initialized");
      }

      await this.similarityService.storeSourceEmbeddings(
        updateSourceEmbeddings
      );

      res.status(200).json({
        status: "success",
        message: "Embeddings have been stored successfully",
      });
    } catch (error) {
      console.error(
        "Error while storing embeddings: ",
        error instanceof Error ? error.message : "Unknown error"
      );

      next(error);
    }
  }

  async search(req: Request, res: Response, next: NextFunction) {
    try {
      const { searchTerms } = req.body;
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
