import {
  FeatureExtractionPipeline,
  pipeline,
  PipelineType,
} from "@huggingface/transformers";

class SimilarityPipeline {
  private static task = "feature-extraction";
  private static model = "mixedbread-ai/mxbai-embed-large-v1";
  private static instance: any | null = null;

  static async getInstance() {
    if (this.instance === null) {
      console.log("Initiating pipeline ...");

      this.instance = await pipeline(
        SimilarityPipeline.task as PipelineType,
        SimilarityPipeline.model,
        {
          progress_callback: undefined,
        }
      );

      console.log("Pipeline successfully initiated");
    }

    return this.instance as FeatureExtractionPipeline;
  }
}

export default SimilarityPipeline;
