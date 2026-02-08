import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

let access_token;

export async function getAccessToken() {
  if (access_token) return access_token;

  const clientId = process.env.API_CLIENT_ID;
  const clientSecret = process.env.API_CLIENT_SECRET;
  const encoded = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    const res = await fetch("https://api.sitescout.com/oauth/token", {
      method: "POST",
      headers: {
        "Host": "api.sitescout.com",
        "Authorization": `Basic ${encoded}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json"
      },
      body: new URLSearchParams({
        grant_type: "client_credentials"
      })
    });
    const data = await res.json();
    return data.access_token;
  } catch (err) {
    console.error("Error fetching access token:", err);
    throw err;
  }
}