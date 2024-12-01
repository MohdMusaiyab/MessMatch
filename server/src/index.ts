// src/index.ts
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { testController } from "./controller";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/",testController);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
