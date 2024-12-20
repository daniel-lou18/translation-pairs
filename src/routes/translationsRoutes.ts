import { NextFunction, Request, Response, Router } from "express";
import TranslationsController from "@/controllers/translationsController";

const router = Router();

function controllerInstanceWrapper(
  handler: (controller: TranslationsController) => any
) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const controllerInstance = await TranslationsController.getInstance();
    return handler(controllerInstance)(req, res, next);
  };
}

router.route("/search").get(
  controllerInstanceWrapper(
    (TranslationsController) =>
      async (req: Request, res: Response, next: NextFunction) => {
        await TranslationsController.search(req, res, next);
      }
  )
);

router
  .route("/embeddings")
  .get(
    controllerInstanceWrapper(
      (TranslationsController) =>
        async (req: Request, res: Response, next: NextFunction) => {
          await TranslationsController.loadSourceEmbeddings(req, res, next);
        }
    )
  )
  .post(
    controllerInstanceWrapper(
      (TranslationsController) =>
        async (req: Request, res: Response, next: NextFunction) => {
          await TranslationsController.storeSourceEmbeddings(req, res, next);
        }
    )
  );

export default router;
