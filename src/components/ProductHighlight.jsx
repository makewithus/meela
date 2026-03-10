import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";

// Carousel data for text and images
const productCarouselData = [
  {
    id: 1,
    title: "Natural Hair Care",
    description: "Discover the power of Ayurvedic herbs that strengthen hair roots and promote natural growth.",
    image: "/insta-slide-bg.png",
  },
  {
    id: 2,
    title: "Pure Ingredients",
    description: "Experience the mystical blend of 65+ powerful herbs under traditional Ayurvedic wisdom.",
    image: "insta-slide-bg2.png",
  },
  {
    id: 3,
    title: "Healthy Growth",
    description: "Transform your hair care routine with our ISO & GMP certified natural hair oil.",
    image: "insta-slide-bg3.png",
  },
  {
    id: 4,
    title: "Revitalize Your Hair",
    description: "Nourish your scalp and restore your hair's natural strength and shine with our premium formula.",
    image: "/insta-slide-bg4.png",
  },
];

const marqueeBenefits = [
  {
    id: 1,
    title: "REVIVE",
    description: "Revive your senses and scalp with a soothing, cooling effect that eases stress and promotes better sleep.",
    icon: "/hair.png",
  },
  {
    id: 2,
    title: "REPAIR",
    description: "Repair damaged, chemically treated, and heat-styled hair by restoring its strength, softness, and natural vitality.",
    icon: "/hair2.png",
  },
  {
    id: 3,
    title: "REGROW",
    description: "Regrow healthier, thicker hair by strengthening roots, reducing hair fall, and adding natural shine.",
    icon: "/hair3.png",
  },
  {
    id: 4,
    title: "RELAX",
    description: "Provides a soothing, cooling effect that helps relieve tension and calms your scalp. Helps you get better sleep as well.",
    icon: "/hair4.png",
  },
  {
    id: 5,
    title: "RESULTS",
    description: "New users must use it daily for 2 weeks, then 2-3x/week. See baby hairs in 3 weeks and improved scalp health in 3 days of use.",
    icon: "/hair5.png",
  },
  {
    id: 6,
    title: "RESTORE",
    description: "Restore scalp balance by eliminating dandruff, deeply nourishing roots, and improving overall hair health.",
    icon: "/hair6.png",
  },
];

