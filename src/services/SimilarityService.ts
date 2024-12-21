import { Similarity, TranslationPair } from "@/interfaces";
import { cos_sim } from "@huggingface/transformers";
import { EmbeddingsService } from "./EmbeddingsService";
import { getAllPairs } from "@/db/queries/getAll";

export class SimilarityService {
  private cachedPairs: TranslationPair[] | null = null;

  constructor(private embeddingsService: EmbeddingsService) {}

  private async fetchAllPairs(getAllPairs: () => Promise<TranslationPair[]>) {
    return await getAllPairs();
  }

  private sort(similarities: Similarity[]) {
    similarities.sort((a, b) => b.similarityScore - a.similarityScore);
    return similarities.slice(0, 5);
  }

  async search(queryTexts: string[]) {
    if (this.cachedPairs === null) {
      console.log("Caching pairs...");
      this.cachedPairs = await this.fetchAllPairs(getAllPairs);
    }

    const textEmbeddings =
      await this.embeddingsService.createEmbeddings(queryTexts);

    const results = queryTexts.map((queryText, idx) => {
      const textEmbedding = textEmbeddings[idx];

      const similarities = this.cachedPairs!.map((source) => ({
        sourceText: source.sourceText,
        targetText: source.targetText,
        similarityScore: cos_sim(textEmbedding, source.embedding!),
      }));

      return { queryText, matches: this.sort(similarities) };
    });

    return results;
  }
}
