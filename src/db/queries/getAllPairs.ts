import db from "@/db";
import { translationPairs } from "@/db/schema";
import { FuseRecord } from "@/interfaces";

export async function getAllPairs(): Promise<FuseRecord[]> {
  const pairs = await db
    .select({
      sourceText: translationPairs.sourceText,
      targetText: translationPairs.targetText,
    })
    .from(translationPairs);

  return pairs;
}
