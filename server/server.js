import express from "express";
import fetch from "node-fetch";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import { getRentDB1Connection } from "./database/db.js";
import campaignRoutes from "./routes/campaignRoutes.js";
import logger from "./middleware/logger.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(logger);

app.use("/api/sql/campaign", campaignRoutes);
app.use("/api/campaign", campaignRoutes);


// Verify DB connections on startup
(async () => {
  try {
    await getRentDB1Connection();
    console.log("✅ Connected to RentDB1 (MySQL)");
  } catch (err) {
    console.error("❌ Failed to connect to RentDB1 (MySQL):", err.message);
  }
  // try {
  //   await getOcientConnection();
  //   console.log("✅ Connected to Ocient (MySQL wire protocol)");
  // } catch (err) {
  //   console.error("❌ Failed to connect to Ocient:", err.message);
  // }
})();

app.listen(PORT, () => console.log(`Server running on ${PORT}\n`));