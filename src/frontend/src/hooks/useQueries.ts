import { IBJA_RATES_URL, REQUEST_TIMEOUT } from "@/config/api";
import { FALLBACK_PRICES } from "@/config/fallback";
import { REFETCH_INTERVAL, STALE_TIME } from "@/config/refresh";
import { useQuery } from "@tanstack/react-query";

export interface MetalPrice {
  gold999Per10g: number;
  silver999PerKg: number;
  silverBuyPerKg: number;
  silverSellPerKg: number;
  goldGst: number;
  silverGst: number;
  goldCgst: number;
  goldSgst: number;
  silverCgst: number;
  silverSgst: number;
  goldWithGst: number;
  silverWithGst: number;
  silverBuyWithGst: number;
  silverSellWithGst: number;
  lastUpdated: string;
  lastFetchedAt: number;
  isMarketOpen: boolean;
  marketClosed: boolean;
  source: string;
  highPriceDifference: boolean;
}

let lastPriceChangeTime: number = Date.now();
let lastKnownGold: number = FALLBACK_PRICES.gold;
let lastKnownSilver: number = FALLBACK_PRICES.silver;
let lastKnownSilverBuy: number = FALLBACK_PRICES.silverBuy;
let lastKnownSilverSell: number = FALLBACK_PRICES.silverSell;
let prevGold = 0;
let prevSilver = 0;

function buildMetalPrice(
  gold999Per10g: number,
  silver999PerKg: number,
  source: string,
  silverBuyPerKg?: number,
  silverSellPerKg?: number,
): MetalPrice {
  const now = Date.now();

  if (prevGold !== 0 && prevSilver !== 0) {
    if (gold999Per10g !== prevGold || silver999PerKg !== prevSilver) {
      lastPriceChangeTime = now;
    }
  } else {
    lastPriceChangeTime = now;
  }
  prevGold = gold999Per10g;
  prevSilver = silver999PerKg;

  const minutesSinceChange = (now - lastPriceChangeTime) / (1000 * 60);
  const marketClosed = minutesSinceChange >= 60;

  const GST_RATE = 0.03;
  const HALF_GST = 0.015;

  const goldGst = gold999Per10g * GST_RATE;
  const goldCgst = gold999Per10g * HALF_GST;
  const goldSgst = gold999Per10g * HALF_GST;
  const goldWithGst = gold999Per10g + goldGst;

  const silverGst = silver999PerKg * GST_RATE;
  const silverCgst = silver999PerKg * HALF_GST;
  const silverSgst = silver999PerKg * HALF_GST;
  const silverWithGst = silver999PerKg + silverGst;

  const buyPrice = silverBuyPerKg ?? FALLBACK_PRICES.silverBuy;
  const sellPrice = silverSellPerKg ?? FALLBACK_PRICES.silverSell;
  const silverBuyWithGst = buyPrice * (1 + GST_RATE);
  const silverSellWithGst = sellPrice * (1 + GST_RATE);

  const highPriceDifference = Math.abs(buyPrice - sellPrice) > 10000;

  const nowDate = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istTime = new Date(nowDate.getTime() + istOffset);
  const istHour = istTime.getUTCHours();
  const istMinute = istTime.getUTCMinutes();
  const istDay = istTime.getUTCDay();
  const totalMinutes = istHour * 60 + istMinute;
  const isMarketOpen =
    istDay >= 1 &&
    istDay <= 6 &&
    totalMinutes >= 9 * 60 &&
    totalMinutes < 17 * 60;

  return {
    gold999Per10g,
    silver999PerKg,
    silverBuyPerKg: buyPrice,
    silverSellPerKg: sellPrice,
    goldGst,
    silverGst,
    goldCgst,
    goldSgst,
    silverCgst,
    silverSgst,
    goldWithGst,
    silverWithGst,
    silverBuyWithGst,
    silverSellWithGst,
    lastUpdated: new Date().toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    lastFetchedAt: now,
    isMarketOpen,
    marketClosed,
    source,
    highPriceDifference,
  };
}

