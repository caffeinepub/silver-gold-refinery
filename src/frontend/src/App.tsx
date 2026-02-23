import MetalTicker from './components/MetalTicker';
import HeroSection from './components/HeroSection';
import LiveRatesDashboard from './components/LiveRatesDashboard';
import ProductsSection from './components/ProductsSection';
import ContactSection from './components/ContactSection';
import SocialMediaAssets from './components/SocialMediaAssets';
import Footer from './components/Footer';
import FloatingCallButton from './components/FloatingCallButton';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
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
