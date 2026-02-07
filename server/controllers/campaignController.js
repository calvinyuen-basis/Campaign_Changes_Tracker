import fetch from "node-fetch";
import axios from 'axios';

import { rentdb1 } from "../database/db.js";


// Database Queries

export async function getCampaignDetails(req, res) {
  try {
    const { campaignId } = req.params;
    const [rows] = await rentdb1.query("SELECT * FROM Campaign WHERE campaignId = ? LIMIT 1", [campaignId]);
    if (rows.length > 0) {
      res.json({ success: true, data: rows });
    } else {
      res.json({ success: false, message: "Campaign is not found. Please enter a valid Campaign ID" });
    }
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
}

export async function getCampaignDealTargeting(req, res) {
  try {
    const { campaignId } = req.params;
    let [result] = await rentdb1.query("SELECT dealjs FROM Campaign WHERE campaignId = ? LIMIT 1", [campaignId]);
    if (!result.length || result[0].dealjs == null) {
      res.json({ success: false, message: "This campaign does not have any deal targeting" });
      return;
    }
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
    return res.json({ success: true, data: externalDealIds });
  } catch (err) {
    console.log(err)
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
    return res.json({
      success: true,
      whitelist: Array.from(whitelist),
      blacklist: Array.from(blacklist)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
}

export async function getCampaignChanges(req, res) {
  try {
    const { campaignId } = req.params;
    const response = await fetch(
      `https://evpapi-int.sitescout.com/entities/completeCampaign/${campaignId}/snapshots`
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
}
