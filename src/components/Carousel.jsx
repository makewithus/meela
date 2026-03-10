import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import { carouselData } from "../data/carouselData";
import { useCart } from "../context/CartContext";

const Carousel = () => {
  const { openBuyModal } = useCart();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? carouselData.length - 1 : prevIndex - 1
    );
    setCurrentImageIndex(0); // Reset image index when changing slides
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === carouselData.length - 1 ? 0 : prevIndex + 1
    );
    setCurrentImageIndex(0); // Reset image index when changing slides
  }, []);

  // Reset image index when slide changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [currentIndex]);

  // Combined auto-play functionality - slides change every 5 seconds, images cycle every 3 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;

    const slideInterval = setInterval(() => {
      handleNext();
    },4000); // Change slide every 5 seconds

    const imageInterval = setInterval(() => {
      const currentSlide = carouselData[currentIndex];
      const imageCount = currentSlide?.images?.length || 0;
      if (imageCount > 1) {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === imageCount - 1 ? 0 : prevIndex + 1
        );
      }
    }, 4000); // Change image every 2 seconds

    return () => {
      clearInterval(slideInterval);
      clearInterval(imageInterval);
    };
  }, [isAutoPlaying, handleNext, currentIndex]);

  // Swipe handlers for mobile
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleNext(),
    onSwipedRight: () => handlePrevious(),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const currentSlide = carouselData[currentIndex];

  // Corner Border SVG Component
  const CornerBorder = ({ position }) => {
    const transforms = {
      "top-left": "",
      "top-right": "scale-x-[-1]",
      "bottom-left": "scale-y-[-1]",
      "bottom-right": "scale-[-1]",
    };

    const positionClasses = {
      "top-left": "top-0 left-0",
      "top-right": "top-0 right-0",
      "bottom-left": "bottom-0 left-0",
      "bottom-right": "bottom-0 right-0",
    };

    return (
      <div className={`absolute ${positionClasses[position]} w-32 sm:w-40 md:w-48 lg:w-56 xl:w-64 h-32 sm:h-40 md:h-48 lg:h-56 xl:h-64 z-10 opacity-90 ${transforms[position]}`}>
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <path d="M 0,80 L 0,0 L 80,0" fill="none" stroke="#b8956a" strokeWidth="2.8" opacity="0.8"/>
          <path d="M 10,70 L 10,10 L 70,10" fill="none" stroke="#c9a978" strokeWidth="2" opacity="0.7"/>
          {[...Array(7)].map((_, i) => (
            <circle key={`v-${i}`} cx="0" cy={(i + 1) * 10} r="1.8" fill="#b8956a" opacity="0.75"/>
          ))}
          {[...Array(7)].map((_, i) => (
            <circle key={`h-${i}`} cx={(i + 1) * 10} cy="0" r="1.8" fill="#b8956a" opacity="0.75"/>
          ))}
          {[...Array(4)].map((_, i) => (
            <path
              key={`top-${i}`}
              d={`M ${18 + i * 12},12 Q ${18 + i * 12},18 ${22 + i * 12},20 Q ${26 + i * 12},18 ${26 + i * 12},12`}
              fill="#b8956a"
              fillOpacity="0.25"
              stroke="#b8956a"
              strokeWidth="1.3"
              opacity="0.7"
            />
          ))}
          {[...Array(4)].map((_, i) => (
            <path
              key={`left-${i}`}
              d={`M 12,${18 + i * 12} Q 18,${18 + i * 12} 20,${22 + i * 12} Q 18,${26 + i * 12} 12,${26 + i * 12}`}
              fill="#b8956a"
              fillOpacity="0.25"
              stroke="#b8956a"
              strokeWidth="1.3"
              opacity="0.7"
            />
          ))}
        </svg>
      </div>
    );
  };

  // Border Component
  const Border = ({ side }) => {
    const isVertical = side === "left" || side === "right";
    const viewBox = isVertical ? "0 0 20 1000" : "0 0 1000 20";
    const className = isVertical 
      ? `absolute ${side}-0 top-0 bottom-0 w-4 sm:w-5 z-10 opacity-80`
      : `absolute ${side}-0 left-0 right-0 h-4 sm:h-5 z-10 opacity-80`;

    const getLineCoords = () => {
      if (side === "top") return { outer: { x1: 0, y1: 4, x2: 1000, y2: 4 }, inner: { x1: 0, y1: 12, x2: 1000, y2: 12 }, cy: 4 };
      if (side === "bottom") return { outer: { x1: 0, y1: 16, x2: 1000, y2: 16 }, inner: { x1: 0, y1: 8, x2: 1000, y2: 8 }, cy: 16 };
      if (side === "left") return { outer: { x1: 4, y1: 0, x2: 4, y2: 1000 }, inner: { x1: 12, y1: 0, x2: 12, y2: 1000 }, cx: 4 };
      if (side === "right") return { outer: { x1: 16, y1: 0, x2: 16, y2: 1000 }, inner: { x1: 8, y1: 0, x2: 8, y2: 1000 }, cx: 16 };
    };

    const coords = getLineCoords();

    return (
      <div className={className}>
        <svg viewBox={viewBox} className="w-full h-full" preserveAspectRatio="none">
          <line {...coords.outer} stroke="#b8956a" strokeWidth="2.5" opacity="0.8"/>
          <line {...coords.inner} stroke="#c9a978" strokeWidth="1.8" opacity="0.7"/>
          {[...Array(30)].map((_, i) => {
            if (isVertical) {
              return <circle key={i} cx={coords.cx} cy={i * 33.33 + 16.67} r="1.6" fill="#b8956a" opacity="0.75"/>;
            }
            return <circle key={i} cx={i * 33.33 + 16.67} cy={coords.cy} r="1.6" fill="#b8956a" opacity="0.75"/>;
          })}
        </svg>
      </div>
    );
  };

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('https://res.cloudinary.com/dvaxoo30e/image/upload/v1764607946/product_bg_y26lan.png')" }}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Ornamental Corner Borders */}
      <CornerBorder position="top-left" />
      <CornerBorder position="top-right" />
      <CornerBorder position="bottom-left" />
      <CornerBorder position="bottom-right" />

      {/* Double Line Borders */}
      <Border side="top" />
      <Border side="bottom" />
      <Border side="left" />
      <Border side="right" />
      <div {...swipeHandlers} className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* Left Side - Text Content */}
          <div className="flex flex-col justify-center space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8 order-2 lg:order-1 px-3 sm:px-0">
            {/* Carousel Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${currentIndex}`}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ 
                  duration: 0.6,
                  ease: [0.4, 0, 0.2, 1]
                }}
                className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6"
              >
                {/* Title */}
                <h2
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-[#6f4a3c]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {currentSlide.title}
                </h2>

                {/* Description */}
                <p
                  className="text-xs sm:text-sm md:text-base lg:text-lg text-[#6f4a3c]/80 leading-relaxed max-w-2xl"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {currentSlide.description}
                </p>

                {/* Features List - Different for each slide */}
                {currentSlide.features && currentSlide.features.length > 0 && (
                  <div className="space-y-2 sm:space-y-2.5 md:space-y-3 pt-2 sm:pt-3">
                    <ul className="space-y-1.5 sm:space-y-2">
                      <AnimatePresence mode="wait">
                        {currentSlide.features.map((feature, index) => (
                          <motion.li
                            key={`${currentIndex}-${index}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ 
                              delay: 0.1 * (index + 1),
                              duration: 0.3
                            }}
                            className="flex items-start gap-2 sm:gap-2.5"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                          >
                            <span className="text-[#6f4a3c] mt-1 sm:mt-1.5 flex-shrink-0">•</span>
                            <span className="text-[10px] sm:text-xs md:text-sm lg:text-base text-[#6f4a3c]/80 leading-relaxed">
                              {feature}
                            </span>
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Side - Image Carousel */}
          <div className="flex items-center justify-center order-1 lg:order-2 mb-4 sm:mb-6 lg:mb-0 relative">
            <div className="relative w-full max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[350px] xl:max-w-[400px] aspect-square">
              {/* Cool Background Border Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#6f4a3c]/30 via-[#8b5e4d]/20 to-[#6f4a3c]/30 p-1 sm:p-1.5 md:p-2 blur-sm">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#6f4a3c]/40 via-transparent to-[#8b5e4d]/30"></div>
              </div>
              
              {/* Image Carousel Container */}
              <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border-4 border-[#6f4a3c]/30 shadow-2xl bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-sm aspect-square">
                {/* Inner glow effect */}
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#6f4a3c]/10 via-transparent to-[#8b5e4d]/10 pointer-events-none"></div>
                
                <AnimatePresence mode="wait">
                  {currentSlide?.images && currentSlide.images.length > 0 && (
                    <motion.img
                      key={`${currentIndex}-${currentImageIndex}`}
                      src={currentSlide.images[currentImageIndex]}
                      alt={`${currentSlide.title} - Image ${currentImageIndex + 1}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ 
                        duration: 0.6,
                        ease: [0.4, 0, 0.2, 1]
                      }}
                      className="w-full h-full object-cover relative z-10"
                      style={{
                        filter: "sepia(20%) saturate(100%) hue-rotate(0deg) brightness(1.05) contrast(0.8)",
                      }}
                      whileHover={{ 
                        scale: 1.02,
                        filter: "sepia(21%) saturate(105%) hue-rotate(2deg) brightness(1.05) contrast(1)",
                        transition: { duration: 0.3 }
                      }}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Button and Navigation Controls - Centered below content */}
        <div className="flex flex-col mt-4 sm:mt-16 items-center justify-center gap-4 sm:gap-6 pt-6 sm:pt-8 lg:pt-10">
          {/* Button */}
          <div className="flex justify-center">
            <motion.button
              onClick={openBuyModal}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 sm:px-8 md:px-10 lg:px-12 py-2.5 sm:py-3 md:py-3.5 lg:py-4 bg-gradient-to-r from-[#6f4a3c] to-[#8b5e4d] text-white text-xs sm:text-sm md:text-base lg:text-lg font-semibold hover:shadow-xl transition-all duration-300 shadow-lg cursor-pointer"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {currentSlide.buttonText}
            </motion.button>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-2 sm:gap-3">
          {/* Arrow Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Previous Button */}
            <motion.button
              onClick={handlePrevious}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white text-[#6f4a3c] rounded-full hover:bg-[#6f4a3c] hover:text-white transition-all duration-300 shadow-md hover:shadow-xl border-2 border-[#6f4a3c]"
              aria-label="Previous slide"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </motion.button>

            {/* Indicators */}
            <div className="flex gap-1.5 sm:gap-2">
              {carouselData.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  whileHover={{ scale: 1.2 }}
                  className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-[#6f4a3c] w-6 sm:w-8"
                      : "bg-[#6f4a3c]/30 hover:bg-[#6f4a3c]/50 w-1.5 sm:w-2"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Next Button */}
            <motion.button
              onClick={handleNext}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white text-[#6f4a3c] rounded-full hover:bg-[#6f4a3c] hover:text-white transition-all duration-300 shadow-md hover:shadow-xl border-2 border-[#6f4a3c]"
              aria-label="Next slide"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </motion.button>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};

export default Carousel;

