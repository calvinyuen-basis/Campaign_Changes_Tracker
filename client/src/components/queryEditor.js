import { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/theme-github';

import { retrieveDealTargeting, retrieveDomainTargeting, retrieveGeoTargeting } from '../api';
import { concatStringList, parseTargeting } from '../utils/utils';

export default function QueryEditor(props) {
  const campaignDetails = props.campaignDetails || {};
  const { 
    campaignId, 
    advertiser_advertiserId,
    dealjs, 
    geojs, 
    audienceTargetingjs, 
    contextualjs, 
    deviceTargetingjs, 
    trafficTypes, 
    domainListIdsjs 
  } = campaignDetails;

  const [query, setQuery] = useState("");
  
  // query template
  const query_template = [
    "SELECT DISTINCT r.rawrequest,",
    "r.networkid,",
    "ad.dimensions_wh",
    "FROM canal10.auction a",
    "JOIN canal10.repository r on r.auctionid = a.auctionid",
    "JOIN canal10.auction_details ad on ad.auctionid = a.auctionid",
    "WHERE",
    "a.created >= NOW() - HOURS(11) AND",
    "r.created >= NOW() - HOURS(11) AND",
    "ad.created >= NOW() - HOURS(11) AND\n"
  ].join("\n");

  async function getCampaignTargeting() {
    const clauses = [];
    // device 
    if (deviceTargetingjs) {
      const deviceTargeting = JSON.parse(deviceTargetingjs).deviceTypes || [];
      if (deviceTargeting.length > 0) {
        const deviceSegments = concatStringList(deviceTargeting);
        clauses.push(`a.device_type in (${deviceSegments})`);
      }
    }
    // traffic type
    if (trafficTypes) {
      const trafficTargeting = JSON.parse(trafficTypes.replace(/([A-Z_]+)/g, '"$1"')) || [];
      if (trafficTargeting.length > 0 && trafficTargeting.length !== 6) {
        const trafficTypeSegments = concatStringList(trafficTargeting);
        clauses.push(`a.traffictype in (${trafficTypeSegments})`);
      }
    }
    // audience
    if (audienceTargetingjs) {
      const audienceTargeting = JSON.parse(audienceTargetingjs).compositeAudienceTarget;
      const res = parseTargeting(audienceTargeting, "audience");
      clauses.push(res);
    }
    // contextual
    if (contextualjs) {
      const contextualTargeting = JSON.parse(contextualjs).compositeContextualTarget;
      const res = parseTargeting(contextualTargeting, "contextual");
      clauses.push(res);
    }
    // deal 
    if (dealjs) {
      const dealIds = await retrieveDealTargeting(campaignId);
      const dealTargeting = dealIds.map(id => `a.deals_dealid && array['${id}']`);
      clauses.push(`(${dealTargeting.join(' OR\n')})`);
    }
    // geo
    if (geojs) {
      const res = await retrieveGeoTargeting(advertiser_advertiserId, campaignId);
      console.log(res)
    }
    // domain
    if (domainListIdsjs) {
      const geoResult = await retrieveDomainTargeting(campaignId);
      if (geoResult && geoResult.success) {
        const { whitelist, blacklist } = geoResult;
        if (whitelist && whitelist.length > 0) {
          clauses.push(`a.domainname IN (${concatStringList(whitelist)})`);
        }
        if (blacklist && blacklist.length > 0) {
          clauses.push(`a.domainname NOT IN (${concatStringList(blacklist)})`);
        }
      }
    }
    // build final query
    return query_template + clauses.join(' AND\n') + "\nLIMIT 10;";
  }

  useEffect(() => {
    getCampaignTargeting().then(temp_query => setQuery(temp_query));
  }, [props.campaignDetails]);

  if (!props.campaignDetails) return;

  return (
    <AceEditor
      mode="sql"
      theme="github"
      name="query-editor"
      width="100%"
      height="300px"
      fontSize={16}
      showPrintMargin={true}
      showGutter={true}
      highlightActiveLine={true}
      value={query || ""}
      setOptions={{
        showLineNumbers: true,
        tabSize: 2,
      }}
      editorProps={{ $blockScrolling: true }}
    />
  );
}