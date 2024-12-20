import {
  FeatureExtractionPipeline,
  pipeline,
  PipelineType,
} from "@huggingface/transformers";

// Use OOP for services

class SimilarityPipeline {
  private static task = "feature-extraction";
  private static model = "mixedbread-ai/mxbai-embed-large-v1";
  private static instance: any | null = null;

  public static async getInstance() {
    if (this.instance === null) {
      this.instance = await pipeline(
        SimilarityPipeline.task as PipelineType,
        SimilarityPipeline.model,
        {
          progress_callback: undefined,
        }
      );
    }

    return this.instance as FeatureExtractionPipeline;
  }
}

export default SimilarityPipeline;
