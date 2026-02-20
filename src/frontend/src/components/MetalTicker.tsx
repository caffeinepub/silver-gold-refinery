import { useMetalPrices } from '../hooks/useMetalPrices';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function MetalTicker() {
  const { data: prices, isLoading, isError } = useMetalPrices();

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white py-3 border-b-2 border-gold/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <span className="text-sm font-semibold animate-pulse">Loading live rates...</span>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !prices) {
    return (
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white py-3 border-b-2 border-gold/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <span className="text-sm font-semibold text-red-400">Unable to load live rates</span>
          </div>
        </div>
      </div>
    );
  }

  // Format numbers in Indian numbering system
  const formatIndianNumber = (num: number): string => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
    }).format(num);
  };

  const tickerItems = [
    { ...prices.gold, color: 'text-gold', unit: '10g' },
    { ...prices.silver, color: 'text-silver-light', unit: 'kg' },
    { ...prices.platinum, color: 'text-blue-300', unit: 'oz' },
  ];

  return (
    <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white py-3 border-b-2 border-gold/30 overflow-hidden sticky top-0 z-50 shadow-lg">
      <div className="relative">
        {/* Scrolling ticker animation - 3x faster (3.33s) */}
        <div className="flex animate-scroll-ticker">
          {/* Company name - always visible */}
          <div className="flex-shrink-0 px-8 flex items-center">
            <span className="text-lg font-bold text-gold tracking-wider drop-shadow-lg">
              GURURAJ SILVER REFINERY
            </span>
            <span className="mx-4 text-gold/50">|</span>
          </div>

          {/* Repeating ticker items for continuous scroll */}
          {[...Array(3)].map((_, repeatIndex) => (
            <div key={repeatIndex} className="flex items-center flex-shrink-0">
              {tickerItems.map((item, index) => (
                <div key={`${repeatIndex}-${index}`} className="flex items-center px-6 border-r border-zinc-700/50">
                  <span className={`font-bold ${item.color} mr-2 drop-shadow-md`}>
                    {item.symbol}
                  </span>
                  <span className="text-white font-mono font-semibold mr-2 drop-shadow-md">
                    {item.symbol === 'XPT' ? `$${item.price.toFixed(2)}` : `₹${formatIndianNumber(item.price)}/${item.unit}`}
                  </span>
                  <span
                    className={`flex items-center text-sm font-bold drop-shadow-md ${
                      item.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {item.changePercent >= 0 ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {item.changePercent >= 0 ? '+' : ''}
                    {item.changePercent.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
