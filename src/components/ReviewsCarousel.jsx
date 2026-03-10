import SectionWrapper from "./SectionWrapper";
import { reviews } from "../data/reviews";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ReviewsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoScrollRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    if (!isPaused && reviews.length > 1) {
      autoScrollRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % reviews.length);
      }, 5000);
    }
    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 4000);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 4000);
  };

  const handleDotClick = (i) => {
    setCurrentIndex(i);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 4000);
  };

  // Mobile Review Card Component
  const MobileReviewCard = ({ review, isFeatured = false }) => {
    // Use line-clamp instead of character truncation for better text fitting
    const lineClamp = isFeatured ? 'line-clamp-[15]' : 'line-clamp-[6]';

    return (
      <article className="bg-gradient-to-br from-white to-cream/30 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-md border border-coffee/10 flex flex-col h-full overflow-hidden">
        <div className="flex flex-col h-full p-2.5 sm:p-3">
          {/* Stars */}
          <div className="flex items-center mb-1">
            <span className="text-yellow-500 text-[10px] sm:text-xs">★★★★★</span>
          </div>

          {/* Title */}
          <h3 className={`font-serif text-coffee font-bold leading-tight mb-1 ${isFeatured ? 'text-[11px] sm:text-xs' : 'text-[9px] sm:text-[10px] line-clamp-2'}`}>
            {review.title}
          </h3>

          {/* Review Text */}
          <div className="flex-grow mb-2 overflow-hidden">
            <p className={`text-coffee/80 leading-tight ${isFeatured ? 'text-[9px] sm:text-[10px]' : 'text-[8px] sm:text-[9px]'} ${lineClamp}`}>
              {review.text}
            </p>
          </div>

          {/* Author Info */}
          <div className="mt-auto pt-2 border-t border-coffee/20">
            <p className={`font-bold text-coffee ${isFeatured ? 'text-[9px] sm:text-[10px]' : 'text-[8px] sm:text-[9px]'}`}>
              {review.name}
            </p>
            <p className={`text-coffee/60 mt-0.5 flex items-center gap-0.5 ${isFeatured ? 'text-[8px] sm:text-[9px]' : 'text-[7px] sm:text-[8px]'}`}>
              <svg className={`${isFeatured ? 'w-2 h-2' : 'w-1.5 h-1.5'}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {review.location}
            </p>
          </div>
        </div>
      </article>
    );
  };

  const ReviewCard = ({ review, isCompact = false }) => {
    // Truncate text for mobile - show first 150 characters
    const truncateText = (text, maxLength = 150) => {
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength).trim() + '...';
    };

    // Count words in text
    const truncateWords = (text, maxWords = 250) => {
      const words = text.split(' ');
      if (words.length <= maxWords) return text;
      return words.slice(0, maxWords).join(' ') + '...';
    };

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    
    // For compact cards (smaller desktop cards), show full text with line clamp
    if (isCompact) {
      const compactDisplayText = review.text;
      const compactShowReadMore = review.text.split(' ').length > 100; // Show read more if exceeds ~100 words
      
      return (
        <article
          className="bg-gradient-to-br from-white to-cream/30 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-coffee/10 flex flex-col h-full max-w-3xl mx-auto overflow-hidden"
        >
          <div className="flex flex-col h-full px-4 py-2">
            {/* Stars */}
            <div className="flex items-center mb-2">
              <span className="text-yellow-500 text-xs">★★★★★</span>
            </div>

            {/* Title */}
            <h3 className="font-serif text-coffee font-bold leading-tight mb-2 text-[10px]">
              {review.title}
            </h3>

            {/* Review Text */}
            <div className="flex-grow mb-3 overflow-hidden">
              <p className="text-coffee/80 leading-snug text-[9px] line-clamp-[8]">
                {compactDisplayText}
              </p>
              {compactShowReadMore && (
                <span className="text-coffee/60 italic mt-0.5 inline-block text-[8px]">Read more...</span>
              )}
            </div>

            {/* Author Info */}
            <div className="mt-auto pt-3 border-t border-coffee/20">
              <p className="font-bold text-coffee text-[9px]">
                {review.name}
              </p>
              <p className="text-coffee/60 mt-1 flex items-center gap-1 text-[8px]">
                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {review.location}
              </p>
            </div>
          </div>
        </article>
      );
    }
    
    // For mobile, use 150 characters
    if (isMobile) {
      const mobileDisplayText = truncateText(review.text, 150);
      const mobileShowReadMore = review.text.length > 150;
      
      return (
        <article
          className="bg-gradient-to-br from-white to-cream/30 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-coffee/10 flex flex-col h-full max-w-3xl mx-auto overflow-hidden"
        >
          <div className="flex flex-col h-full p-4 sm:p-6 lg:p-8">
            {/* Stars */}
            <div className="flex items-center mb-2 sm:mb-3">
              <span className="text-yellow-500 text-base sm:text-lg">★★★★★</span>
            </div>

            {/* Title */}
            <h3 className="font-serif text-coffee font-bold leading-tight mb-2 sm:mb-3 text-sm sm:text-xl lg:text-2xl">
              {review.title}
            </h3>

            {/* Review Text */}
            <div className="flex-grow mb-3 sm:mb-4">
              <p className="text-coffee/80 leading-relaxed text-xs sm:text-sm lg:text-base">
                {mobileDisplayText}
              </p>
              {mobileShowReadMore && (
                <span className="text-coffee/60 italic mt-1 inline-block text-xs">Read more...</span>
              )}
            </div>

            {/* Author Info */}
            <div className="mt-auto pt-3 sm:pt-4 border-t border-coffee/20">
              <p className="font-bold text-coffee text-sm sm:text-base">
                {review.name}
              </p>
              <p className="text-coffee/60 mt-1 flex items-center gap-1 text-xs sm:text-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {review.location}
              </p>
            </div>
          </div>
        </article>
      );
    }
    
    // For desktop large cards, show full text with line clamp
    const desktopDisplayText = review.text;
    const desktopShowReadMore = review.text.split(' ').length > 150; // Show read more if exceeds ~150 words

    return (
      <article
        className="bg-gradient-to-br from-white to-cream/30 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-coffee/10 flex flex-col h-full max-w-3xl mx-auto overflow-hidden"
      >
        <div className="flex flex-col h-full px-5 py-3 lg:px-6 lg:py-4">
          {/* Stars */}
          <div className="flex items-center mb-2 lg:mb-3">
            <span className="text-yellow-500 text-sm lg:text-base">★★★★★</span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-coffee font-bold leading-tight mb-2 lg:mb-3 text-xs lg:text-sm">
            {review.title}
          </h3>

          {/* Review Text */}
          <div className="flex-grow mb-3 lg:mb-4 overflow-hidden">
            <p className="text-coffee/80 leading-snug text-[10px] lg:text-xs line-clamp-[12]">
              {desktopDisplayText}
            </p>
            {desktopShowReadMore && (
              <span className="text-coffee/60 italic mt-1 inline-block text-[9px] lg:text-[10px]">Read more...</span>
            )}
          </div>

          {/* Author Info */}
          <div className="mt-auto pt-3 lg:pt-4 border-t border-coffee/20">
            <p className="font-bold text-coffee text-[10px] lg:text-xs">
              {review.name}
            </p>
            <p className="text-coffee/60 mt-1 flex items-center gap-1 text-[9px] lg:text-[10px]">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {review.location}
            </p>
          </div>
        </div>
      </article>
    );
  };

  return (
    <SectionWrapper id="reviews" className="bg-cream overflow-hidden max-w-full py-6 sm:py-8 md:py-10 lg:py-12">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-4 sm:mb-6 lg:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-coffee mb-2">
            What Our Customers Say
          </h2>
          <p className="text-coffee/70 text-xs sm:text-sm md:text-base lg:text-lg max-w-2xl mx-auto">
            Real reviews from real people who love our hair oil
          </p>
        </div>

        {/* Mobile Navigation Arrows - Only visible on mobile */}
        <button
          onClick={handlePrev}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="lg:hidden absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-50 text-coffee hover:scale-110 active:scale-95 transition-all flex items-center justify-center group bg-white/95 backdrop-blur-sm rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl border border-coffee/10"
          aria-label="Previous review"
        >
          <svg 
            className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-0.5 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={handleNext}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="lg:hidden absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-50 text-coffee hover:scale-110 active:scale-95 transition-all flex items-center justify-center group bg-white/95 backdrop-blur-sm rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl border border-coffee/10"
          aria-label="Next review"
        >
          <svg 
            className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-0.5 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Mobile Reviews Container - Bento Layout */}
        <div 
          className="lg:hidden relative px-10 sm:px-12 h-[420px] sm:h-[450px]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full h-full"
            >
              {/* Mobile Bento Grid - Alternating Layouts */}
              {currentIndex % 3 === 0 && (
                <div className="grid grid-rows-[1fr_1fr] gap-2 sm:gap-3 w-full h-full">
                  {/* Top - Large Featured */}
                  <div className="h-full min-h-0">
                    <MobileReviewCard review={reviews[currentIndex % reviews.length]} isFeatured={true} />
                  </div>
                  {/* Bottom - 2 Small Cards */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 h-full min-h-0">
                    <MobileReviewCard review={reviews[(currentIndex + 1) % reviews.length]} isFeatured={false} />
                    <MobileReviewCard review={reviews[(currentIndex + 2) % reviews.length]} isFeatured={false} />
                  </div>
                </div>
              )}

              {currentIndex % 3 === 1 && (
                <div className="grid grid-cols-[1fr_1fr] gap-2 sm:gap-3 w-full h-full">
                  {/* Left - 2 Small Stacked */}
                  <div className="flex flex-col gap-2 sm:gap-3 min-h-0">
                    <div className="flex-1 min-h-0">
                      <MobileReviewCard review={reviews[(currentIndex + 1) % reviews.length]} isFeatured={false} />
                    </div>
                    <div className="flex-1 min-h-0">
                      <MobileReviewCard review={reviews[(currentIndex + 2) % reviews.length]} isFeatured={false} />
                    </div>
                  </div>
                  {/* Right - Large Featured */}
                  <div className="h-full min-h-0">
                    <MobileReviewCard review={reviews[currentIndex % reviews.length]} isFeatured={true} />
                  </div>
                </div>
              )}

              {currentIndex % 3 === 2 && (
                <div className="grid grid-rows-[1fr_1fr] gap-2 sm:gap-3 w-full h-full">
                  {/* Top - 2 Small Cards */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 h-full min-h-0">
                    <MobileReviewCard review={reviews[(currentIndex + 1) % reviews.length]} isFeatured={false} />
                    <MobileReviewCard review={reviews[(currentIndex + 2) % reviews.length]} isFeatured={false} />
                  </div>
                  {/* Bottom - Large Featured */}
                  <div className="h-full min-h-0">
                    <MobileReviewCard review={reviews[currentIndex % reviews.length]} isFeatured={true} />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Desktop Bento Grid Layout */}
        <div 
          className="hidden lg:flex lg:flex-col lg:min-h-[calc(100vh-16rem)]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Bento Grid Container - Takes remaining space */}
          <div className="flex-1 flex items-center pb-6">
            <AnimatePresence mode="wait">
              {/* Layout 1: Classic 3-column (index % 4 === 0) */}
              {currentIndex % 4 === 0 && (
                <motion.div
                  key="layout-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="grid grid-cols-[1fr_2fr] gap-3 w-full h-[380px]"
                >
                  {/* Left Column - 2 reviews stacked */}
                  <div className="flex flex-col gap-3">
                    <div className="flex-1 min-h-0">
                      <ReviewCard review={reviews[currentIndex % reviews.length]} isCompact={true} />
                    </div>
                    <div className="flex-1 min-h-0">
                      <ReviewCard review={reviews[(currentIndex + 1) % reviews.length]} isCompact={true} />
                    </div>
                  </div>

                  {/* Right Column - Large featured review */}
                  <div className="h-full">
                    <ReviewCard review={reviews[(currentIndex + 2) % reviews.length]} isCompact={false} />
                  </div>
                </motion.div>
              )}

              {/* Layout 2: Left Large (index % 4 === 1) */}
              {currentIndex % 4 === 1 && (
                <motion.div
                  key="layout-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="grid grid-cols-[2fr_1fr] gap-3 w-full h-[380px]"
                >
                  {/* Left Large Review */}
                  <div className="h-full">
                    <ReviewCard review={reviews[currentIndex % reviews.length]} isCompact={false} />
                  </div>

                  {/* Right Column - 2 reviews stacked */}
                  <div className="flex flex-col gap-3">
                    <div className="flex-1 min-h-0">
                      <ReviewCard review={reviews[(currentIndex + 1) % reviews.length]} isCompact={true} />
                    </div>
                    <div className="flex-1 min-h-0">
                      <ReviewCard review={reviews[(currentIndex + 2) % reviews.length]} isCompact={true} />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Layout 3: Grid with large top (index % 4 === 2) */}
              {currentIndex % 4 === 2 && (
                <motion.div
                  key="layout-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="grid grid-rows-[1fr_1fr] gap-3 w-full h-[380px]"
                >
                  {/* Top Large Review */}
                  <div className="h-full">
                    <ReviewCard review={reviews[currentIndex % reviews.length]} isCompact={false} />
                  </div>

                  {/* Bottom - 2 reviews side by side */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-full">
                      <ReviewCard review={reviews[(currentIndex + 1) % reviews.length]} isCompact={true} />
                    </div>
                    <div className="h-full">
                      <ReviewCard review={reviews[(currentIndex + 2) % reviews.length]} isCompact={true} />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Layout 4: Right Large (index % 4 === 3) */}
              {currentIndex % 4 === 3 && (
                <motion.div
                  key="layout-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="grid grid-rows-[1fr_1fr] gap-3 w-full h-[380px]"
                >
                  {/* Top - 2 reviews side by side */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-full">
                      <ReviewCard review={reviews[(currentIndex + 1) % reviews.length]} isCompact={true} />
                    </div>
                    <div className="h-full">
                      <ReviewCard review={reviews[(currentIndex + 2) % reviews.length]} isCompact={true} />
                    </div>
                  </div>

                  {/* Bottom Large Review */}
                  <div className="h-full">
                    <ReviewCard review={reviews[currentIndex % reviews.length]} isCompact={false} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Navigation Controls - Fixed at bottom */}
          <div className="flex items-center justify-center gap-4 py-6">
            <motion.button
              onClick={handlePrev}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-coffee hover:scale-110 active:scale-95 transition-all flex items-center justify-center group bg-white/95 backdrop-blur-sm rounded-full p-3 shadow-lg hover:shadow-xl border border-coffee/10"
              aria-label="Previous reviews"
            >
              <svg 
                className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>

            {/* Dot Indicators */}
            <div className="flex items-center justify-center gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleDotClick(i)}
                  className={`transition-all duration-300 rounded-full ${
                    i === currentIndex
                      ? "w-8 h-2 bg-coffee"
                      : "w-2 h-2 bg-coffee/30 hover:bg-coffee/50"
                  }`}
                  aria-label={`Go to review ${i + 1}`}
                />
              ))}
            </div>

            <motion.button
              onClick={handleNext}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-coffee hover:scale-110 active:scale-95 transition-all flex items-center justify-center group bg-white/95 backdrop-blur-sm rounded-full p-3 shadow-lg hover:shadow-xl border border-coffee/10"
              aria-label="Next reviews"
            >
              <svg 
                className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Mobile Dot Indicators */}
        <div className="lg:hidden flex items-center justify-center gap-2 mt-6 sm:mt-8">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              className={`transition-all duration-300 rounded-full ${
                i === currentIndex
                  ? "w-6 sm:w-8 h-2 bg-coffee"
                  : "w-2 h-2 bg-coffee/30 hover:bg-coffee/50"
              }`}
              aria-label={`Go to review ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default ReviewsCarousel;
