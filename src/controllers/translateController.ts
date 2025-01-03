import ChatCompletionService, {
  chatCompletionService,
} from "@/services/ChatCompletionService";
import promptService from "@/services/PromptService";
import { NextFunction, Request, Response } from "express";

export default class TranslateController {
  constructor(private chatCompletionService: ChatCompletionService) {}

  // use arrow function to bind this to class instance: it can be safely called as a callback function in the router

  translate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sourceSegment, examples } = req.body;

      const prompt = promptService.createTranslationPrompt(
        sourceSegment,
        examples
      );
      const data = await this.chatCompletionService.getTranslation(prompt);

      res.status(200).json({
        status: "success",
        data,
      });
    } catch (error) {
      console.error(
        "Translation error: ",
        error instanceof Error ? error.message : "Unknown error"
      );

      next(error);
    }
  };
}

export const translateController = new TranslateController(
  chatCompletionService
);
