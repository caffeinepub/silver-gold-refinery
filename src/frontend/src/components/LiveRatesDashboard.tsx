import { useMetalPrices, getMarketStatus } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo, useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import type { MarketStatus } from '../hooks/useQueries';

interface MetalCardData {
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  gradient: string;
  borderColor: string;
  iconColor: string;
  priceWithoutGST: number;
  priceWithGST: number;
  cgst: number;
  sgst: number;
  unit: string;
}

export default function LiveRatesDashboard() {
  const { data: prices, isLoading, isError } = useMetalPrices();
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

  // Format numbers in Indian numbering system
  const formatIndianNumber = useMemo(() => {
    return (num: number): string => {
      return new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 2,
      }).format(num);
    };
  }, []);

  // Format last update time
  const formatLastUpdate = (timestamp: number | undefined): string => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const metalCards: MetalCardData[] = useMemo(() => {
    if (!prices) return [];
    
    return [
      {
        name: 'Gold',
        symbol: 'GOLD 999',
        price: prices.gold.price,
        change: prices.gold.change,
        changePercent: prices.gold.changePercent,
        high: prices.gold.high,
        low: prices.gold.low,
        gradient: 'from-amber-50 to-yellow-100 dark:from-amber-950/30 dark:to-yellow-900/30',
        borderColor: 'border-gold/30',
        iconColor: 'text-gold',
        priceWithoutGST: prices.gold.price,
        priceWithGST: prices.gold.withGST || prices.gold.price * 1.03,
        cgst: prices.gold.cgst || prices.gold.price * 0.015,
        sgst: prices.gold.sgst || prices.gold.price * 0.015,
        unit: '/10g',
      },
      {
        name: 'Silver',
        symbol: 'SILVER 999',
        price: prices.silver.price,
        change: prices.silver.change,
        changePercent: prices.silver.changePercent,
        high: prices.silver.high,
        low: prices.silver.low,
        gradient: 'from-slate-50 to-gray-100 dark:from-slate-950/30 dark:to-gray-900/30',
        borderColor: 'border-silver/30',
        iconColor: 'text-silver',
        priceWithoutGST: prices.silver.price,
        priceWithGST: prices.silver.withGST || prices.silver.price * 1.03,
        cgst: prices.silver.cgst || prices.silver.price * 0.015,
        sgst: prices.silver.sgst || prices.silver.price * 0.015,
        unit: '/kg',
      },
    ];
  }, [prices]);

  const getMarketStatusMessage = () => {
    if (marketStatus === 'closed_weekend') {
      return 'Market Closed - Weekend';
    }
    if (marketStatus === 'closed_inactivity') {
      return 'Market Closed - No Activity';
    }
    return null;
  };

  const marketStatusMessage = getMarketStatusMessage();

  if (isLoading) {
    return (
      <section className="py-16 px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-96 w-full" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError || !prices) {
    return (
      <section className="py-16 px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-destructive text-lg">Unable to load live rates. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gold via-silver to-gold bg-clip-text text-transparent">
            Live Kolkata Rates
          </h2>
          <p className="text-muted-foreground text-lg">
            Real-time Gold (999) and Silver (999) prices in Indian Rupees
          </p>
          <div className="mt-4 flex flex-col items-center gap-2">
            {marketStatusMessage && (
              <Badge variant="destructive" className="text-sm px-4 py-2">
                {marketStatusMessage}
              </Badge>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Last updated: {formatLastUpdate(prices.lastUpdate)}</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {metalCards.map((metal) => (
            <Card
              key={metal.symbol}
              className={`overflow-hidden border-2 ${metal.borderColor} hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]`}
            >
              <CardHeader className={`bg-gradient-to-br ${metal.gradient} pb-4`}>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-foreground">
                      {metal.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground font-medium mt-1">
                      {metal.symbol}
                    </p>
                  </div>
                  <div className={`flex items-center gap-2 ${metal.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {metal.change >= 0 ? (
                      <TrendingUp className="h-8 w-8" />
                    ) : (
                      <TrendingDown className="h-8 w-8" />
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6 space-y-6">
                {/* Price without GST */}
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-semibold text-foreground">
                      Price (Without GST)
                    </span>
                    <span className="text-xs text-muted-foreground">{metal.unit}</span>
                  </div>
                  <div className="text-3xl font-bold text-foreground">
                    ₹{formatIndianNumber(metal.priceWithoutGST)}
                  </div>
                </div>

                {/* GST Breakdown */}
                <div className="space-y-3 pt-2 border-t bg-muted/30 -mx-6 px-6 py-4">
                  <div className="text-sm font-semibold text-foreground mb-2">
                    GST Breakdown (3%)
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground mb-1">CGST (1.5%)</div>
                      <div className="font-semibold text-foreground">
                        ₹{formatIndianNumber(metal.cgst)}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">SGST (1.5%)</div>
                      <div className="font-semibold text-foreground">
                        ₹{formatIndianNumber(metal.sgst)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price with GST */}
                <div className="space-y-2 pt-2 border-t">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-semibold text-foreground">
                      Price (With GST)
                    </span>
                    <span className="text-xs text-muted-foreground">{metal.unit}</span>
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    ₹{formatIndianNumber(metal.priceWithGST)}
                  </div>
                </div>

                {/* Change indicator */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2">
                    {metal.change >= 0 ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <TrendingUp className="h-5 w-5" />
                        <span className="font-semibold">
                          +₹{formatIndianNumber(Math.abs(metal.change))}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-red-600">
                        <TrendingDown className="h-5 w-5" />
                        <span className="font-semibold">
                          -₹{formatIndianNumber(Math.abs(metal.change))}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className={`text-sm font-semibold ${metal.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {metal.change >= 0 ? '+' : ''}{metal.changePercent.toFixed(2)}%
                  </div>
                </div>

                {/* High/Low */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t text-sm">
                  <div>
                    <div className="text-muted-foreground mb-1">High</div>
                    <div className="font-semibold text-green-600">
                      ₹{formatIndianNumber(metal.high)}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">Low</div>
                    <div className="font-semibold text-red-600">
                      ₹{formatIndianNumber(metal.low)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
