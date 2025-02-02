import express, { Application } from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import bodyparser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import contractorRoutes from "./routes/contractorRoutes";
import auctionRoutes from "./routes/auctionRoutes";
import contractRoutes from "./routes/contractRoutes";
dotenv.config();

const app: Application = express();
app.use(bodyparser.json());
const corsOptions = {
  origin: "http://localhost:3000", // Allow requests only from this origin
  credentials: true, // Allow cookies and authorization headers
};
app.use(cors(corsOptions));
app.use(cookieParser()); // Add cookie-parser middleware

const PORT: number = parseInt(process.env.PORT || "4000", 10);

app.use(`${process.env.BASE_URL}/auth`, authRoutes);

app.use(`${process.env.BASE_URL}/user`, userRoutes);

app.use(`${process.env.BASE_URL}/contractor`, contractorRoutes);

app.use(`${process.env.BASE_URL}/auction`, auctionRoutes);

app.use(`${process.env.BASE_URL}/contract`, contractRoutes);
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
