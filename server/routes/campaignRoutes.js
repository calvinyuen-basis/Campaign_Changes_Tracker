import express from "express";
import { 
    getCampaignDetails, 
    getCampaignChanges, 
    getCampaignDealTargeting, 
    getCampaignDomainTargeting,
    getCampaignGeoTargeting
} 
from "../controllers/campaignController.js";

const router = express.Router();

router.get("/:campaignId", getCampaignDetails);
router.get("/:campaignId/changes", getCampaignChanges);
router.get("/:campaignId/deals", getCampaignDealTargeting);
router.get("/:campaignId/geo/:advertiserId", getCampaignGeoTargeting);
router.get("/:campaignId/domainLists", getCampaignDomainTargeting);

export default router;
