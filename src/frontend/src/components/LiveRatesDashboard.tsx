import { useMetalPricesQuery } from "@/hooks/useQueries";
import { Moon, Radio, RefreshCw, TrendingUp } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

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

const LiveRatesDashboard: React.FC = () => {
  const {
    data: prices,
    isLoading,
    refetch,
    isFetching,
  } = useMetalPricesQuery();

  const relativeTime = useRelativeTime(prices?.lastFetchedAt);
  const [alertBlink, setAlertBlink] = useState(false);

  useEffect(() => {
    if (prices?.highPriceDifference) {
      const interval = setInterval(() => setAlertBlink((b) => !b), 600);
      return () => clearInterval(interval);
    }
    setAlertBlink(false);
  }, [prices?.highPriceDifference]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  if (isLoading && !prices) {
    return (
      <section className="py-12 bg-neutral-950">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-yellow-400 mb-2">
              Live Metal Rates
            </h2>
            <p className="text-yellow-200 text-sm font-medium">
              Fetching live IBJA rates...
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-neutral-900 rounded-2xl p-6 border border-yellow-600/20 animate-pulse"
              >
                <div className="h-6 bg-neutral-800 rounded mb-4 w-1/2" />
                <div className="h-10 bg-neutral-800 rounded mb-3 w-3/4" />
                <div className="h-4 bg-neutral-800 rounded w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-neutral-950">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-3">
          <div>
            <h2 className="text-3xl font-bold text-yellow-400">
              Live Metal Rates
            </h2>
            <p className="text-yellow-200 text-sm mt-1 font-medium">
              Source: IBJA (India Bullion &amp; Jewellers Association)
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 bg-red-900/40 border border-red-500/60 rounded-full px-3 py-1">
              <Radio className="w-3 h-3 text-red-400 animate-pulse" />
              <span className="text-xs font-bold text-red-300 tracking-widest">
                LIVE
              </span>
            </div>

            {prices &&
              (prices.marketClosed || !prices.isMarketOpen ? (
                <div className="flex items-center gap-1.5 bg-neutral-800 border border-neutral-600 rounded-full px-3 py-1">
                  <Moon className="w-3 h-3 text-neutral-300" />
                  <span className="text-xs font-semibold text-neutral-300">
                    Market Closed
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 bg-green-900/40 border border-green-500/60 rounded-full px-3 py-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-semibold text-green-300">
                    Market Open
                  </span>
                </div>
              ))}

            <button
              type="button"
              data-ocid="rates.refresh.button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="flex items-center gap-1.5 px-3 py-1 bg-yellow-500/15 border border-yellow-500/50 rounded-full text-yellow-300 text-xs hover:bg-yellow-500/25 transition-colors disabled:opacity-50 font-medium"
            >
              <RefreshCw
                className={`w-3 h-3 ${isFetching ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>

        {prices?.lastUpdated && (
          <div className="mb-6 flex items-center gap-2 text-xs text-yellow-200 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
            <span>
              Updated {relativeTime} · {prices.lastUpdated} IST
            </span>
            <span className="text-yellow-300/60">·</span>
            <span className="text-yellow-300/80">Auto-refreshes every 10s</span>
          </div>
        )}

        {prices?.marketClosed && (
          <div className="mb-6 flex items-center gap-2 bg-neutral-800 border border-neutral-600 rounded-xl px-4 py-3">
            <Moon className="w-4 h-4 text-neutral-300 shrink-0" />
            <p className="text-xs text-neutral-300 font-medium">
              Prices shown are the last recorded IBJA rates. The market has been
              inactive for over an hour.
            </p>
          </div>
        )}

        {/* High Price Difference Alert */}
        {prices?.highPriceDifference && (
          <div
            data-ocid="rates.high_diff.error_state"
            className={`mb-6 flex items-center gap-3 rounded-xl px-4 py-3 border transition-all duration-300 ${
              alertBlink
                ? "bg-orange-500/25 border-orange-400 shadow-lg shadow-orange-500/30"
                : "bg-orange-500/10 border-orange-500/50"
            }`}
          >
            <span
              className={`text-2xl transition-opacity duration-300 ${alertBlink ? "opacity-100" : "opacity-50"}`}
            >
              ⚠️
            </span>
            <p className="text-sm font-bold text-orange-300">
              High price difference may be due to Significant Fluctuations 📈📉
              in the market
            </p>
          </div>
        )}

        {/* Rate Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Gold Card */}
          {prices && (
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 border border-yellow-600/40 shadow-lg shadow-yellow-500/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🥇</span>
                  <div>
                    <h3 className="text-lg font-bold text-yellow-400">
                      Gold 999
                    </h3>
                    <p className="text-xs text-yellow-200 font-medium">
                      Per 10 grams
                    </p>
                  </div>
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>

              <div className="mb-4">
                <div className="text-3xl font-bold text-white font-mono">
                  {formatPrice(prices.gold999Per10g)}
                </div>
                <div className="text-xs text-yellow-200 font-medium mt-1">
                  Base price (excl. GST)
                </div>
              </div>

              <div className="bg-neutral-950/70 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-yellow-300 font-medium">
                    Base Price
                  </span>
                  <span className="text-white font-mono font-semibold">
                    {formatPrice(prices.gold999Per10g)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-yellow-300 font-medium">
                    CGST (1.5%)
                  </span>
                  <span className="text-yellow-200 font-mono font-semibold">
                    +{formatPrice(prices.goldCgst)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-yellow-300 font-medium">
                    SGST (1.5%)
                  </span>
                  <span className="text-yellow-200 font-mono font-semibold">
                    +{formatPrice(prices.goldSgst)}
                  </span>
                </div>
                <div className="border-t border-yellow-600/30 pt-2 flex justify-between text-sm font-bold">
                  <span className="text-yellow-400">Total (incl. GST)</span>
                  <span className="text-yellow-300 font-mono">
                    {formatPrice(prices.goldWithGst)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Silver Card */}
          {prices && (
            <div
              className={`bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 border shadow-lg transition-all duration-300 ${
                prices.highPriceDifference
                  ? "border-orange-500/60 shadow-orange-500/10"
                  : "border-slate-400/40 shadow-slate-400/5"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🥈</span>
                  <div>
                    <h3 className="text-lg font-bold text-slate-200">
                      Silver 999
                    </h3>
                    <p className="text-xs text-slate-300 font-medium">
                      Per kilogram
                    </p>
                  </div>
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>

              {/* Buy / Sell prices */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-3 text-center">
                  <div className="text-xs text-green-400 font-bold uppercase tracking-wider mb-1">
                    Buy
                  </div>
                  <div className="text-xl font-bold text-white font-mono">
                    {formatPrice(prices.silverBuyPerKg)}
                  </div>
                </div>
                <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-3 text-center">
                  <div className="text-xs text-red-400 font-bold uppercase tracking-wider mb-1">
                    Sell
                  </div>
                  <div className="text-xl font-bold text-white font-mono">
                    {formatPrice(prices.silverSellPerKg)}
                  </div>
                </div>
              </div>

              <div className="bg-neutral-950/70 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300 font-medium">Buy (Base)</span>
                  <span className="text-white font-mono font-semibold">
                    {formatPrice(prices.silverBuyPerKg)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300 font-medium">
                    Sell (Base)
                  </span>
                  <span className="text-white font-mono font-semibold">
                    {formatPrice(prices.silverSellPerKg)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300 font-medium">
                    CGST (1.5%)
                  </span>
                  <span className="text-slate-200 font-mono font-semibold">
                    +{formatPrice(prices.silverCgst)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300 font-medium">
                    SGST (1.5%)
                  </span>
                  <span className="text-slate-200 font-mono font-semibold">
                    +{formatPrice(prices.silverSgst)}
                  </span>
                </div>
                <div className="border-t border-slate-500/40 pt-2 space-y-1">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-green-400">Buy + GST</span>
                    <span className="text-green-300 font-mono">
                      {formatPrice(prices.silverBuyWithGst)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-red-400">Sell + GST</span>
                    <span className="text-red-300 font-mono">
                      {formatPrice(prices.silverSellWithGst)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-neutral-400 font-medium">
          Rates are indicative. Actual transaction prices may vary. GST @ 3%
          included in total.
        </p>
      </div>
    </section>
  );
};

export default LiveRatesDashboard;
