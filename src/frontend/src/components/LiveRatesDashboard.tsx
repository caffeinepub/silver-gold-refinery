import { useMetalPrices } from '../hooks/useMetalPrices';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface BaseMetalCard {
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
  showGST: boolean;
  priceWithoutGST?: number;
  priceWithGST?: number;
  unit: string;
}

export default function LiveRatesDashboard() {
  const { data: prices, isLoading, isError } = useMetalPrices();

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </section>
    );
  }

  if (isError || !prices) {
    return (
      <section className="py-16 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-destructive font-semibold">Unable to load live rates. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  // Format numbers in Indian numbering system
  const formatIndianNumber = (num: number): string => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
    }).format(num);
  };

  const metalCards: BaseMetalCard[] = [
    {
      name: 'Gold',
      symbol: 'XAU',
      price: prices.gold.price,
      change: prices.gold.change,
      changePercent: prices.gold.changePercent,
      high: prices.gold.high,
      low: prices.gold.low,
      gradient: 'from-amber-50 to-yellow-100 dark:from-amber-950/30 dark:to-yellow-900/30',
      borderColor: 'border-gold/30',
      iconColor: 'text-gold',
      showGST: true,
      priceWithoutGST: prices.gold.price,
      priceWithGST: prices.gold.price * 1.03,
      unit: '10g',
    },
    {
      name: 'Silver',
      symbol: 'XAG',
      price: prices.silver.price,
      change: prices.silver.change,
      changePercent: prices.silver.changePercent,
      high: prices.silver.high,
      low: prices.silver.low,
      gradient: 'from-slate-50 to-gray-100 dark:from-slate-950/30 dark:to-gray-900/30',
      borderColor: 'border-silver/30',
      iconColor: 'text-silver',
      showGST: true,
      priceWithoutGST: prices.silver.price,
      priceWithGST: prices.silver.price * 1.03,
      unit: 'kg',
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Live Market Rates</h2>
          <p className="text-lg text-muted-foreground font-medium">
            Real-time precious metal prices in Indian Rupees
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {metalCards.map((metal) => (
            <Card
              key={metal.symbol}
              className={`border-2 ${metal.borderColor} bg-gradient-to-br ${metal.gradient} shadow-lg hover:shadow-xl transition-shadow`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-foreground">{metal.name}</CardTitle>
                  <div
                    className={`flex items-center gap-1 px-3 py-1 rounded-full font-bold text-sm ${
                      metal.changePercent >= 0
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                    }`}
                  >
                    {metal.changePercent >= 0 ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    {metal.changePercent >= 0 ? '+' : ''}
                    {metal.changePercent.toFixed(2)}%
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Current Price */}
                <div>
                  <p className="text-sm font-bold text-muted-foreground mb-1 uppercase tracking-wide">Current Price</p>
                  <p className="text-4xl font-bold text-foreground">
                    ₹{formatIndianNumber(metal.price)}
                    <span className="text-lg font-semibold text-muted-foreground ml-2">/{metal.unit}</span>
                  </p>
                </div>

                {/* GST Breakdown */}
                {metal.showGST && metal.priceWithoutGST && metal.priceWithGST && (
                  <div className="bg-white/60 dark:bg-black/20 p-4 rounded-lg border border-border/50">
                    <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide">
                      GST Pricing (3% Total: 1.5% CGST + 1.5% SGST)
                    </p>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-foreground">Without GST:</span>
                        <span className="text-sm font-bold text-foreground">₹{formatIndianNumber(metal.priceWithoutGST)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-foreground">With GST:</span>
                        <span className="text-sm font-bold text-foreground">₹{formatIndianNumber(metal.priceWithGST)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* High/Low */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wide">Day High</p>
                    <p className="text-lg font-bold text-green-700 dark:text-green-400">
                      ₹{formatIndianNumber(metal.high)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wide">Day Low</p>
                    <p className="text-lg font-bold text-red-700 dark:text-red-400">
                      ₹{formatIndianNumber(metal.low)}
                    </p>
                  </div>
                </div>

                {/* Change */}
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-wide">24h Change</span>
                  <div className="flex items-center gap-2">
                    {metal.changePercent >= 0 ? (
                      <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                    )}
                    <span
                      className={`text-lg font-bold ${
                        metal.changePercent >= 0
                          ? 'text-green-700 dark:text-green-400'
                          : 'text-red-700 dark:text-red-400'
                      }`}
                    >
                      {metal.changePercent >= 0 ? '+' : ''}₹{formatIndianNumber(Math.abs(metal.change))}
                    </span>
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
