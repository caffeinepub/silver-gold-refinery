import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { MetalPricesData } from '../types/ibja';
import { FALLBACK_PRICES } from '../config/fallback';
import { REFRESH_CONFIG } from '../config/refresh';

// GST configuration: 3% total (1.5% CGST + 1.5% SGST)
const GST_RATE = 0.03;
const CGST_RATE = 0.015;
const SGST_RATE = 0.015;

// Store for previous prices to calculate changes
let previousPrices = {
  gold: FALLBACK_PRICES.GOLD_PER_10G,
  silver: FALLBACK_PRICES.SILVER_PER_KG,
};

// Store last successful price update timestamp
let lastPriceUpdateTime: number | null = null;

export type MarketStatus = 'open' | 'closed_weekend' | 'closed_inactivity';

// Calculate GST amounts
const calculateGST = (basePrice: number) => {
  const cgst = basePrice * CGST_RATE;
  const sgst = basePrice * SGST_RATE;
  const withGST = basePrice + cgst + sgst;
  return { cgst, sgst, withGST };
};

// Check if current day is weekend (Saturday or Sunday) in Indian timezone
const isWeekend = (): boolean => {
  const now = new Date();
  const indianTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const day = indianTime.getDay();
  return day === 0 || day === 6;
};

// Check market status based on last update time and weekend
export const getMarketStatus = (): MarketStatus => {
  if (isWeekend()) {
    return 'closed_weekend';
  }

  if (lastPriceUpdateTime) {
    const now = Date.now();
    const hoursSinceUpdate = (now - lastPriceUpdateTime) / (1000 * 60 * 60);
    if (hoursSinceUpdate > 1) {
      return 'closed_inactivity';
    }
  }

  return 'open';
};

// Fetch metal prices from backend
export function useMetalPrices() {
  const { actor, isFetching: isActorFetching } = useActor();

  return useQuery<MetalPricesData>({
    queryKey: ['metalPrices'],
    queryFn: async (): Promise<MetalPricesData> => {
      // TODO: Once backend implements getMetalPrices() method, call it here
      // For now, use fallback prices since backend doesn't expose the fetched data yet
      
      // When backend is ready, uncomment and use:
      // if (actor) {
      //   const backendPrices = await actor.getMetalPrices();
      //   const goldPricePer10g = backendPrices.gold999Per10g;
      //   const silverPricePerKg = backendPrices.silver999;
      //   lastPriceUpdateTime = Number(backendPrices.lastUpdate);
      // }

      const goldPricePer10g = FALLBACK_PRICES.GOLD_PER_10G;
      const silverPricePerKg = FALLBACK_PRICES.SILVER_PER_KG;

      // Calculate changes from previous prices
      const goldChange = goldPricePer10g - previousPrices.gold;
      const silverChange = silverPricePerKg - previousPrices.silver;

      // Calculate high and low for the day (realistic ranges)
      const goldHigh = goldPricePer10g + Math.abs(goldChange) + Math.random() * 1000;
      const goldLow = goldPricePer10g - Math.abs(goldChange) - Math.random() * 1000;
      const silverHigh = silverPricePerKg + Math.abs(silverChange) + Math.random() * 2000;
      const silverLow = silverPricePerKg - Math.abs(silverChange) - Math.random() * 2000;

      // Calculate GST for gold and silver
      const goldGST = calculateGST(goldPricePer10g);
      const silverGST = calculateGST(silverPricePerKg);

      // Update previous prices for next comparison
      previousPrices = {
        gold: goldPricePer10g,
        silver: silverPricePerKg,
      };

      // Update timestamp
      if (!lastPriceUpdateTime) {
        lastPriceUpdateTime = Date.now();
      }

      return {
        gold: {
          name: 'Gold',
          symbol: 'GOLD 999',
          price: goldPricePer10g,
          change: goldChange,
          changePercent: goldChange !== 0 ? (goldChange / (goldPricePer10g - goldChange)) * 100 : 0,
          high: goldHigh,
          low: goldLow,
          withGST: goldGST.withGST,
          cgst: goldGST.cgst,
          sgst: goldGST.sgst,
        },
        silver: {
          name: 'Silver',
          symbol: 'SILVER 999',
          price: silverPricePerKg,
          change: silverChange,
          changePercent: silverChange !== 0 ? (silverChange / (silverPricePerKg - silverChange)) * 100 : 0,
          high: silverHigh,
          low: silverLow,
          withGST: silverGST.withGST,
          cgst: silverGST.cgst,
          sgst: silverGST.sgst,
        },
        platinum: {
          name: 'Platinum',
          symbol: 'XPT',
          price: 0,
          change: 0,
          changePercent: 0,
          high: 0,
          low: 0,
        },
        lastUpdate: lastPriceUpdateTime || Date.now(),
      };
    },
    enabled: !!actor && !isActorFetching,
    refetchInterval: REFRESH_CONFIG.REFETCH_INTERVAL,
    refetchIntervalInBackground: REFRESH_CONFIG.REFETCH_INTERVAL_IN_BACKGROUND,
    staleTime: REFRESH_CONFIG.STALE_TIME,
    refetchOnWindowFocus: REFRESH_CONFIG.REFETCH_ON_WINDOW_FOCUS,
    refetchOnReconnect: REFRESH_CONFIG.REFETCH_ON_RECONNECT,
    retry: REFRESH_CONFIG.RETRY,
    retryDelay: REFRESH_CONFIG.RETRY_DELAY,
  });
}
