import fetch from "node-fetch";
import axios from 'axios';

import { rentdb1 } from "../database/db.js";

// DATABASE QUERIES

export async function getCampaignDetails(req, res) {
  try {
    const { campaignId } = req.params;
    const [campaignDetails] = await rentdb1.query("SELECT * FROM Campaign WHERE campaignId = ? LIMIT 1", [campaignId]);
    
    if (campaignDetails.length === 0) {
      return res.status(404).end("Campaign not found");
    }
    res.json(campaignDetails[0]); 
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
}

export async function getCampaignDealTargeting(req, res) {
  try {
    const { campaignId } = req.params;
    let [result] = await rentdb1.query("SELECT dealjs FROM Campaign WHERE campaignId = ? LIMIT 1", [campaignId]);

    const dealjs = JSON.parse(result[0].dealjs);
    const externalDealIds = [];
    // retrieve individual external deal ids
    if (dealjs.hasOwnProperty('cd')) {
      dealjs.cd.forEach(deal => {
        if (deal.hasOwnProperty('nd')) deal.nd.forEach(id => externalDealIds.push(id));
      })
    }
    // deal groups
    if (dealjs.hasOwnProperty('dg')) {
      // extract internal deal ids from deal groups
      // const ocient_conn = await getOcientConnection();
      const dealGroupIds = dealjs.dg.join(", ");
      // const [internalDealIds] = await queryOcient(`SELECT internalDealIdsjs FROM DealGroup WHERE dealGroupId IN (${dealGroupIds})`);
      console.log(dealGroupIds);
      // interlDealIds.forEach(internalDealId => {
      //   const ids = JSON.parse(row.internalDealIdsjs);
      //   internal_ids = internal_ids.concat(ids);
      // });
      // // extract external deal ids from Ocient using internal deal ids
      // if (internal_ids.length > 0) {
      //   internal_ids.forEach(deal => {
      //     externalDealIds.push(deal);
      //   });
    }
    res.json(externalDealIds);
  } catch (err) {
    res.status(500).json(err);
  }
}

export async function getCampaignGeoTargeting(req, res) {
  try {
    const { advertiserId, campaignId } = req.params;
    const accessToken = process.env.SITESCOUT_ACCESS_TOKEN; // or get from elsewhere
    const response = await fetch(
      `https://api.sitescout.com/advertisers/${advertiserId}/campaigns/${campaignId}/targeting/geo`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
    const data = await response.json();
    console.log(data)
    
  } catch (err) {
    res.status(500).json(err);
  }
}

export async function getCampaignDomainTargeting(req, res) {
  try {
    const { campaignId } = req.params;

    const [rows] = await rentdb1.query("SELECT domainListIdsjs FROM Campaign WHERE campaignId = ? LIMIT 1", [campaignId]);
    if (rows[0].domainListIdsjs == null) {
      return res.json({ false: true, message: "This campaign does not have any domain targeting" });
    }
    const domainListIds = JSON.parse(rows[0].domainListIdsjs);
    const placeholders = domainListIds.map(() => '?').join(',');
    const [domains] = await rentdb1.query(
      `SELECT type, domain FROM DomainList JOIN DomainTarget ON domainListId = domainList_domainListId WHERE domainList_domainListId IN (${placeholders})`,
      domainListIds
    );

    const whitelist = new Set();
    const blacklist = new Set();
    domains.forEach(({ type, domain }) => {
      if (type === 'whitelist') {
        whitelist.add(domain);
      } else {
        blacklist.add(domain);
      }
    });
    res.json({ whitelist: Array.from(whitelist), blacklist: Array.from(blacklist) });
  } catch (err) {
    res.status(500).json(err);
  }
}

// EXTERNAL API CALLS

export async function getCampaignChanges(req, res) {
  try {
    const { campaignId } = req.params;
    const response = await fetch(
      `https://evpapi-int.sitescout.com/entities/completeCampaign/${campaignId}/snapshots`
    );
    const data = await response.json();

    // filter out campaign changes that aren't meaningful
    const filteredData = data
      .map(entry => ({
        ...entry,
        changes: entry.changes ? entry.changes.filter(change => 
          change.fieldName !== 'lastModified' && change.oldValue !== change.newValue
        ) : []
      }))
      .filter(entry => entry.type === 'INITIAL' || (entry.changes && entry.changes.length > 0));
    res.json(filteredData);
  } catch (err) {
    res.status(500).json(err);
  }
}