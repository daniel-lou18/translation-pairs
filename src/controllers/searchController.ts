import { getAllPairs, getAllSourceText } from "@/db/queries/getAll";
import FuzzySearchService from "@/services/FuzzySearchService";
import SimilarityPipeline from "@/services/SimilarityPipeline";
import { cos_sim } from "@huggingface/transformers";
import { NextFunction, Request, Response } from "express";

export async function _getMatches(
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

export async function loadSourceEmbeddings(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const textArray = await getAllSourceText();

    const extractor = await SimilarityPipeline.getInstance();
    const output = await extractor.loadSourceEmbeddings(textArray);
    const embeddingsCount = output.size;

    res.status(201).json({
      status: "success",
      message: `${embeddingsCount} embeddings have been successfully created`,
    });
  } catch (error: unknown) {
    console.error(
      "Search controller error: ",
      error instanceof Error ? error.message : "Unknown error"
    );

    next(error);
  }
}

export async function search(req: Request, res: Response, next: NextFunction) {
  try {
    const { searchTerms } = req.body;
    console.log(searchTerms);

    if (!searchTerms || searchTerms?.length === 0) {
      throw new Error("Did not receive any searchterms");
    }

    const extractor = await SimilarityPipeline.getInstance();
    const data = await extractor.search(searchTerms);

    res.status(200).json({ status: "success", data });
  } catch (error) {
    console.error(
      "Search controller error: ",
      error instanceof Error ? error.message : "Unknown error"
    );

    next(error);
  }
}
