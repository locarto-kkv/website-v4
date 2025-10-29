import { google } from "googleapis";
import readline from "readline";
import { env } from "../lib/env.js";
console.log(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET);

const oauth2Client = new google.auth.OAuth2(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  "https://google.com" // redirect URI
);

const SCOPES = ["https://mail.google.com/"];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: SCOPES,
  prompt: "consent",
});

console.log("Authorize this app by visiting this URL:", authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter the code from that page here: ", async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  console.log("Your tokens:", tokens);
  rl.close();
});
