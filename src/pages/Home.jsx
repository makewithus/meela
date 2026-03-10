import Hero from "../components/Hero";
import MarqueeStrip from "../components/MarqueeStrip";
import ProductHighlight from "../components/ProductHighlight";
import ReviewsCarousel from "../components/ReviewsCarousel";
import InstaGrid from "../components/InstaGrid";
import StatsSection from "../components/StatsSection";
import JourneySection from "../components/JourneySection";
import IngredientsSection from "../components/IngredientsSection"; 
import FaqSection from "../components/FaqSection";
import NewsletterSection from "../components/NewsletterSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import BuyNowModal from "../components/BuyNowModal";
import ScrollTopProgress from "../components/ScrollTopProgress";
import WhatsAppButton from "../components/WhatsAppButton";
import Map from "../components/Map";
import Carousel from "../components/Carousel";

const Home = () => (
  <div className="overflow-x-hidden">
    <Hero />
    <MarqueeStrip />
    <ProductHighlight />
    <ReviewsCarousel/>
    {/* <InstaGrid /> */}
    <StatsSection />
    <JourneySection />
    <Carousel/>
    <IngredientsSection /> 
    <FaqSection />
    <ContactSection />
    {/* <Map/> */}
    <NewsletterSection />
    <Footer />
    <BuyNowModal />
    <ScrollTopProgress />
    <WhatsAppButton />
  </div>
);

export default Home;
