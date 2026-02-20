import { Sparkles } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image - Updated to furnace hero */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/assets/generated/furnace-hero.dim_1920x1080.png)' }}
      >
        {/* Enhanced gradient overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/75 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="flex items-center justify-center mb-6">
          <Sparkles className="w-12 h-12 text-gold drop-shadow-lg" />
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
          Premium Precious Metals
        </h1>
        <p className="text-xl md:text-2xl text-white font-semibold mb-4 max-w-3xl mx-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
          Certified High-Purity Silver & Gold Refinery
        </p>
        <p className="text-lg text-white/95 max-w-2xl mx-auto drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          Trusted source for refined precious metals with guaranteed purity standards
        </p>
      </div>
    </section>
  );
}
