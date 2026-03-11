import { useMetalPricesQuery } from "@/hooks/useQueries";
import { Minus, Radio, TrendingDown, TrendingUp } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";

function useRelativeTime(timestampMs: number | undefined): string {
  const [relativeTime, setRelativeTime] = useState<string>("");

  useEffect(() => {
    if (!timestampMs) {
      setRelativeTime("");
      return;
    }

    const update = () => {
      const seconds = Math.floor((Date.now() - timestampMs) / 1000);
      if (seconds < 5) setRelativeTime("just now");
      else if (seconds < 60) setRelativeTime(`${seconds}s ago`);
      else {
        const minutes = Math.floor(seconds / 60);
        setRelativeTime(`${minutes}m ago`);
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [timestampMs]);

  return relativeTime;
}

const MetalTicker: React.FC = () => {
  const { data: prices, isLoading } = useMetalPricesQuery();
  const prevGoldRef = useRef<number | null>(null);
  const prevSilverRef = useRef<number | null>(null);
  const [goldTrend, setGoldTrend] = useState<"up" | "down" | "neutral">(
    "neutral",
  );
  const [silverTrend, setSilverTrend] = useState<"up" | "down" | "neutral">(
    "neutral",
  );
  const [pulse, setPulse] = useState(false);

  const relativeTime = useRelativeTime(prices?.lastFetchedAt);

  useEffect(() => {
    if (prices) {
      if (prevGoldRef.current !== null) {
        if (prices.gold999Per10g > prevGoldRef.current) setGoldTrend("up");
        else if (prices.gold999Per10g < prevGoldRef.current)
          setGoldTrend("down");
        else setGoldTrend("neutral");
      }
      if (prevSilverRef.current !== null) {
        if (prices.silver999PerKg > prevSilverRef.current) setSilverTrend("up");
        else if (prices.silver999PerKg < prevSilverRef.current)
          setSilverTrend("down");
        else setSilverTrend("neutral");
      }
      prevGoldRef.current = prices.gold999Per10g;
      prevSilverRef.current = prices.silver999PerKg;
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 800);
      return () => clearTimeout(t);
    }
  }, [prices]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  const TrendIcon = ({ trend }: { trend: "up" | "down" | "neutral" }) => {
    if (trend === "up")
      return <TrendingUp className="w-4 h-4 text-green-400 inline" />;
    if (trend === "down")
      return <TrendingDown className="w-4 h-4 text-red-400 inline" />;
    return <Minus className="w-4 h-4 text-yellow-300 inline" />;
  };

  const tickerItems = prices
    ? [
        {
          label: "GOLD 999",
          unit: "/10g",
          price: prices.gold999Per10g,
          trend: goldTrend,
        },
        {
          label: "SILVER BUY",
          unit: "/kg",
          price: prices.silverBuyPerKg,
          trend: silverTrend,
        },
        {
          label: "SILVER SELL",
          unit: "/kg",
          price: prices.silverSellPerKg,
          trend: silverTrend,
        },
        {
          label: "GOLD + GST",
          unit: "/10g",
          price: prices.goldWithGst,
          trend: goldTrend,
        },
        {
          label: "SILVER BUY+GST",
          unit: "/kg",
          price: prices.silverBuyWithGst,
          trend: silverTrend,
        },
        {
          label: "SILVER SELL+GST",
          unit: "/kg",
          price: prices.silverSellWithGst,
          trend: silverTrend,
        },
      ]
    : [];

  const tickerKey = (label: string, repeat: number) => `${label}-${repeat}`;

  return (
    <div className="bg-neutral-900 border-b border-yellow-600/30 overflow-hidden relative">
      <div className="flex items-center justify-between px-3 py-1 bg-neutral-950 border-b border-yellow-600/20">
        <div className="flex items-center gap-2">
          <Radio className="w-3 h-3 text-red-500 animate-pulse" />
          <span className="text-xs font-bold text-red-400 tracking-widest uppercase">
            Live
          </span>
          <span className="text-xs text-yellow-300 font-medium">
            IBJA Rates
          </span>
        </div>
        <div className="flex items-center gap-2">
          {prices?.marketClosed || !prices?.isMarketOpen ? (
            <span className="inline-flex items-center gap-1 text-xs text-neutral-300 font-medium bg-neutral-800 border border-neutral-600 rounded-full px-2 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 inline-block" />
              Market Closed
            </span>
          ) : (
            <span className="text-xs text-green-400 font-semibold">
              ● Market Open
            </span>
          )}
          {prices?.lastFetchedAt && relativeTime && (
            <span
              className={`text-xs font-medium transition-opacity duration-300 ${pulse ? "text-yellow-200 opacity-100" : "text-yellow-300/70 opacity-80"}`}
            >
              Updated {relativeTime}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center h-10 overflow-hidden">
        {isLoading && !prices && (
          <div className="flex items-center gap-2 px-4 text-yellow-300 text-sm animate-pulse">
            <span>Fetching live IBJA rates...</span>
          </div>
        )}
        {tickerItems.length > 0 && (
          <div className="ticker-scroll flex items-center gap-0 whitespace-nowrap">
            {[0, 1, 2].flatMap((repeat) =>
              tickerItems.map((item) => (
                <span
                  key={tickerKey(item.label, repeat)}
                  className="inline-flex items-center gap-2 px-6 text-sm font-medium"
                >
                  <span className="text-yellow-400 font-bold tracking-wide">
                    {item.label}
                  </span>
                  <span
                    className={`font-mono font-bold transition-all duration-500 ${pulse ? "text-white scale-105" : "text-yellow-100"}`}
                  >
                    {formatPrice(item.price)}
                  </span>
                  <span className="text-yellow-300 text-xs font-medium">
                    {item.unit}
                  </span>
                  <TrendIcon trend={item.trend} />
                  <span className="text-yellow-600 mx-2">◆</span>
                </span>
              )),
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MetalTicker;
