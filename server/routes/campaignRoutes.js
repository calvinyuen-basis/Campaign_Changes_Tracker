import express from "express";
import { getCampaignById } from "../controllers/campaignController.js";
const router = express.Router();

router.get("/:campaignID", getCampaignById);

export default router;
