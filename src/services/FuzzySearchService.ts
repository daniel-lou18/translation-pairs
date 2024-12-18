import { FuseRecord } from "@/interfaces";
import Fuse, { FuseResult, IFuseOptions } from "fuse.js";

export interface IFuzzySearchService {
  search(searchTerm: string): FuseResult<FuseRecord>[];
}

class FuzzySearchService implements IFuzzySearchService {
  private fuse: Fuse<FuseRecord>;

  constructor(records: FuseRecord[], options?: IFuseOptions<FuseRecord>) {
    const defaultOptions = {
      keys: ["sourceText"],
      threshold: 0.3, // Moderate fuzzy matching
      distance: 100, // Max distance between match and search term
      includeScore: true,
      tokenize: true, // Break text into tokens
      matchAllTokens: false, // Match if any token matches
      findAllMatches: true,
    };
    this.fuse = new Fuse(records, { ...defaultOptions, ...options });
  }

  public search(searchTerm: string) {
    return this.fuse.search(searchTerm);
  }

  public static async init(
    getAllData: () => Promise<FuseRecord[]>,
    options?: IFuseOptions<FuseRecord>
  ) {
    try {
      const records = await getAllData();
      return new FuzzySearchService(records, options);
    } catch (error) {
      throw new Error(
        `Failed to initialize error: ${error instanceof Error ? error.message : "Unknown initialization error"}`
      );
    }
  }
}

export default FuzzySearchService;
