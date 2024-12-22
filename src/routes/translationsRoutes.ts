import { NextFunction, Request, Response, Router } from "express";
import TranslationMemoryController from "@/controllers/translationMemoryController";
import SearchController from "@/controllers/searchController";
import { translateController } from "@/controllers/translateController";

const router = Router();

function TranslationMemoryControllerWrapper(
  handler: (controller: TranslationMemoryController) => any
) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const controllerInstance = await TranslationMemoryController.getInstance();
    return handler(controllerInstance)(req, res, next);
  };
}

function SearchControllerWrapper(
  handler: (controller: SearchController) => any
) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const controllerInstance = await SearchController.getInstance();
    return handler(controllerInstance)(req, res, next);
  };
}

router.route("/translate").post(translateController.translate);

router.route("/search").post(
  SearchControllerWrapper(
    (SearchController) =>
      async (req: Request, res: Response, next: NextFunction) => {
        await SearchController.search(req, res, next);
      }
  )
);

router
  .route("/embeddings")
  .get(
    TranslationMemoryControllerWrapper(
      (TranslationMemoryController) =>
        async (req: Request, res: Response, next: NextFunction) => {
          await TranslationMemoryController.loadSourceEmbeddings(
            req,
            res,
            next
          );
        }
    )
  )
  .post(
    TranslationMemoryControllerWrapper(
      (TranslationMemoryController) =>
        async (req: Request, res: Response, next: NextFunction) => {
          await TranslationMemoryController.storeSourceEmbeddings(
            req,
            res,
            next
          );
        }
    )
  );

export default router;
