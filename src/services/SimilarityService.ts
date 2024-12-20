import { Similarity, TranslationPair } from "@/interfaces";
import { cos_sim } from "@huggingface/transformers";
import { EmbeddingsService } from "./EmbeddingsService";
import { getAllPairs } from "@/db/queries/getAll";

// Use OOP for services

export class SimilarityService {
  private cachedPairs: TranslationPair[] | null = null;

  constructor(private embeddingsService: EmbeddingsService) {}

  private async fetchAllPairs(getAllPairs: () => Promise<TranslationPair[]>) {
    return await getAllPairs();
  }

  private sort(similarities: Similarity[]) {
    similarities.sort((a, b) => b.similarityScore - a.similarityScore);
    return similarities.slice(0, 10);
  }

  public async search(searchTerms: string) {
    if (this.cachedPairs === null) {
      this.cachedPairs = await this.fetchAllPairs(getAllPairs);
    }

    const [searchTermsEmbedding] =
      await this.embeddingsService.createEmbeddings([searchTerms]);

    const similarities = this.cachedPairs.map((source) => ({
      sourceText: source.sourceText,
      targetText: source.targetText,
      similarityScore: cos_sim(searchTermsEmbedding, source.embedding!),
    }));

    return this.sort(similarities);
  }
}
