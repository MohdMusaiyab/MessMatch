import express, { Application } from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import bodyparser from "body-parser";
import cors from "cors";
dotenv.config();

const app: Application = express();
app.use(bodyparser.json());
app.use(cors());

const PORT: number = parseInt(process.env.PORT || "4000", 10);

app.use(`${process.env.BASE_URL}/auth`,authRoutes);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
