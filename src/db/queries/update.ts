import db from "@/db";
import { translationPairs } from "@/db/schema";
import { EmbeddingsMap } from "@/interfaces";
import { eq } from "drizzle-orm";

export async function updateSourceEmbeddings(embeddings: EmbeddingsMap) {
  await db.transaction(async (tx) => {
    for (const [sourceText, embedding] of embeddings.entries()) {
      await tx
        .update(translationPairs)
        .set({ embedding })
        .where(eq(translationPairs.sourceText, sourceText));
    }
  });
}
