import db from "@/db";
import { translationPairs } from "@/db/schema";
import { FuseRecord, SourceText } from "@/interfaces";

export async function getAllPairs(): Promise<FuseRecord[]> {
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
      sourceText: translationPairs.sourceText,
    })
    .from(translationPairs);
}
