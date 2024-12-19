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

export type SourceText = Pick<TranslationPair, "sourceText">;

export type Similarity = {
  similarityScore: number;
  sourceText: string;
};
