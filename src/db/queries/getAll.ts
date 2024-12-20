import db from "@/db";
import { translationPairs } from "@/db/schema";
import { FuseRecord, SourceText, TranslationPair } from "@/interfaces";

export async function getAllPairs(): Promise<TranslationPair[]> {
  return await db.select().from(translationPairs);
}

export async function getAllText(): Promise<FuseRecord[]> {
  return await db
    .select({
      sourceText: translationPairs.sourceText,
      targetText: translationPairs.targetText,
    })
    .from(translationPairs);
}

export async function getAllSourceText(): Promise<SourceText[]> {
  return await db
    .select({
      id: translationPairs.id,
      sourceText: translationPairs.sourceText,
    })
    .from(translationPairs);
}
