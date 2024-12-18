import database from "@/db";
import { translationPairs } from "./schema";
import XLSX from "xlsx";
import path from "path";

type TranslationPair = {
  sourceText: string;
  targetText: string;
  sourceLang: string;
  targetLang: string;
  domain?: string;
  subdomain?: string;
  docType?: string;
};

function readFile() {
  const filePath = path.resolve(__dirname, "data", "translation_pairs.xlsx");
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[1]];

  if (!sheet) {
    throw new Error("Sheet not found!");
  }

  const jsonData = XLSX.utils.sheet_to_json(sheet);
  const transformedData = jsonData.map((row: any) => ({
    sourceText: row.source_text,
    targetText: row.target_text,
    sourceLang: row.source_lang,
    targetLang: row.target_lang,
    domain: row.domain,
    subdomain: row.subdomain,
    docType: row.doc_type,
  }));

  return transformedData as TranslationPair[];
}

async function insertData(db: typeof database, data: TranslationPair[]) {
  await db.insert(translationPairs).values(data);
}

async function seed() {
  try {
    const data = readFile();
    await insertData(database, data);
    console.log("Data inserted successfully");
  } catch (error) {
    console.error("Error during seeding", error);
  }
}

seed();
