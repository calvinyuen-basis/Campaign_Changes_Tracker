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

app.use("/api/campaign", campaignRoutes);

// Example: SQL query endpoint
app.get("/api/sql/campaign/:campaignID", async (req, res) => {
  try {
    let { campaignID } = req.params;
    campaignID = parseInt(campaignID, 10);
    const pool = await getRentDB1Connection();
    const [rows] = await pool.query(
      "SELECT * FROM Campaign WHERE campaignId = ?",
      [campaignID]
    );
    if (rows && rows.length > 0) {
      res.json({ success: true, data: rows });
    } else {
      res.json({ success: false, data: [], message: "No campaign found for the given ID." });
    }
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Existing API endpoint (external fetch)
app.get("/api/campaign/:campaignID", async (req, res) => {
  try {
    const { campaignID } = req.params;
    const response = await fetch(
      `https://evpapi-int.sitescout.com/entities/completeCampaign/${campaignID}/snapshots`
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


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

app.listen(PORT, () => console.log(`Server running on ${PORT}`));