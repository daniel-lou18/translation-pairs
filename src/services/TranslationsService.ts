import { EmbeddingsMap, SourceText } from "@/interfaces";
import { EmbeddingsService } from "./EmbeddingsService";

export class TranslationsService {
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
}
