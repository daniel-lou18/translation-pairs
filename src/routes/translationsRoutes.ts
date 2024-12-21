import { NextFunction, Request, Response, Router } from "express";
import TranslationsController from "@/controllers/translationsController";
import SearchController from "@/controllers/searchController";

const router = Router();

function TranslationsControllerWrapper(
  handler: (controller: TranslationsController) => any
) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const controllerInstance = await TranslationsController.getInstance();
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
    TranslationsControllerWrapper(
      (TranslationsController) =>
        async (req: Request, res: Response, next: NextFunction) => {
          await TranslationsController.loadSourceEmbeddings(req, res, next);
        }
    )
  )
  .post(
    TranslationsControllerWrapper(
      (TranslationsController) =>
        async (req: Request, res: Response, next: NextFunction) => {
          await TranslationsController.storeSourceEmbeddings(req, res, next);
        }
    )
  );

export default router;
