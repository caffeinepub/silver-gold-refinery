import BrandTicker from "./components/BrandTicker";
import ContactSection from "./components/ContactSection";
import FloatingCallButton from "./components/FloatingCallButton";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import LiveRatesDashboard from "./components/LiveRatesDashboard";
import MetalTicker from "./components/MetalTicker";
import ProductsSection from "./components/ProductsSection";
import SocialMediaAssets from "./components/SocialMediaAssets";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <BrandTicker />
      <MetalTicker />
      <FloatingCallButton />
      <HeroSection />
      <LiveRatesDashboard />
      <ProductsSection />
      <ContactSection />
      <SocialMediaAssets />
      <Footer />
    </div>
  );
}

export default App;
