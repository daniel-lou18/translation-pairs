export type TranslationPair = {
  id: number;
  sourceText: string;
  targetText: string;
  sourceLang: string;
  targetLang: string;
  domain: string | null;
  subdomain: string | null;
  docType: string | null;
  embedding: number[] | null;
};

export type FuseRecord = Pick<TranslationPair, "sourceText" | "targetText">;

export type SourceText = { id: number; sourceText: string };

export type Similarity = {
  similarityScore: number;
  sourceText: string;
};

export type EmbeddingsMap = Map<string, number[]>;
