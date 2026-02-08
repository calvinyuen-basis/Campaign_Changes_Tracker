import express from "express";
import fetch from "node-fetch";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

import { rentdb1 } from "./database/db.js";
import { getAccessToken } from "./authentication/accessToken.js";

import campaignRoutes from "./routes/campaignRoutes.js";

import logger from "./middleware/logger.js";

dotenv.config();
const PORT = process.env.SERVER_PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(logger);

app.use("/api/campaigns", campaignRoutes);

// verify access token and database connections on startup
(async () => {
  try {
    const connection = await rentdb1.getConnection();
    await connection.ping();
    connection.release();
    console.log("✅ Connected to RentDB1 (MySQL)");
  } catch (err) {
    console.error("❌ Failed to connect to RentDB1 (MySQL):", err.message);
  }
  try {
    const token = await getAccessToken();
    if (token !== null) console.log("✅ Genereated Access Token");
  } catch (err) {
    console.error("❌ Failed to connect to RentDB1 (MySQL):", err.message);
  }
}) ();

app.listen(PORT, () => console.log(`Server running on ${PORT}\n`));