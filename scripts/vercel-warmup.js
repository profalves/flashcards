// Warm-up script to prevent cold starts on Vercel free tier
// Run this periodically (every 15 minutes) to keep the function warm

import fetch from "node-fetch";

const VERCEL_URL = process.env.VERCEL_URL || "https://flashcards-murex-one.vercel.app";
const WARMUP_INTERVAL = 14 * 60 * 1000; // 14 minutes (free tier times out at 15)

async function warmUp() {
  try {
    console.log(`[WARMUP] Starting at ${new Date().toISOString()}`);

    const response = await fetch(`${VERCEL_URL}/api/translate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "hello" }),
      timeout: 30000,
    });

    const data = await response.json();
    console.log(
      `[WARMUP] Status: ${response.status}, Result:`,
      JSON.stringify(data).substring(0, 100)
    );
  } catch (error) {
    console.error(`[WARMUP] Error:`, error instanceof Error ? error.message : error);
  }
}

// Run immediately on start
warmUp();

// Then run periodically
setInterval(warmUp, WARMUP_INTERVAL);

console.log(`[WARMUP] Scheduled to run every ${WARMUP_INTERVAL / 1000 / 60} minutes`);
