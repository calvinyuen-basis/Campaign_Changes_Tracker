import express from "express";
import fetch from "node-fetch"; 
import axios from "axios";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

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

app.listen(PORT, () => console.log(`Server running on ${PORT}`));