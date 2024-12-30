import ChatCompletionService, {
  chatCompletionService,
} from "@/services/ChatCompletionService";
import promptService from "@/services/PromptService";
import { NextFunction, Request, Response } from "express";

export default class ReformulateController {
  constructor(private chatCompletionService: ChatCompletionService) {}

  // use arrow function to bind this to class instance: it can be safely called as a callback function in the router

  reformulate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { translatedText, examples } = req.body;

      const prompt = promptService.createReformulationPrompt(
        translatedText,
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

export const reformulateController = new ReformulateController(
  chatCompletionService
);
