import { useMetalPrices, getMarketStatus } from '../hooks/useQueries';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import type { MarketStatus } from '../hooks/useQueries';

export default function MetalTicker() {
  const { data: prices } = useMetalPrices();
  const [marketStatus, setMarketStatus] = useState<MarketStatus>('open');

  // Update market status periodically
  useEffect(() => {
    const updateStatus = () => {
      setMarketStatus(getMarketStatus());
    };

    updateStatus();
    const interval = setInterval(updateStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatIndianNumber = useMemo(() => {
    return (num: number): string => {
      return new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 2,
      }).format(num);
    };
  }, []);

  const formatLastUpdate = (timestamp: number | undefined): string => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getMarketStatusBadge = () => {
    if (marketStatus === 'closed_weekend') {
      return (
        <span className="px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-full">
          CLOSED - WEEKEND
        </span>
      );
    }
    if (marketStatus === 'closed_inactivity') {
      return (
        <span className="px-3 py-1 bg-orange-600 text-white text-xs font-semibold rounded-full">
          CLOSED
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full animate-pulse">
        LIVE
      </span>
    );
  };

  if (!prices) {
    return (
      <div className="bg-gradient-to-r from-gold/10 via-silver/10 to-gold/10 border-b border-gold/20 py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span>Loading live rates...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-gold/10 via-silver/10 to-gold/10 border-b border-gold/20 py-2 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4 text-sm">
          {/* Market Status Badge */}
          <div className="flex-shrink-0">
            {getMarketStatusBadge()}
          </div>

          {/* Scrolling Ticker Content */}
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center gap-8 animate-scroll-ticker whitespace-nowrap">
              {/* Gold Price */}
              <div className="flex items-center gap-2">
                <span className="font-bold text-gold">GOLD 999</span>
                <span className="text-foreground font-semibold">
                  ₹{formatIndianNumber(prices.gold.price)}/10g
                </span>
                {prices.gold.change !== 0 && (
                  <span className={`flex items-center gap-1 ${prices.gold.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {prices.gold.change >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span className="text-xs font-medium">
                      {prices.gold.change >= 0 ? '+' : ''}{formatIndianNumber(Math.abs(prices.gold.change))}
                    </span>
                  </span>
                )}
              </div>

              {/* Separator */}
              <span className="text-muted-foreground">|</span>

              {/* Silver Price */}
              <div className="flex items-center gap-2">
                <span className="font-bold text-silver">SILVER 999</span>
                <span className="text-foreground font-semibold">
                  ₹{formatIndianNumber(prices.silver.price)}/kg
                </span>
                {prices.silver.change !== 0 && (
                  <span className={`flex items-center gap-1 ${prices.silver.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {prices.silver.change >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span className="text-xs font-medium">
                      {prices.silver.change >= 0 ? '+' : ''}{formatIndianNumber(Math.abs(prices.silver.change))}
                    </span>
                  </span>
                )}
              </div>

              {/* Separator */}
              <span className="text-muted-foreground">|</span>

              {/* Last Update */}
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-xs">Updated: {formatLastUpdate(prices.lastUpdate)}</span>
              </div>

              {/* Duplicate content for seamless loop */}
              <span className="text-muted-foreground">|</span>
              
              <div className="flex items-center gap-2">
                <span className="font-bold text-gold">GOLD 999</span>
                <span className="text-foreground font-semibold">
                  ₹{formatIndianNumber(prices.gold.price)}/10g
                </span>
                {prices.gold.change !== 0 && (
                  <span className={`flex items-center gap-1 ${prices.gold.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {prices.gold.change >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span className="text-xs font-medium">
                      {prices.gold.change >= 0 ? '+' : ''}{formatIndianNumber(Math.abs(prices.gold.change))}
                    </span>
                  </span>
                )}
              </div>

              <span className="text-muted-foreground">|</span>

              <div className="flex items-center gap-2">
                <span className="font-bold text-silver">SILVER 999</span>
                <span className="text-foreground font-semibold">
                  ₹{formatIndianNumber(prices.silver.price)}/kg
                </span>
                {prices.silver.change !== 0 && (
                  <span className={`flex items-center gap-1 ${prices.silver.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {prices.silver.change >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span className="text-xs font-medium">
                      {prices.silver.change >= 0 ? '+' : ''}{formatIndianNumber(Math.abs(prices.silver.change))}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
