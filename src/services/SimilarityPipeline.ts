import { Similarity, SourceText } from "@/interfaces";
import { cos_sim, pipeline, PipelineType } from "@huggingface/transformers";

class SimilarityPipeline {
  private static task = "feature-extraction";
  private static model = "mixedbread-ai/mxbai-embed-large-v1";
  private static instance: SimilarityPipeline | null = null;

  private extractor: any = null;
  private cachedSourceArray: SourceText[] = [];
  private embeddings: Map<string, number[]> = new Map();

  public static async getInstance() {
    if (this.instance === null) {
      const instance = new SimilarityPipeline();
      await instance.init();
      this.instance = instance;
    }

    return this.instance;
  }

  private async init(progress_callback = undefined) {
    this.extractor = await pipeline(
      SimilarityPipeline.task as PipelineType,
      SimilarityPipeline.model,
      {
        progress_callback,
      }
    );
  }

  private async createEmbeddings(docs: string[]): Promise<number[][]> {
    const output = await this.extractor(docs, { pooling: "cls" });
    return output.tolist();
  }

  public async loadSourceEmbeddings(
    docs: SourceText[]
  ): Promise<Map<string, number[]>> {
    this.cachedSourceArray = docs;

    for (const doc of this.cachedSourceArray) {
      const [embedding] = await this.createEmbeddings([doc.sourceText]);
      this.embeddings.set(doc.sourceText, embedding);
    }

    return this.embeddings;
  }

  private sort(similarities: Similarity[]) {}

  public async search(searchTerms: string) {
    console.log(this.embeddings.size);
    const [searchTermsEmbedding] = await this.createEmbeddings([searchTerms]);
    console.log(searchTermsEmbedding);

    const similarities = this.cachedSourceArray.map((source) => ({
      ...source,
      similarityScore: cos_sim(
        searchTermsEmbedding,
        this.embeddings.get(source.sourceText)!
      ),
    }));

    return similarities;
  }
}

export default SimilarityPipeline;
