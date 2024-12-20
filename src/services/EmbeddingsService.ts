import { FeatureExtractionPipeline } from "@huggingface/transformers";

// Use OOP for services

export class EmbeddingsService {
  constructor(private extractor: FeatureExtractionPipeline) {}

  public async createEmbeddings(docs: string[]): Promise<number[][]> {
    const output = await this.extractor(docs, { pooling: "cls" });
    return output.tolist();
  }
}
