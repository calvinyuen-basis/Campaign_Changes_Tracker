import { getRentDB1Connection } from "../database/db.js";

export async function getCampaignById(req, res) {
  try {
    const campaignID = parseInt(req.params.campaignID, 10);
    const pool = await getRentDB1Connection();
    const [rows] = await pool.query(
      "SELECT * FROM Campaign WHERE campaignId = ?",
      [campaignID]
    );
    if (rows.length > 0) {
      res.json({ success: true, data: rows });
    } else {
      res.json({ success: false, data: [], message: "No campaign found." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
