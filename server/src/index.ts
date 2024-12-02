import express, { Application } from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app: Application = express();

const PORT: number = parseInt(process.env.PORT || "3000", 10);

app.use(`${process.env.BASE_URL}/auth`,authRoutes);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
