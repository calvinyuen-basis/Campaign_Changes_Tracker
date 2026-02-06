import express from "express";
import { getCampaignDetails, getCampaignChanges } from "../controllers/campaignController.js";
const router = express.Router();

router.get("/:campaignID", getCampaignDetails);
router.get("/external/:campaignID", getCampaignChanges);

export default router;
