import { getAllSourceText } from "@/db/queries/getAll";
import { updateSourceEmbeddings } from "@/db/queries/update";
import { EmbeddingsService } from "@/services/EmbeddingsService";
import SimilarityPipeline from "@/services/SimilarityPipeline";
import { TranslationsService } from "@/services/TranslationsService";
import { NextFunction, Request, Response } from "express";

export default class TranslationsController {
  private static instance: TranslationsController | null = null;
  private translationsService: TranslationsService | null = null;

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
    this.translationsService = new TranslationsService(embeddingsService);
  }

  async loadSourceEmbeddings(req: Request, res: Response, next: NextFunction) {
    try {
      if (!this.translationsService) {
        throw new Error("Similarity service is not initialized");
      }

      const textArray = await getAllSourceText();
      const output =
        await this.translationsService.loadSourceEmbeddings(textArray);
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
      if (!this.translationsService) {
        throw new Error("Similarity service is not initialized");
      }

      await this.translationsService.storeSourceEmbeddings(
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
}