const ProductHighlight = () => {
  const { openBuyModal } = useCart();
  const [isMobile, setIsMobile] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Carousel navigation
  const handlePrevious = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? productCarouselData.length - 1 : prevIndex - 1
    );
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === productCarouselData.length - 1 ? 0 : prevIndex + 1
    );
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      handleNext();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, handleNext]);

  // Duplicate marquee benefits for seamless loop
  const duplicatedMarqueeBenefits = [...marqueeBenefits, ...marqueeBenefits];

  const currentSlide = productCarouselData[currentIndex];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const itemVariantsRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const productVariants = {
    hidden: { opacity: 0, y: 150, scale: 0.7 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.5,
      },
    },
    hover: {
      scale: 1.02,
      y: -10,
      filter: "drop-shadow(0 25px 40px rgba(0, 0, 0, 0.25))",
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

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
    <section id="product" className="relative bg-cover bg-center bg-no-repeat min-h-screen flex flex-col overflow-hidden" style={{ backgroundImage: "url('https://res.cloudinary.com/dvaxoo30e/image/upload/v1764607946/product_bg_y26lan.png')" }}>
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

      {/* Desktop Layout */}
      <div 
        className="hidden lg:flex flex-col relative z-20 w-full h-screen max-w-[1800px] mx-auto px-6 lg:px-12 xl:px-16 py-4 lg:py-5 xl:py-6"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* Product Section with Carousel */}
        <div className="flex-1 flex flex-col justify-center items-center w-full">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center mb-2"
          >
            <img src="https://res.cloudinary.com/dvaxoo30e/image/upload/v1764607849/footer-logo_tlfsta.webp" alt="Meela" className="h-7 lg:h-7 xl:h-8 w-auto drop-shadow-md mb-0.5" />
            <p className="text-[#6f4a3c] text-[8px] tracking-widest font-medium" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Pure. Natural. Radiant
            </p>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-2 lg:mb-3"
          >
            <h2 className="font-serif text-base lg:text-lg xl:text-xl text-coffee font-bold leading-tight drop-shadow-md">
              WHY YOU SHOULD USE
            </h2>
            <h3 className="font-serif text-base lg:text-lg xl:text-xl text-coffee font-semibold leading-tight drop-shadow-md mt-0.5">
              <span className="italic">Meela Hair</span> Growth Oil?
            </h3>
          </motion.div>

          {/* Product Section - Bottle in Center with Benefits on Sides */}
          <div className="relative w-full max-w-[1700px] mx-auto">
            {/* Main Layout: Left Benefits | Bottle Center | Right Benefits */}
            <div className="grid grid-cols-[1fr_auto_1fr] gap-8 lg:gap-16 xl:gap-20 items-center">
              {/* LEFT SIDE - Benefits (1, 2, 3, 4) */}
              <div className="flex flex-col justify-center space-y-3 lg:space-y-4 xl:space-y-5 pr-3">
                {/* Benefit 1 */}
                <motion.div
                  initial={{ opacity: 0, x: -100, rotateY: -90, scale: 0.5 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
                  viewport={{ once: false, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.15 } }}
                  className="flex items-center gap-0 group cursor-pointer"
                  style={{ perspective: "1000px" }}
                >
                  <motion.p 
                    className="flex-1 flex items-center justify-end pr-2 text-[11px] lg:text-xs xl:text-sm text-[#6f4a3c] font-semibold text-right"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    Naturally reduces hair fall
                  </motion.p>
                  <div className="w-10 lg:w-12 xl:w-16 h-[2px] bg-gradient-to-l from-[#6f4a3c] to-transparent" />
                  <motion.div 
                    className="flex-shrink-0 w-8 h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 rounded-full bg-gradient-to-br from-[#6f4a3c] to-[#8b5e4d] flex items-center justify-center text-white font-bold text-sm lg:text-base xl:text-lg shadow-xl"
                    whileHover={{ rotate: 360, scale: 1.15 }}
                    transition={{ duration: 0.3 }}
                  >
                    1
                  </motion.div>
                </motion.div>

                {/* Benefit 2 */}
                <motion.div
                  initial={{ opacity: 0, x: -100, rotateY: -90, scale: 0.5 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
                  viewport={{ once: false, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.15 } }}
                  className="flex items-center gap-0 group cursor-pointer"
                  style={{ perspective: "1000px" }}
                >
                  <motion.p 
                    className="flex-1 flex items-center justify-end pr-2 text-[11px] lg:text-xs xl:text-sm text-[#6f4a3c] font-semibold text-right"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    Boosts hair from roots
                  </motion.p>
                  <div className="w-10 lg:w-12 xl:w-16 h-[2px] bg-gradient-to-l from-[#6f4a3c] to-transparent" />
                  <motion.div 
                    className="flex-shrink-0 w-8 h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 rounded-full bg-gradient-to-br from-[#6f4a3c] to-[#8b5e4d] flex items-center justify-center text-white font-bold text-sm lg:text-base xl:text-lg shadow-xl"
                    whileHover={{ rotate: 360, scale: 1.15 }}
                    transition={{ duration: 0.3 }}
                  >
                    2
                  </motion.div>
                </motion.div>

                {/* Benefit 3 */}
                <motion.div
                  initial={{ opacity: 0, x: -100, rotateY: -90, scale: 0.5 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
                  viewport={{ once: false, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.15 } }}
                  className="flex items-center gap-0 group cursor-pointer"
                  style={{ perspective: "1000px" }}
                >
                  <motion.p 
                    className="flex-1 flex items-center justify-end pr-2 text-[11px] lg:text-xs xl:text-sm text-[#6f4a3c] font-semibold text-right"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                  >
                    Strengthens, prevents breakage
                  </motion.p>
                  <div className="w-10 lg:w-12 xl:w-16 h-[2px] bg-gradient-to-l from-[#6f4a3c] to-transparent" />
                  <motion.div 
                    className="flex-shrink-0 w-8 h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 rounded-full bg-gradient-to-br from-[#6f4a3c] to-[#8b5e4d] flex items-center justify-center text-white font-bold text-sm lg:text-base xl:text-lg shadow-xl"
                    whileHover={{ rotate: 360, scale: 1.15 }}
                    transition={{ duration: 0.3 }}
                  >
                    3
                  </motion.div>
                </motion.div>

                {/* Benefit 4 */}
                <motion.div
                  initial={{ opacity: 0, x: -100, rotateY: -90, scale: 0.5 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
                  viewport={{ once: false, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: 0.95, ease: [0.34, 1.56, 0.64, 1] }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.15 } }}
                  className="flex items-center gap-0 group cursor-pointer"
                  style={{ perspective: "1000px" }}
                >
                  <motion.p 
                    className="flex-1 flex items-center justify-end pr-2 text-[11px] lg:text-xs xl:text-sm text-[#6f4a3c] font-semibold text-right"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.4, delay: 0.8 }}
                  >
                    Nourishes with 65+ herbs
                  </motion.p>
                  <div className="w-10 lg:w-12 xl:w-16 h-[2px] bg-gradient-to-l from-[#6f4a3c] to-transparent" />
                  <motion.div 
                    className="flex-shrink-0 w-8 h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 rounded-full bg-gradient-to-br from-[#6f4a3c] to-[#8b5e4d] flex items-center justify-center text-white font-bold text-sm lg:text-base xl:text-lg shadow-xl"
                    whileHover={{ rotate: 360, scale: 1.15 }}
                    transition={{ duration: 0.3 }}
                  >
                    4
                  </motion.div>
                </motion.div>
              </div>

              {/* CENTER - Bottle Image */}
              <div className="flex flex-col items-center justify-center relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 1,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className="flex justify-center items-center relative"
                >
                  <motion.img
                    src="https://res.cloudinary.com/dvaxoo30e/image/upload/v1764606664/meelabottle_yicagj.png"
                    alt="Meela Hair Oil"
                    className="w-auto h-[20vh] lg:h-[20vh] xl:h-[28vh] max-h-[320px] drop-shadow-2xl object-contain"
                    style={{
                      filter: "sepia(20%) saturate(100%) hue-rotate(0deg) brightness(1.05) contrast(0.8)",
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      y: -10,
                      filter: "sepia(21%) saturate(105%) hue-rotate(2deg) brightness(1.05) contrast(1) drop-shadow(0 30px 60px rgba(201, 169, 97, 0.5))",
                      transition: { duration: 0.2 }
                    }}
                  />
                </motion.div>

                {/* Buy Now Button Below Bottle */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.6,
                    delay: 0.5
                  }}
                  className="mt-2 lg:mt-3"
                >
                  <motion.button
                    onClick={openBuyModal}
                    className="cursor-pointer px-8 lg:px-10 xl:px-12 py-2 lg:py-2.5 xl:py-3 bg-gradient-to-r from-[#6f4a3c] to-[#8b5e4d] text-white text-xs lg:text-sm xl:text-base font-bold tracking-wider uppercase shadow-2xl relative overflow-hidden"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                    whileHover={{ 
                      scale: 1.08,
                      boxShadow: "0 25px 50px rgba(111, 74, 60, 0.6)",
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.span
                      className="absolute inset-0 bg-white opacity-0"
                      whileHover={{ opacity: 0.15 }}
                      transition={{ duration: 0.15 }}
                    />
                    BUY NOW !
                  </motion.button>
                </motion.div>
              </div>

              {/* RIGHT SIDE - Benefits (5, 6, 7, 8) */}
              <div className="flex flex-col justify-center space-y-3 lg:space-y-4 xl:space-y-5 pl-3">
                {/* Benefit 5 */}
                <motion.div
                  initial={{ opacity: 0, x: 100, rotateY: 90, scale: 0.5 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
                  viewport={{ once: false, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.15 } }}
                  className="flex items-center gap-0 group cursor-pointer"
                  style={{ perspective: "1000px" }}
                >
                  <motion.div 
                    className="flex-shrink-0 w-8 h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 rounded-full bg-gradient-to-br from-[#6f4a3c] to-[#8b5e4d] flex items-center justify-center text-white font-bold text-sm lg:text-base xl:text-lg shadow-xl"
                    whileHover={{ rotate: 360, scale: 1.15 }}
                    transition={{ duration: 0.3 }}
                  >
                    5
                  </motion.div>
                  <div className="w-10 lg:w-12 xl:w-16 h-[2px] bg-gradient-to-r from-[#6f4a3c] to-transparent" />
                  <motion.p 
                    className="flex-1 flex items-center pl-2 text-[11px] lg:text-xs xl:text-sm text-[#6f4a3c] font-semibold text-left"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    Reduces dandruff, soothes scalp
                  </motion.p>
                </motion.div>

                {/* Benefit 6 */}
                <motion.div
                  initial={{ opacity: 0, x: 100, rotateY: 90, scale: 0.5 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
                  viewport={{ once: false, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.15 } }}
                  className="flex items-center gap-0 group cursor-pointer"
                  style={{ perspective: "1000px" }}
                >
                  <motion.div 
                    className="flex-shrink-0 w-8 h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 rounded-full bg-gradient-to-br from-[#6f4a3c] to-[#8b5e4d] flex items-center justify-center text-white font-bold text-sm lg:text-base xl:text-lg shadow-xl"
                    whileHover={{ rotate: 360, scale: 1.15 }}
                    transition={{ duration: 0.3 }}
                  >
                    6
                  </motion.div>
                  <div className="w-10 lg:w-12 xl:w-16 h-[2px] bg-gradient-to-r from-[#6f4a3c] to-transparent" />
                  <motion.p 
                    className="flex-1 flex items-center pl-2 text-[11px] lg:text-xs xl:text-sm text-[#6f4a3c] font-semibold text-left"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    Adds shine and volume
                  </motion.p>
                </motion.div>

                {/* Benefit 7 */}
                <motion.div
                  initial={{ opacity: 0, x: 100, rotateY: 90, scale: 0.5 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
                  viewport={{ once: false, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.15 } }}
                  className="flex items-center gap-0 group cursor-pointer"
                  style={{ perspective: "1000px" }}
                >
                  <motion.div 
                    className="flex-shrink-0 w-8 h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 rounded-full bg-gradient-to-br from-[#6f4a3c] to-[#8b5e4d] flex items-center justify-center text-white font-bold text-sm lg:text-base xl:text-lg shadow-xl"
                    whileHover={{ rotate: 360, scale: 1.15 }}
                    transition={{ duration: 0.3 }}
                  >
                    7
                  </motion.div>
                  <div className="w-10 lg:w-12 xl:w-16 h-[2px] bg-gradient-to-r from-[#6f4a3c] to-transparent" />
                  <motion.p 
                    className="flex-1 flex items-center pl-2 text-[11px] lg:text-xs xl:text-sm text-[#6f4a3c] font-semibold text-left"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                  >
                    Non-sticky, fast-absorbing
                  </motion.p>
                </motion.div>

                {/* Benefit 8 */}
                <motion.div
                  initial={{ opacity: 0, x: 100, rotateY: 90, scale: 0.5 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
                  viewport={{ once: false, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: 0.95, ease: [0.34, 1.56, 0.64, 1] }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.15 } }}
                  className="flex items-center gap-0 group cursor-pointer"
                  style={{ perspective: "1000px" }}
                >
                  <motion.div 
                    className="flex-shrink-0 w-8 h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 rounded-full bg-gradient-to-br from-[#6f4a3c] to-[#8b5e4d] flex items-center justify-center text-white font-bold text-sm lg:text-base xl:text-lg shadow-xl"
                    whileHover={{ rotate: 360, scale: 1.15 }}
                    transition={{ duration: 0.3 }}
                  >
                    8
                  </motion.div>
                  <div className="w-10 lg:w-12 xl:w-16 h-[2px] bg-gradient-to-r from-[#6f4a3c] to-transparent" />
                  <motion.p 
                    className="flex-1 flex items-center pl-2 text-[11px] lg:text-xs xl:text-sm text-[#6f4a3c] font-semibold text-left"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.4, delay: 0.8 }}
                  >
                    Repairs heat & chemical damage
                  </motion.p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Marquee Benefits Section - Below Product */}
        <div className="relative overflow-hidden w-full py-6" style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)' }}>
          {/* Marquee Animation */}
          <div className="flex overflow-hidden">
            <div 
              className="flex gap-4 xl:gap-5" 
              style={{ 
                width: "max-content",
                animation: "marquee 45s linear infinite"
              }}
            >
              {duplicatedMarqueeBenefits.map((benefit, index) => (
                <motion.div
                  key={`desktop-${benefit.id}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative flex-shrink-0 w-[200px] xl:w-[210px] rounded-lg xl:rounded-xl p-3 xl:p-2 transition-all duration-300 hover:shadow-xl border border-[#6f4a3c]/10 hover:border-[#6f4a3c]/30 bg-cream/90 backdrop-blur-sm"
                >
                  {/* Icon Container */}
                  <motion.div
                    className="mb-2 xl:mb-1.5"
                    whileHover={{ 
                      scale: 1.05,
                      rotate: [0, -5, 5, -5, 0]
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="w-9 h-9 xl:w-8 xl:h-8 rounded-full bg-gradient-to-br from-[#6f4a3c]/15 via-[#6f4a3c]/10 to-[#6f4a3c]/5 flex items-center justify-center group-hover:from-[#6f4a3c]/25 group-hover:via-[#6f4a3c]/20 group-hover:to-[#6f4a3c]/10 transition-all duration-300 shadow-md group-hover:shadow-xl p-1.5 xl:p-1.5">
                      <img 
                        src={benefit.icon} 
                        alt={benefit.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </motion.div>

                  {/* Title */}
                  <h3
                    className="text-sm xl:text-sm font-bold text-[#6f4a3c] mb-1 xl:mb-1 tracking-tight uppercase"
                    style={{ fontFamily: '"Poppins", sans-serif', letterSpacing: '0.5px' }}
                  >
                    {benefit.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-[10px] xl:text-[10px] text-[#6f4a3c]/70 leading-relaxed"
                    style={{ fontFamily: '"Poppins", sans-serif' }}
                  >
                    {benefit.description}
                  </p>

                  {/* Bottom accent line */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#6f4a3c] via-[#8b5e4d] to-[#6f4a3c] w-0 group-hover:w-full transition-all duration-500 rounded-b-lg xl:rounded-b-xl"
                    initial={false}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div 
        className="lg:hidden flex flex-col relative z-20 w-full min-h-screen max-w-[1600px] mx-auto px-4 sm:px-6 py-6"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* Product Section */}
        <div className="flex-1 flex flex-col items-center justify-center pt-4 pb-6">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, y: -30, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center mb-2"
          >
            <img src="/footer-logo.webp" alt="Meela" className="h-8 sm:h-10 w-auto drop-shadow-md mb-0.5" />
            <p className="text-[#6f4a3c] text-[8px] sm:text-[9px] tracking-wider font-medium" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Pure. Natural. Radiant
            </p>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-2 lg:mb-3 xl:mb-4"
          >
            <h2 className="font-serif text-lg sm:text-xl text-coffee font-bold leading-tight drop-shadow-md">
              WHY YOU SHOULD USE
            </h2>
            <h3 className="font-serif text-base sm:text-lg text-coffee font-semibold leading-tight drop-shadow-md mt-0.5">
              <span className="italic">Meela Hair</span> Growth Oil?
            </h3>
          </motion.div>

          {/* Product Layout - Bottle Center with Benefits on Sides */}
          <div className="relative w-full max-w-2xl mx-auto">
            {/* Main Grid Layout */}
            <div className="grid grid-cols-[1fr_auto_1fr] gap-0 sm:gap-2 items-center">
              {/* LEFT SIDE - Benefits (1, 2, 3, 4) */}
              <div className="flex flex-col justify-center space-y-4 sm:space-y-6">
                {/* Benefit 1 */}
                <motion.div
                  initial={{ opacity: 0, x: -50, rotateY: -45, scale: 0.7 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
                  viewport={{ once: false, margin: "0px" }}
                  transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.15 } }}
                  className="flex items-center gap-0 cursor-pointer"
                  style={{ perspective: "800px", transformStyle: "preserve-3d" }}
                >
                  <motion.p 
                    className="flex-1 flex items-center justify-end pr-1 sm:pr-2 text-[8px] sm:text-sm md:text-base text-[#5a3a2e] font-semibold text-right leading-tight sm:leading-snug drop-shadow-sm"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: false, margin: "0px" }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    Reduces hair fall
                  </motion.p>
                  <div className="w-2 sm:w-6 h-[1.5px] bg-gradient-to-l from-[#6f4a3c] to-transparent" />
                  <motion.div 
                    className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#6f4a3c] to-[#8b5e4d] flex items-center justify-center text-white font-bold text-[10px] sm:text-xs shadow-lg"
                    whileHover={{ rotate: 360, scale: 1.15 }}
                    transition={{ duration: 0.3 }}
                  >
                    1
                  </motion.div>
                </motion.div>

                {/* Benefit 2 */}
                <motion.div
                  initial={{ opacity: 0, x: -50, rotateY: -45, scale: 0.7 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
                  viewport={{ once: false, margin: "0px" }}
                  transition={{ duration: 0.7, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.15 } }}
                  className="flex items-center gap-0 cursor-pointer"
                  style={{ perspective: "800px", transformStyle: "preserve-3d" }}
                >
                  <motion.p 
                    className="flex-1 flex items-center justify-end pr-1 sm:pr-2 text-[8px] sm:text-sm md:text-base text-[#5a3a2e] font-semibold text-right leading-tight sm:leading-snug drop-shadow-sm"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: false, margin: "0px" }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    Boosts from roots
                  </motion.p>
                  <div className="w-2 sm:w-6 h-[1.5px] bg-gradient-to-l from-[#6f4a3c] to-transparent" />
                  <motion.div 
                    className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#6f4a3c] to-[#8b5e4d] flex items-center justify-center text-white font-bold text-[10px] sm:text-xs shadow-lg"
                    whileHover={{ rotate: 360, scale: 1.15 }}
                    transition={{ duration: 0.3 }}
                  >
                    2
                  </motion.div>
                </motion.div>

                {/* Benefit 3 */}
                <motion.div
                  initial={{ opacity: 0, x: -50, rotateY: -45, scale: 0.7 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
                  viewport={{ once: false, margin: "0px" }}
                  transition={{ duration: 0.7, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.15 } }}
                  className="flex items-center gap-0 cursor-pointer"
                  style={{ perspective: "800px", transformStyle: "preserve-3d" }}
                >
                  <motion.p 
                    className="flex-1 flex items-center justify-end pr-1 sm:pr-2 text-[8px] sm:text-sm md:text-base text-[#5a3a2e] font-semibold text-right leading-tight sm:leading-snug drop-shadow-sm"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: false, margin: "0px" }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    Strengthens hair
                  </motion.p>
                  <div className="w-2 sm:w-6 h-[1.5px] bg-gradient-to-l from-[#6f4a3c] to-transparent" />
                  <motion.div 
                    className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#6f4a3c] to-[#8b5e4d] flex items-center justify-center text-white font-bold text-[10px] sm:text-xs shadow-lg"
                    whileHover={{ rotate: 360, scale: 1.15 }}
                    transition={{ duration: 0.3 }}
                  >
                    3
                  </motion.div>
                </motion.div>

                {/* Benefit 4 */}
                <motion.div
                  initial={{ opacity: 0, x: -50, rotateY: -45, scale: 0.7 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
                  viewport={{ once: false, margin: "0px" }}
                  transition={{ duration: 0.7, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.15 } }}
                  className="flex items-center gap-0 cursor-pointer"
                  style={{ perspective: "800px", transformStyle: "preserve-3d" }}
                >
                  <motion.p 
                    className="flex-1 flex items-center justify-end pr-1 sm:pr-2 text-[8px] sm:text-sm md:text-base text-[#5a3a2e] font-semibold text-right leading-tight sm:leading-snug drop-shadow-sm"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: false, margin: "0px" }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                  >
                    65+ herbs
                  </motion.p>
                  <div className="w-2 sm:w-6 h-[1.5px] bg-gradient-to-l from-[#6f4a3c] to-transparent" />
                  <motion.div 
                    className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#6f4a3c] to-[#8b5e4d] flex items-center justify-center text-white font-bold text-[10px] sm:text-xs shadow-lg"
                    whileHover={{ rotate: 360, scale: 1.15 }}
                    transition={{ duration: 0.3 }}
                  >
                    4
                  </motion.div>
                </motion.div>
              </div>

              {/* CENTER - Bottle Image */}
              <div className="flex flex-col items-center justify-center relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.8,
                    ease: "easeOut"
                  }}
                  className="flex justify-center items-center relative"
                >
                  <motion.img
                    src="https://res.cloudinary.com/dvaxoo30e/image/upload/v1764606664/meelabottle_yicagj.png"
                    alt="Meela Hair Oil"
                    className="w-auto h-[30vh] sm:h-[45vh] max-h-[450px] drop-shadow-2xl object-contain"
                    style={{
                      filter: "sepia(20%) saturate(100%) hue-rotate(0deg) brightness(1.05) contrast(0.8)",
                    }}
                    whileTap={{ 
                      scale: 1.05,
                      y: -8,
                      filter: "sepia(21%) saturate(105%) hue-rotate(2deg) brightness(1.05) contrast(1) drop-shadow(0 20px 40px rgba(201, 169, 97, 0.4))",
                      transition: { duration: 0.15 }
                    }}
                  />
                </motion.div>

                {/* Buy Now Button - Below Image */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.5,
                    delay: 0.3
                  }}
                  className="mt-2 sm:mt-3"
                >
                  <motion.button
                    onClick={openBuyModal}
                    className="mt-4 cursor-pointer px-6 py-2.5 sm:px-18 sm:py-2.5 bg-gradient-to-r from-[#6f4a3c] to-[#8b5e4d] text-white text-[10px] sm:text-xs font-bold tracking-wider uppercase shadow-xl relative overflow-hidden whitespace-nowrap"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 20px 40px rgba(111, 74, 60, 0.5)",
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.96 }}
                  >
                    <motion.span
                      className="absolute inset-0 bg-white opacity-0"
                      whileHover={{ opacity: 0.1 }}
                      transition={{ duration: 0.15 }}
                    />
                    BUY NOW !
                  </motion.button>
                </motion.div>
              </div>

              {/* RIGHT SIDE - Benefits (5, 6, 7, 8) */}
              <div className="flex flex-col justify-center space-y-4 sm:space-y-6">
                {/* Benefit 5 */}
                <motion.div
                  initial={{ opacity: 0, x: 50, rotateY: 45, scale: 0.7 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
                  viewport={{ once: false, margin: "0px" }}
                  transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.15 } }}
                  className="flex items-center gap-0 cursor-pointer"
                  style={{ perspective: "800px", transformStyle: "preserve-3d" }}
                >
                  <motion.div 
                    className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#6f4a3c] to-[#8b5e4d] flex items-center justify-center text-white font-bold text-[10px] sm:text-xs shadow-lg"
                    whileHover={{ rotate: 360, scale: 1.15 }}
                    transition={{ duration: 0.3 }}
                  >
                    5
                  </motion.div>
                  <div className="w-2 sm:w-6 h-[1.5px] bg-gradient-to-r from-[#6f4a3c] to-transparent" />
                  <motion.p 
                    className="flex-1 flex items-center pl-1 sm:pl-2 text-[8px] sm:text-sm md:text-base text-[#5a3a2e] font-semibold text-left leading-tight sm:leading-snug drop-shadow-sm"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: false, margin: "0px" }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    Reduces dandruff
                  </motion.p>
                </motion.div>

                {/* Benefit 6 */}
                <motion.div
                  initial={{ opacity: 0, x: 50, rotateY: 45, scale: 0.7 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
                  viewport={{ once: false, margin: "0px" }}
                  transition={{ duration: 0.7, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.15 } }}
                  className="flex items-center gap-0 cursor-pointer"
                  style={{ perspective: "800px", transformStyle: "preserve-3d" }}
                >
                  <motion.div 
                    className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#6f4a3c] to-[#8b5e4d] flex items-center justify-center text-white font-bold text-[10px] sm:text-xs shadow-lg"
                    whileHover={{ rotate: 360, scale: 1.15 }}
                    transition={{ duration: 0.3 }}
                  >
                    6
                  </motion.div>
                  <div className="w-2 sm:w-6 h-[1.5px] bg-gradient-to-r from-[#6f4a3c] to-transparent" />
                  <motion.p 
                    className="flex-1 flex items-center pl-1 sm:pl-2 text-[8px] sm:text-sm md:text-base text-[#5a3a2e] font-semibold text-left leading-tight sm:leading-snug drop-shadow-sm"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: false, margin: "0px" }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    Adds shine
                  </motion.p>
                </motion.div>

                {/* Benefit 7 */}
                <motion.div
                  initial={{ opacity: 0, x: 50, rotateY: 45, scale: 0.7 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
                  viewport={{ once: false, margin: "0px" }}
                  transition={{ duration: 0.7, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.15 } }}
                  className="flex items-center gap-0 cursor-pointer"
                  style={{ perspective: "800px", transformStyle: "preserve-3d" }}
                >
                  <motion.div 
                    className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#6f4a3c] to-[#8b5e4d] flex items-center justify-center text-white font-bold text-[10px] sm:text-xs shadow-lg"
                    whileHover={{ rotate: 360, scale: 1.15 }}
                    transition={{ duration: 0.3 }}
                  >
                    7
                  </motion.div>
                  <div className="w-2 sm:w-6 h-[1.5px] bg-gradient-to-r from-[#6f4a3c] to-transparent" />
                  <motion.p 
                    className="flex-1 flex items-center pl-1 sm:pl-2 text-[8px] sm:text-sm md:text-base text-[#5a3a2e] font-semibold text-left leading-tight sm:leading-snug drop-shadow-sm"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: false, margin: "0px" }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    Fast-absorbing
                  </motion.p>
                </motion.div>

                {/* Benefit 8 */}
                <motion.div
                  initial={{ opacity: 0, x: 50, rotateY: 45, scale: 0.7 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
                  viewport={{ once: false, margin: "0px" }}
                  transition={{ duration: 0.7, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.15 } }}
                  className="flex items-center gap-0 cursor-pointer"
                  style={{ perspective: "800px", transformStyle: "preserve-3d" }}
                >
                  <motion.div 
                    className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#6f4a3c] to-[#8b5e4d] flex items-center justify-center text-white font-bold text-[10px] sm:text-xs shadow-lg"
                    whileHover={{ rotate: 360, scale: 1.15 }}
                    transition={{ duration: 0.3 }}
                  >
                    8
                  </motion.div>
                  <div className="w-2 sm:w-6 h-[1.5px] bg-gradient-to-r from-[#6f4a3c] to-transparent" />
                  <motion.p 
                    className="flex-1 flex items-center pl-1 sm:pl-2 text-[8px] sm:text-sm md:text-base text-[#5a3a2e] font-semibold text-left leading-tight sm:leading-snug drop-shadow-sm"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: false, margin: "0px" }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                  >
                    Repairs damage
                  </motion.p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Marquee Benefits Section - Below Product */}
        <div className="relative overflow-hidden w-full py-6 mt-6" style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)' }}>
          {/* Marquee Animation */}
          <div className="flex overflow-hidden">
            <div 
              className="flex gap-3 sm:gap-4" 
              style={{ 
                width: "max-content",
                animation: "marquee 45s linear infinite"
              }}
            >
              {duplicatedMarqueeBenefits.map((benefit, index) => (
                <motion.div
                  key={`mobile-${benefit.id}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative flex-shrink-0 w-[200px] sm:w-[220px] md:w-[240px] rounded-lg sm:rounded-xl p-4 sm:p-5 transition-all duration-300 hover:shadow-xl border border-[#6f4a3c]/10 hover:border-[#6f4a3c]/30 bg-cream/90 backdrop-blur-sm"
                >
                  {/* Icon Container */}
                  <motion.div
                    className="mb-3 sm:mb-4"
                    whileHover={{ 
                      scale: 1.05,
                      rotate: [0, -5, 5, -5, 0]
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[#6f4a3c]/15 via-[#6f4a3c]/10 to-[#6f4a3c]/5 flex items-center justify-center group-hover:from-[#6f4a3c]/25 group-hover:via-[#6f4a3c]/20 group-hover:to-[#6f4a3c]/10 transition-all duration-300 shadow-md group-hover:shadow-xl p-2 sm:p-2.5">
                      <img 
                        src={benefit.icon} 
                        alt={benefit.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </motion.div>

                  {/* Title */}
                  <h3
                    className="text-sm sm:text-base md:text-lg font-bold text-[#6f4a3c] mb-1.5 sm:mb-2 tracking-tight uppercase"
                    style={{ fontFamily: '"Poppins", sans-serif', letterSpacing: '0.5px' }}
                  >
                    {benefit.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-[10px] sm:text-xs md:text-sm text-[#6f4a3c]/70 leading-relaxed"
                    style={{ fontFamily: '"Poppins", sans-serif' }}
                  >
                    {benefit.description}
                  </p>

                  {/* Bottom accent line */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#6f4a3c] via-[#8b5e4d] to-[#6f4a3c] w-0 group-hover:w-full transition-all duration-500 rounded-b-lg sm:rounded-b-xl"
                    initial={false}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductHighlight;
