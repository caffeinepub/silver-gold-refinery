import React from "react";
import { TrendingUp, RefreshCw, Radio, Moon } from "lucide-react";
import { useMetalPricesQuery } from "@/hooks/useQueries";

const LiveRatesDashboard: React.FC = () => {
  const {
    data: prices,
    isLoading,
    refetch,
    isFetching,
  } = useMetalPricesQuery();

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
            <h2 className="text-3xl font-bold text-gold-400 mb-2">
              Live Metal Rates
            </h2>
            <p className="text-gold-400/60 text-sm">
              Fetching live IBJA rates...
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-neutral-900 rounded-2xl p-6 border border-gold-500/20 animate-pulse"
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
            <h2 className="text-3xl font-bold text-gold-400">
              Live Metal Rates
            </h2>
            <p className="text-gold-400/60 text-sm mt-1">
              Source: IBJA (India Bullion &amp; Jewellers Association)
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Live badge */}
            <div className="flex items-center gap-1.5 bg-red-900/30 border border-red-500/40 rounded-full px-3 py-1">
              <Radio className="w-3 h-3 text-red-400 animate-pulse" />
              <span className="text-xs font-bold text-red-400 tracking-widest">
                LIVE
              </span>
            </div>

            {/* Market status */}
            {prices && (
              <>
                {prices.marketClosed ? (
                  <div className="flex items-center gap-1.5 bg-neutral-800/60 border border-neutral-600/40 rounded-full px-3 py-1">
                    <Moon className="w-3 h-3 text-neutral-400" />
                    <span className="text-xs font-semibold text-neutral-400">
                      Market Closed
                    </span>
                  </div>
                ) : prices.isMarketOpen ? (
                  <div className="flex items-center gap-1.5 bg-green-900/30 border border-green-500/40 rounded-full px-3 py-1">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs font-semibold text-green-400">
                      Market Open
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 bg-neutral-800/60 border border-neutral-600/40 rounded-full px-3 py-1">
                    <Moon className="w-3 h-3 text-neutral-400" />
                    <span className="text-xs font-semibold text-neutral-400">
                      Market Closed
                    </span>
                  </div>
                )}
              </>
            )}

            {/* Refresh button */}
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="flex items-center gap-1.5 px-3 py-1 bg-gold-500/10 border border-gold-500/30 rounded-full text-gold-400 text-xs hover:bg-gold-500/20 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3 h-3 ${isFetching ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* Last updated */}
        {prices?.lastUpdated && (
          <div className="mb-6 flex items-center gap-2 text-xs text-gold-400/50">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
            Last updated: {prices.lastUpdated} IST · Auto-refreshes every 10
            seconds
          </div>
        )}

        {/* Market Closed notice — subtle, informational only */}
        {prices?.marketClosed && (
          <div className="mb-6 flex items-center gap-2 bg-neutral-900/60 border border-neutral-700/40 rounded-xl px-4 py-3">
            <Moon className="w-4 h-4 text-neutral-400 shrink-0" />
            <p className="text-xs text-neutral-400">
              Prices shown are the last recorded IBJA rates. The market has been
              inactive for over an hour.
            </p>
          </div>
        )}

        {/* Rate Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Gold Card */}
          {prices && (
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 border border-gold-500/30 shadow-lg shadow-gold-500/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🥇</span>
                  <div>
                    <h3 className="text-lg font-bold text-gold-400">
                      Gold 999
                    </h3>
                    <p className="text-xs text-gold-400/50">Per 10 grams</p>
                  </div>
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>

              <div className="mb-4">
                <div className="text-3xl font-bold text-white font-mono">
                  {formatPrice(prices.gold999Per10g)}
                </div>
                <div className="text-xs text-gold-400/50 mt-1">
                  Base price (excl. GST)
                </div>
              </div>

              <div className="bg-neutral-950/50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gold-400/70">Base Price</span>
                  <span className="text-white font-mono">
                    {formatPrice(prices.gold999Per10g)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gold-400/70">CGST (1.5%)</span>
                  <span className="text-yellow-300 font-mono">
                    +{formatPrice(prices.goldCgst)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gold-400/70">SGST (1.5%)</span>
                  <span className="text-yellow-300 font-mono">
                    +{formatPrice(prices.goldSgst)}
                  </span>
                </div>
                <div className="border-t border-gold-500/20 pt-2 flex justify-between text-sm font-bold">
                  <span className="text-gold-400">Total (incl. GST)</span>
                  <span className="text-gold-300 font-mono">
                    {formatPrice(prices.goldWithGst)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Silver Card */}
          {prices && (
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 border border-silver-400/30 shadow-lg shadow-silver-400/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🥈</span>
                  <div>
                    <h3 className="text-lg font-bold text-silver-300">
                      Silver 999
                    </h3>
                    <p className="text-xs text-silver-400/50">Per kilogram</p>
                  </div>
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>

              <div className="mb-4">
                <div className="text-3xl font-bold text-white font-mono">
                  {formatPrice(prices.silver999PerKg)}
                </div>
                <div className="text-xs text-silver-400/50 mt-1">
                  Base price (excl. GST)
                </div>
              </div>

              <div className="bg-neutral-950/50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-silver-400/70">Base Price</span>
                  <span className="text-white font-mono">
                    {formatPrice(prices.silver999PerKg)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-silver-400/70">CGST (1.5%)</span>
                  <span className="text-yellow-300 font-mono">
                    +{formatPrice(prices.silverCgst)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-silver-400/70">SGST (1.5%)</span>
                  <span className="text-yellow-300 font-mono">
                    +{formatPrice(prices.silverSgst)}
                  </span>
                </div>
                <div className="border-t border-silver-400/20 pt-2 flex justify-between text-sm font-bold">
                  <span className="text-silver-300">Total (incl. GST)</span>
                  <span className="text-silver-200 font-mono">
                    {formatPrice(prices.silverWithGst)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <p className="text-center text-xs text-gold-400/30">
          Rates are indicative. Actual transaction prices may vary. GST @ 3%
          included in total.
        </p>
      </div>
    </section>
  );
};

export default LiveRatesDashboard;
