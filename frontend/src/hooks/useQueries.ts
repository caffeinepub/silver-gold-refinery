import { useQuery } from '@tanstack/react-query';
import { IBJA_RATES_URL, REQUEST_TIMEOUT } from '@/config/api';
import { REFETCH_INTERVAL, STALE_TIME } from '@/config/refresh';
import { FALLBACK_PRICES } from '@/config/fallback';

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
  lastFetchedAt: number; // Unix timestamp ms for relative time display
  isMarketOpen: boolean;
  marketClosed: boolean;
  source: string;
}

// Module-level state to track price changes across fetches
let lastPriceChangeTime: number = Date.now();
let lastKnownGold: number = FALLBACK_PRICES.gold;
let lastKnownSilver: number = FALLBACK_PRICES.silver;
let prevGold: number = 0;
let prevSilver: number = 0;

function buildMetalPrice(
  gold999Per10g: number,
  silver999PerKg: number,
  source: string
): MetalPrice {
  const now = Date.now();

  // Track price movement for market-closed detection
  if (prevGold !== 0 && prevSilver !== 0) {
    if (gold999Per10g !== prevGold || silver999PerKg !== prevSilver) {
      lastPriceChangeTime = now;
    }
  } else {
    lastPriceChangeTime = now;
  }
  prevGold = gold999Per10g;
  prevSilver = silver999PerKg;

  // Market closed if no price movement for 60+ minutes
  const minutesSinceChange = (now - lastPriceChangeTime) / (1000 * 60);
  const marketClosed = minutesSinceChange >= 60;

  // 3% GST (1.5% CGST + 1.5% SGST)
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

  // Market hours: Mon–Sat 9:00 AM – 5:00 PM IST
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
    lastUpdated: new Date().toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
    lastFetchedAt: now,
    isMarketOpen,
    marketClosed,
    source,
  };
}

async function fetchIBJARates(): Promise<MetalPrice> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(IBJA_RATES_URL, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
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
      // Try to extract a JSON array from HTML/script content
      const jsonMatch = text.match(/\[[\s\S]*?\]/);
      if (jsonMatch) {
        data = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Could not parse IBJA response as JSON');
      }
    }

    let gold999Per10g = 0;
    let silver999PerKg = 0;

    // Format 1: Array of objects with Purity + GoldRate + SilverRate
    if (Array.isArray(data)) {
      // Prefer the 999 purity entry
      const entry999 = (data as Record<string, unknown>[]).find(
        (item) => String(item['Purity'] ?? item['purity'] ?? '').trim() === '999'
      );

      if (entry999) {
        const gr = entry999['GoldRate'] ?? entry999['goldRate'] ?? entry999['Gold'] ?? entry999['gold'];
        const sr = entry999['SilverRate'] ?? entry999['silverRate'] ?? entry999['Silver'] ?? entry999['silver'];
        gold999Per10g = parseFloat(String(gr ?? '0').replace(/,/g, ''));
        silver999PerKg = parseFloat(String(sr ?? '0').replace(/,/g, ''));
      }

      // Fallback: scan all items for RateName-style fields
      if (!gold999Per10g || !silver999PerKg) {
        for (const item of data as Record<string, unknown>[]) {
          const name = String(
            item['RateName'] ?? item['rateName'] ?? item['name'] ?? ''
          ).toLowerCase();
          const rateStr = String(
            item['Rates'] ?? item['rates'] ?? item['Rate'] ?? item['rate'] ?? '0'
          );
          const rate = parseFloat(rateStr.replace(/,/g, ''));

          if (!gold999Per10g && name.includes('gold') && name.includes('999')) {
            gold999Per10g = rate;
          } else if (!silver999PerKg && name.includes('silver') && name.includes('999')) {
            silver999PerKg = rate;
          }
        }
      }

      // Fallback: first item with GoldRate/SilverRate regardless of purity
      if (!gold999Per10g || !silver999PerKg) {
        for (const item of data as Record<string, unknown>[]) {
          const gr = item['GoldRate'] ?? item['goldRate'] ?? item['Gold'] ?? item['gold'];
          const sr = item['SilverRate'] ?? item['silverRate'] ?? item['Silver'] ?? item['silver'];
          if (gr && sr) {
            gold999Per10g = parseFloat(String(gr).replace(/,/g, ''));
            silver999PerKg = parseFloat(String(sr).replace(/,/g, ''));
            break;
          }
        }
      }
    }

    // Format 2: Plain object
    if ((!gold999Per10g || !silver999PerKg) && data && typeof data === 'object' && !Array.isArray(data)) {
      const obj = data as Record<string, unknown>;
      const gr = obj['GoldRate'] ?? obj['goldRate'] ?? obj['Gold'] ?? obj['gold'];
      const sr = obj['SilverRate'] ?? obj['silverRate'] ?? obj['Silver'] ?? obj['silver'];
      if (gr) gold999Per10g = parseFloat(String(gr).replace(/,/g, ''));
      if (sr) silver999PerKg = parseFloat(String(sr).replace(/,/g, ''));
    }

    if (!gold999Per10g || !silver999PerKg) {
      throw new Error('Could not extract gold/silver 999 prices from IBJA response');
    }

    // Update last known prices on success
    lastKnownGold = gold999Per10g;
    lastKnownSilver = silver999PerKg;

    return buildMetalPrice(gold999Per10g, silver999PerKg, 'IBJA');
  } catch {
    // Silently fall back to last known prices — no error exposed to UI
    return buildMetalPrice(lastKnownGold, lastKnownSilver, 'IBJA (cached)');
  } finally {
    clearTimeout(timeout);
  }
}

export function useMetalPricesQuery() {
  return useQuery<MetalPrice>({
    queryKey: ['metalPrices'],
    queryFn: fetchIBJARates,
    refetchInterval: REFETCH_INTERVAL,
    staleTime: STALE_TIME,
    retry: false, // Fallback is handled inside queryFn
  });
}
