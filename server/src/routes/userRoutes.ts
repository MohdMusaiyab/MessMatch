import express from "express";
import { isSign } from "../middlewares/isSign";

const userRoutes = express.Router();

userRoutes.get("/", isSign as any, (req, res) => {
  res.send("Hello");
});

export default userRoutes;
