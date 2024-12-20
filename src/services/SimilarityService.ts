import { EmbeddingsMap, Similarity, SourceText } from "@/interfaces";
import { cos_sim } from "@huggingface/transformers";
import { EmbeddingsService } from "./EmbeddingsService";

// Use OOP for services

export class SimilarityService {
  private cachedSourceArray: SourceText[] = [];
  private embeddings: EmbeddingsMap = new Map();

  constructor(private embeddingsService: EmbeddingsService) {}

  public async loadSourceEmbeddings(
    docs: SourceText[]
  ): Promise<Map<string, number[]>> {
    this.cachedSourceArray = docs;

    for (const doc of this.cachedSourceArray) {
      const [embedding] = await this.embeddingsService.createEmbeddings([
        doc.sourceText,
      ]);
      this.embeddings.set(doc.sourceText, embedding);
    }

    return this.embeddings;
  }

  public async storeSourceEmbeddings(
    updateEmbeddings: (embeddings: EmbeddingsMap) => Promise<any>
  ) {
    await updateEmbeddings(this.embeddings);
  }

  private sort(similarities: Similarity[]) {
    similarities.sort((a, b) => b.similarityScore - a.similarityScore);
    return similarities.slice(0, 10);
  }

  public async search(searchTerms: string) {
    const [searchTermsEmbedding] =
      await this.embeddingsService.createEmbeddings([searchTerms]);

    const similarities = this.cachedSourceArray.map((source) => ({
      ...source,
      similarityScore: cos_sim(
        searchTermsEmbedding,
        this.embeddings.get(source.sourceText)!
      ),
    }));

    const sortedResults = this.sort(similarities);

    return sortedResults;
  }
}
