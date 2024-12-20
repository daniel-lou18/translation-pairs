import { integer, sqliteTable, text, index } from "drizzle-orm/sqlite-core";

export const translationPairs = sqliteTable(
  "translation_pairs",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    sourceText: text("source_text").notNull(),
    targetText: text("target_text").notNull(),
    sourceLang: text("source_lang").notNull(),
    targetLang: text("target_lang").notNull(),
    domain: text("domain"),
    subdomain: text("subdomain"),
    docType: text("doc_type"),
    embedding: text("embedding", { mode: "json" }).$type<number[]>(),
  },
  (table) => ({
    sourceTextIdx: index("source_text_idx").on(table.sourceText),
  })
);
