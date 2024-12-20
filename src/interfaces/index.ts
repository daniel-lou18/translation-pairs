export type TranslationPair = {
  sourceText: string;
  targetText: string;
  sourceLang: string;
  targetLang: string;
  domain?: string;
  subdomain?: string;
  docType?: string;
};

export type FuseRecord = Pick<TranslationPair, "sourceText" | "targetText">;

export type SourceText = { id: number; sourceText: string };

export type Similarity = {
  similarityScore: number;
  sourceText: string;
};

export type EmbeddingsMap = Map<string, number[]>;
