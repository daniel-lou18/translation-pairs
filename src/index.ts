import dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import translationsRouter from "./routes/translationsRoutes";
import cors from "cors";

const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/translations", translationsRouter);

app.all("*", (req: Request, res: Response) => {
  res
    .status(404)
    .json({ status: "fail", message: "Could not find the requested route" });
});

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    status: "fail",
    message: error instanceof Error ? error.message : "Unknown error",
  });
});

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
