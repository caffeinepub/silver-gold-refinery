import React, { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Minus, Radio } from "lucide-react";
import { useMetalPricesQuery } from "@/hooks/useQueries";

const MetalTicker: React.FC = () => {
  const { data: prices, isLoading } = useMetalPricesQuery();
  const [prevGold, setPrevGold] = useState<number | null>(null);
  const [prevSilver, setPrevSilver] = useState<number | null>(null);
  const [goldTrend, setGoldTrend] = useState<"up" | "down" | "neutral">(
    "neutral"
  );
  const [silverTrend, setSilverTrend] = useState<"up" | "down" | "neutral">(
    "neutral"
  );
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (prices) {
      if (prevGold !== null) {
        if (prices.gold999Per10g > prevGold) setGoldTrend("up");
        else if (prices.gold999Per10g < prevGold) setGoldTrend("down");
        else setGoldTrend("neutral");
      }
      if (prevSilver !== null) {
        if (prices.silver999PerKg > prevSilver) setSilverTrend("up");
        else if (prices.silver999PerKg < prevSilver) setSilverTrend("down");
        else setSilverTrend("neutral");
      }
      setPrevGold(prices.gold999Per10g);
      setPrevSilver(prices.silver999PerKg);
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
          label: "SILVER 999",
          unit: "/kg",
          price: prices.silver999PerKg,
          trend: silverTrend,
        },
        {
          label: "GOLD + GST",
          unit: "/10g",
          price: prices.goldWithGst,
          trend: goldTrend,
        },
        {
          label: "SILVER + GST",
          unit: "/kg",
          price: prices.silverWithGst,
          trend: silverTrend,
        },
      ]
    : [];

  return (
    <div className="bg-neutral-900 border-b border-gold-500/30 overflow-hidden relative">
      {/* Live indicator bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-neutral-950 border-b border-gold-500/20">
        <div className="flex items-center gap-2">
          <Radio className="w-3 h-3 text-red-500 animate-pulse" />
          <span className="text-xs font-bold text-red-400 tracking-widest uppercase">
            Live
          </span>
          <span className="text-xs text-gold-400/70">IBJA Rates</span>
        </div>
        <div className="flex items-center gap-2">
          {prices?.marketClosed ? (
            <span className="inline-flex items-center gap-1 text-xs text-neutral-400 font-medium bg-neutral-800/60 border border-neutral-600/40 rounded-full px-2 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 inline-block" />
              Market Closed
            </span>
          ) : prices?.isMarketOpen ? (
            <span className="text-xs text-green-400 font-semibold">
              ● Market Open
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs text-neutral-400 font-medium bg-neutral-800/60 border border-neutral-600/40 rounded-full px-2 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 inline-block" />
              Market Closed
            </span>
          )}
          {prices?.lastUpdated && (
            <span
              className={`text-xs text-gold-400/60 transition-opacity duration-300 ${pulse ? "opacity-100" : "opacity-70"}`}
            >
              Updated: {prices.lastUpdated} IST
            </span>
          )}
        </div>
      </div>

      {/* Scrolling ticker */}
      <div className="flex items-center h-10 overflow-hidden">
        {isLoading && !prices && (
          <div className="flex items-center gap-2 px-4 text-gold-400 text-sm animate-pulse">
            <span>Fetching live IBJA rates...</span>
          </div>
        )}
        {tickerItems.length > 0 && (
          <div className="ticker-scroll flex items-center gap-0 whitespace-nowrap">
            {[...tickerItems, ...tickerItems, ...tickerItems].map(
              (item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-2 px-6 text-sm font-medium"
                >
                  <span className="text-gold-400 font-bold tracking-wide">
                    {item.label}
                  </span>
                  <span
                    className={`font-mono font-bold transition-all duration-500 ${
                      pulse ? "text-white scale-105" : "text-gold-200"
                    }`}
                  >
                    {formatPrice(item.price)}
                  </span>
                  <span className="text-gold-500/60 text-xs">{item.unit}</span>
                  <TrendIcon trend={item.trend} />
                  <span className="text-gold-600/40 mx-2">◆</span>
                </span>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MetalTicker;
