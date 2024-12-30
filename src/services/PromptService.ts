import { TranslationMatch } from "@/interfaces";
import { ChatCompletionMessageParam } from "openai/resources";

class PromptService {
  private promptTemplate = {
    system: { role: "system", content: "" },
    user: { role: "user", content: "" },
  };

  private constructPrompt(systemContent: string, userContent: string) {
    return [
      { ...this.promptTemplate.system, content: systemContent },
      { ...this.promptTemplate.user, content: userContent },
    ] as ChatCompletionMessageParam[];
  }

  createTranslationPrompt(sourceSegment: string, examples: TranslationMatch) {
    const systemContent = `
    You are a professional legal translator. Your task is to translate legal texts from Dutch to French, using the exact legal terminology and formal tone required for legal documents.
    `;

    let examplesString = "";
    examples.matches.forEach((match) => {
      examplesString += `
      Dutch (Source):
      ${match.sourceText}

      French (Target):
      ${match.targetText}
      `;
    });

    const userContent = `
    Below are some key instructions for translating legal texts:
    - Use the exact legal terminology from the examples provided.
    - For fixed expressions and terms that have legal equivalents in the target language (French in this case), use the same translations provided in the examples.
    - If a term in the new sentence corresponds to one in the examples, use the same term from the example translation, even if a more general translation exists.
    - Ensure that the translation follows the same formal, legal tone and structure as the examples.

    Examples:
    ${examplesString}

    Now, translate this new sentence, using the same legal terms where applicable:

    Dutch (Source):
    ${sourceSegment}


    French (Target):
    `;

    return this.constructPrompt(systemContent, userContent);
  }

  createReformulationPrompt(translatedText: string, examples: string[]) {
    const systemContent = `
    You are a professional legal editor. Your task is to reformulate the following French legal text to ensure it is stylistically appropriate, formal, and adheres to legal writing standards.
    `;

    const userContent = `
    Instructions:
    1. **Use Legal Terminology**:
       - For terms that have the same meaning as in the examples, use the exact equivalent legal terms from the examples.
       - If a term does not exist in French, replace it with the closest appropriate legal term based on the context.

    2. **Ensure Clarity and Precision**:
       - The sentence must be clear, concise, and legally precise.
       - Use formal legal terminology and structure.

    3. **Maintain Original Meaning**:
       - Preserve the original meaning while improving the flow and readability.

    4. **Follow French Legal Conventions**:
       - Use passive voice where appropriate.
       - Avoid colloquialisms or informal language.

    Examples:
    ${examples.map(
      (example) => `
      - ${example}
      `
    )}

    Text to reformulate:
    ${translatedText}

    Reformulated French (Target):
    `;

    return this.constructPrompt(systemContent, userContent);
  }
}

export default new PromptService();
