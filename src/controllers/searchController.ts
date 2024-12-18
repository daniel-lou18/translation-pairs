import { getAllPairs } from "@/db/queries/getAllPairs";
import FuzzySearchService from "@/services/FuzzySearchService";
import e, { NextFunction, Request, Response } from "express";

export async function getMatches(
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
