import OpenAI from "openai";
import {
  ChatCompletionMessageParam,
  ChatCompletionSystemMessageParam,
} from "openai/resources";

type ChatCompletionConfig = {
  model: string;
  temperature: number;
};

export default class ChatCompletionService {
  private config: ChatCompletionConfig = {
    model: "gpt-4o-mini",
    temperature: 0.7,
  };

  constructor(
    private openAiClient: OpenAI,
    config: Partial<ChatCompletionConfig> = {}
  ) {
    this.config = { ...this.config, ...config };
  }

  async getTranslation(prompt: ChatCompletionMessageParam[]) {
    console.log(prompt);
    const result = await this.openAiClient.chat.completions.create({
      model: this.config.model,
      temperature: this.config.temperature,
      messages: prompt,
    });

    return result.choices[0].message.content;
  }
}

export const chatCompletionService = new ChatCompletionService(new OpenAI());