async function fetchIBJARates(): Promise<MetalPrice> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(IBJA_RATES_URL, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
    });

    if (!response.ok) {
      throw new Error(`IBJA HTTP error: ${response.status}`);
    }

    const text = await response.text();

    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      const jsonMatch = text.match(/\[[\s\S]*?\]/);
      if (jsonMatch) {
        data = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Could not parse IBJA response as JSON");
      }
    }

    let gold999Per10g = 0;
    let silver999PerKg = 0;

    if (Array.isArray(data)) {
      const entry999 = (data as Record<string, unknown>[]).find(
        (item) => String(item.Purity ?? item.purity ?? "").trim() === "999",
      );

      if (entry999) {
        const gr =
          entry999.GoldRate ??
          entry999.goldRate ??
          entry999.Gold ??
          entry999.gold;
        const sr =
          entry999.SilverRate ??
          entry999.silverRate ??
          entry999.Silver ??
          entry999.silver;
        gold999Per10g = Number.parseFloat(String(gr ?? "0").replace(/,/g, ""));
        silver999PerKg = Number.parseFloat(String(sr ?? "0").replace(/,/g, ""));
      }

      if (!gold999Per10g || !silver999PerKg) {
        for (const item of data as Record<string, unknown>[]) {
          const name = String(
            item.RateName ?? item.rateName ?? item.name ?? "",
          ).toLowerCase();
          const rateStr = String(
            item.Rates ?? item.rates ?? item.Rate ?? item.rate ?? "0",
          );
          const rate = Number.parseFloat(rateStr.replace(/,/g, ""));

          if (!gold999Per10g && name.includes("gold") && name.includes("999")) {
            gold999Per10g = rate;
          } else if (
            !silver999PerKg &&
            name.includes("silver") &&
            name.includes("999")
          ) {
            silver999PerKg = rate;
          }
        }
      }

      if (!gold999Per10g || !silver999PerKg) {
        for (const item of data as Record<string, unknown>[]) {
          const gr = item.GoldRate ?? item.goldRate ?? item.Gold ?? item.gold;
          const sr =
            item.SilverRate ?? item.silverRate ?? item.Silver ?? item.silver;
          if (gr && sr) {
            gold999Per10g = Number.parseFloat(String(gr).replace(/,/g, ""));
            silver999PerKg = Number.parseFloat(String(sr).replace(/,/g, ""));
            break;
          }
        }
      }
    }

    if (
      (!gold999Per10g || !silver999PerKg) &&
      data &&
      typeof data === "object" &&
      !Array.isArray(data)
    ) {
      const obj = data as Record<string, unknown>;
      const gr = obj.GoldRate ?? obj.goldRate ?? obj.Gold ?? obj.gold;
      const sr = obj.SilverRate ?? obj.silverRate ?? obj.Silver ?? obj.silver;
      if (gr) gold999Per10g = Number.parseFloat(String(gr).replace(/,/g, ""));
      if (sr) silver999PerKg = Number.parseFloat(String(sr).replace(/,/g, ""));
    }

    if (!gold999Per10g || !silver999PerKg) {
      throw new Error(
        "Could not extract gold/silver 999 prices from IBJA response",
      );
    }

    lastKnownGold = gold999Per10g;
    lastKnownSilver = silver999PerKg;

    return buildMetalPrice(
      gold999Per10g,
      silver999PerKg,
      "IBJA",
      lastKnownSilverBuy,
      lastKnownSilverSell,
    );
  } catch {
    return buildMetalPrice(
      lastKnownGold,
      lastKnownSilver,
      "IBJA (cached)",
      lastKnownSilverBuy,
      lastKnownSilverSell,
    );
  } finally {
    clearTimeout(timeout);
  }
}

export function useMetalPricesQuery() {
  return useQuery<MetalPrice>({
    queryKey: ["metalPrices"],
    queryFn: fetchIBJARates,
    refetchInterval: REFETCH_INTERVAL,
    staleTime: STALE_TIME,
    retry: false,
  });
}
