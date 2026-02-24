import ProductCard from './ProductCard';

export default function ProductsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Our Products</h2>
          <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto">
            Premium quality precious metals refined to the highest industry standards
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          <ProductCard
            title="Silver"
            image="/assets/generated/silver-bars.dim_800x600.png"
            purityLevels={['99.99%', '99.90%']}
            formats={['Bar (Silli Cut)', 'Granules (Bundiya)']}
            color="silver"
          />
          
          <ProductCard
            title="Gold"
            image="/assets/generated/gold-product.dim_800x600.png"
            purityLevels={['99.50%']}
            color="gold"
          />
        </div>

        {/* Refinery Process Images */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-16">
          <div className="relative rounded-lg overflow-hidden shadow-xl group">
            <img
              src="/assets/generated/refinery-machinery.dim_1200x800.png"
              alt="Advanced refinery machinery"
              className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent flex items-end p-6">
              <div>
                <h3 className="text-white text-xl font-bold mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">State-of-the-Art Equipment</h3>
                <p className="text-white text-sm font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Advanced refining technology for superior purity</p>
              </div>
            </div>
          </div>

          <div className="relative rounded-lg overflow-hidden shadow-xl group">
            <img
              src="/assets/generated/molten-silver.dim_1200x800.png"
              alt="Molten silver refining process"
              className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent flex items-end p-6">
              <div>
                <h3 className="text-white text-xl font-bold mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Precision Refining</h3>
                <p className="text-white text-sm font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Expert craftsmanship in every batch</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
