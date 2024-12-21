import { FeatureExtractionPipeline } from "@huggingface/transformers";

export class EmbeddingsService {
  constructor(private extractor: FeatureExtractionPipeline) {}

  async createEmbeddings(docs: string[]): Promise<number[][]> {
    const output = await this.extractor(docs, { pooling: "cls" });
    return output.tolist();
  }
}
