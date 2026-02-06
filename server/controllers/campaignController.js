import fetch from "node-fetch";

import { getRentDB1Connection } from "../database/db.js";


// Dtabase Queries

export async function getCampaignDetails(req, res) {
  try {
    const campaignID = parseInt(req.params.campaignID, 10);
    const pool = await getRentDB1Connection();
    const [rows] = await pool.query(
      "SELECT * FROM Campaign WHERE campaignId = ? LIMIT 1",
      [campaignID]
    );
    if (rows.length > 0) {
      res.json({ success: true, data: rows });
    } else {
      res.json({ success: false, message: "Campaign is not found. Please enter a valid Campaign ID" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// API calls

export async function getCampaignChanges(req, res) {
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
}
