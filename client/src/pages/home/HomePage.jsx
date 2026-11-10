import BannerCarousel from "../../components/banners/BannerCarousel.jsx";
import ProductSections from "./container/ProductSections.jsx";
  
const HomePage = () => {
  return (
    <>
      <BannerCarousel
        interval={3000}
        showControls={false}
        showIndicators
      />
      
      {/* Product discovery sections */}
      <ProductSections />
    </>
  );
};

export default HomePage;