import { useQuery } from "@tanstack/react-query";
import { FALLBACK_PRICES } from "@/config/fallback";

export interface MetalPrice {
  gold999Per10g: number;
  silver999PerKg: number;
  goldGst: number;
  silverGst: number;
  goldCgst: number;
  goldSgst: number;
  silverCgst: number;
  silverSgst: number;
  goldWithGst: number;
  silverWithGst: number;
  lastUpdated: string;
  isMarketOpen: boolean;
  marketClosed: boolean;
  source: string;
}

// Track last price change timestamp and last known prices across fetches
let lastPriceChangeTime: number = Date.now();
let lastKnownGold: number | null = null;
let lastKnownSilver: number | null = null;

function buildMetalPrice(
  gold999Per10g: number,
  silver999PerKg: number,
  source: string
): MetalPrice {
  // Detect price movement
  const now = Date.now();
  if (lastKnownGold !== null && lastKnownSilver !== null) {
    if (gold999Per10g !== lastKnownGold || silver999PerKg !== lastKnownSilver) {
      lastPriceChangeTime = now;
    }
  } else {
    // First fetch — reset timer
    lastPriceChangeTime = now;
  }
  lastKnownGold = gold999Per10g;
  lastKnownSilver = silver999PerKg;

  // Market closed if no price movement for 60+ minutes
  const minutesSinceChange = (now - lastPriceChangeTime) / (1000 * 60);
  const marketClosed = minutesSinceChange >= 60;

  // Calculate 3% GST (1.5% CGST + 1.5% SGST)
  const GST_RATE = 0.03;
  const CGST_RATE = 0.015;
  const SGST_RATE = 0.015;

  const goldGst = gold999Per10g * GST_RATE;
  const goldCgst = gold999Per10g * CGST_RATE;
  const goldSgst = gold999Per10g * SGST_RATE;
  const goldWithGst = gold999Per10g + goldGst;

  const silverGst = silver999PerKg * GST_RATE;
  const silverCgst = silver999PerKg * CGST_RATE;
  const silverSgst = silver999PerKg * SGST_RATE;
  const silverWithGst = silver999PerKg + silverGst;

  // Market hours: Mon-Sat 9:00 AM - 5:00 PM IST
  const nowDate = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istTime = new Date(nowDate.getTime() + istOffset);
  const istHour = istTime.getUTCHours();
  const istMinute = istTime.getUTCMinutes();
  const istDay = istTime.getUTCDay(); // 0=Sun, 6=Sat
  const totalMinutes = istHour * 60 + istMinute;
  const isMarketOpen =
    istDay >= 1 &&
    istDay <= 6 &&
    totalMinutes >= 9 * 60 &&
    totalMinutes < 17 * 60;

  return {
    gold999Per10g,
    silver999PerKg,
    goldGst,
    silverGst,
    goldCgst,
    goldSgst,
    silverCgst,
    silverSgst,
    goldWithGst,
    silverWithGst,
    lastUpdated: new Date().toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    isMarketOpen,
    marketClosed,
    source,
  };
}

async function fetchIBJARates(): Promise<MetalPrice> {
  try {
    const response = await fetch("https://rates.ibja.co/", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      mode: "cors",
    });

    if (!response.ok) {
      throw new Error(`IBJA API error: ${response.status}`);
    }

    const data = await response.json();

    let gold999Per10g = 0;
    let silver999PerKg = 0;

    if (Array.isArray(data)) {
      for (const item of data) {
        const name = (item.RateName || item.rateName || item.name || "")
          .toString()
          .toLowerCase();
        const rateStr = (
          item.Rates ||
          item.rates ||
          item.Rate ||
          item.rate ||
          "0"
        ).toString();
        const rate = parseFloat(rateStr.replace(/,/g, ""));

        if (name.includes("gold") && name.includes("999")) {
          gold999Per10g = rate;
        } else if (name.includes("silver") && name.includes("999")) {
          silver999PerKg = rate;
        }
      }
    } else if (typeof data === "object" && data !== null) {
      const keys = Object.keys(data);
      for (const key of keys) {
        const keyLower = key.toLowerCase();
        const val = data[key];
        const rate =
          typeof val === "number"
            ? val
            : parseFloat(String(val).replace(/,/g, ""));

        if (keyLower.includes("gold") && keyLower.includes("999")) {
          gold999Per10g = rate;
        } else if (keyLower.includes("silver") && keyLower.includes("999")) {
          silver999PerKg = rate;
        }
      }
    }

    if (!gold999Per10g || !silver999PerKg) {
      throw new Error("Could not parse gold/silver prices from IBJA response");
    }

    return buildMetalPrice(gold999Per10g, silver999PerKg, "IBJA");
  } catch {
    // Silently fall back to last known IBJA prices — no error exposed to UI
    const fallbackGold = lastKnownGold ?? FALLBACK_PRICES.GOLD_PER_10G;
    const fallbackSilver = lastKnownSilver ?? FALLBACK_PRICES.SILVER_PER_KG;
    return buildMetalPrice(fallbackGold, fallbackSilver, "IBJA (cached)");
  }
}

export function useMetalPricesQuery() {
  return useQuery<MetalPrice>({
    queryKey: ["metalPrices"],
    queryFn: fetchIBJARates,
    refetchInterval: 10000, // 10 seconds
    staleTime: 9000, // 9 seconds
    retry: false, // We handle fallback inside queryFn
  });
}
