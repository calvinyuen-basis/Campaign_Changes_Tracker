import express from "express";
import { getCampaignDetails, getCampaignChanges, getCampaignDealTargeting, getCampaignDomainTargeting } from "../controllers/campaignController.js";
const router = express.Router();

router.get("/:campaignId", getCampaignDetails);
router.get("/:campaignId/changes", getCampaignChanges);
router.get("/:campaignId/deals", getCampaignDealTargeting);
router.get("/:campaignId/domainLists", getCampaignDomainTargeting);

export default router;
