import SectionWrapper from "./SectionWrapper";
import { ingredients } from "../data/ingredients";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";

const IngredientsSection = () => {
  const { openBuyModal } = useCart();
  
  // Alternating background colors - cream and light green
  const bgColors = ["#f7efe6", "#e8f0e8"];

  return (
    <SectionWrapper className="py-2 sm:py-12 md:py-16 lg:py-24 max-w-full">
      <div className="max-w-8xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16"
        >
          <h2
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-[#6f4a3c] mb-2 sm:mb-3 md:mb-4"
            style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 600,
            }}
          >
            Ingredients You Can Pronounce
          </h2>
          <p
            className="text-[11px] sm:text-xs md:text-sm lg:text-base text-[#6f4a3c]/70 max-w-2xl mx-auto"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            Every drop is packed with high-performing Ayurvedic botanicals.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          {ingredients.map((ing, i) => (
            <motion.div
              key={ing.name}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: i * 0.1,
                type: "spring",
                stiffness: 100,
              }}
              className="text-center"
            >
              <motion.div
                animate={{
                  y: [0, -25, 0, -20, 0],
                }}
                transition={{
                  duration: 3 + (i % 4) * 0.5,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                  delay: i * 0.2,
                }}
                whileHover={{ 
                  y: -15, 
                  transition: { 
                    duration: 0.3,
                    ease: "easeOut" 
                  } 
                }}
              >
                {/* Circular Image Container */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 mx-auto rounded-full flex items-center justify-center mb-2 sm:mb-3 md:mb-4 overflow-hidden shadow-md"
                  style={{
                    backgroundColor: bgColors[i % 2],
                  }}
                >
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    src={ing.src}
                    alt={ing.name}
                    className="w-12 h-12 sm:w-14 sm:h-14 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain"
                  />
                </motion.div>

                {/* Name */}
                <h3
                  className="text-[12px] sm:text-xs md:text-sm lg:text-base xl:text-lg text-[#6f4a3c] mb-1 sm:mb-1.5 md:mb-2"
                  style={{
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 600,
                  }}
                >
                  {ing.name}
                </h3>

                {/* Description */}
                <p
                  className="text-[9px] sm:text-[10px] md:text-[10px] lg:text-xs text-[#6f4a3c]/70 leading-relaxed px-1 sm:px-1.5 md:px-2"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  {ing.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Buy Now Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center mt-8 sm:mt-10 md:mt-12 lg:mt-16"
        >
          <motion.button
            onClick={openBuyModal}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(111, 74, 60, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            className="relative overflow-hidden group"
          >
            {/* Animated gradient background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#6f4a3c] via-[#8b5e4a] to-[#6f4a3c]"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                backgroundSize: "200% 200%",
              }}
            />
            
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: 1,
              }}
            />

            {/* Button content */}
            <div className="relative px-8 sm:px-10 md:px-12 lg:px-16 py-3 sm:py-3.5 md:py-4 lg:py-5 flex items-center gap-2 sm:gap-3">
              <span
                className="cursor-pointer text-white text-sm sm:text-base md:text-lg lg:text-xl font-semibold tracking-wide"
                style={{ fontFamily: '"Poppins", sans-serif' }}
              >
                Buy Now
              </span>
              
              {/* Animated arrow */}
              <motion.svg
                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white"
                animate={{
                  x: [0, 5, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </motion.svg>
            </div>

            {/* Rounded corners */}
            <div className="absolute inset-0 rounded-full" />
          </motion.button>
        </motion.div>
      </div>
    </SectionWrapper>
  );
};

export default IngredientsSection;
