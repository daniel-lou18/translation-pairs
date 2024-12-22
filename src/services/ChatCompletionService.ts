import OpenAI from "openai";
import { ChatCompletionSystemMessageParam } from "openai/resources";

type ChatCompletionConfig = {
  model: string;
  temperature: number;
  messages: ChatCompletionSystemMessageParam[];
};

export default class ChatCompletionService {
  private config: ChatCompletionConfig = {
    model: "gpt-4o-mini",
    temperature: 0.7,
    messages: [
      {
        role: "system",
        content:
          "You are a legal translator translating legal documents from Dutch to French.",
      },
    ],
  };

  constructor(
    private openAiClient: OpenAI,
    config: Partial<ChatCompletionConfig> = {}
  ) {
    this.config = { ...this.config, ...config };
  }

  async getTranslation(prompt: string) {
    const result = await this.openAiClient.chat.completions.create({
      model: this.config.model,
      messages: [
        ...this.config.messages,
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: this.config.temperature,
    });

    return result.choices[0].message.content;
  }
}

export const chatCompletionService = new ChatCompletionService(new OpenAI());
