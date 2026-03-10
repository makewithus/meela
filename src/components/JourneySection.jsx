import SectionWrapper from "./SectionWrapper";
import { journey } from "../data/journey";
import { motion } from "framer-motion";

const JourneySection = () => {
  return (
    <SectionWrapper id="journey" className="bg-[#f7efe6] py-6 sm:py-12 md:py-16 lg:py-24 max-w-full">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-8 md:gap-12 relative">
            {/* Timeline Line - Vertical for mobile, horizontal for desktop */}
            {/* Mobile: Vertical line passing through center of circles */}
            {/* Circle is w-14 (56px), center is at 28px from left edge */}
            {/* Container padding is px-4 (16px) */}
            {/* Line center position: 16px (padding) + 28px (half circle) = 44px */}
            <motion.div 
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 1.2, 
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#6f4a3c]/30 via-[#6f4a3c]/20 to-[#6f4a3c]/30 origin-top md:hidden z-0"
              style={{ 
                left: '28px',
                transform: 'translateX(-50%)'
              }}
            ></motion.div>
            
            {/* Desktop: Horizontal line */}
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden md:block absolute top-12 left-0 right-0 h-[2px] bg-[#6f4a3c]/20 origin-left z-0"
            ></motion.div>

            {journey.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative z-10"
              >
                {/* Mobile: Horizontal layout with circle on left, text on right */}
                <div className="flex flex-row items-center gap-5 sm:flex-col sm:items-center sm:gap-0">
                  {/* Year Circle - Left side on mobile */}
                  <div className="flex-shrink-0 sm:flex sm:justify-center sm:mb-4 sm:mb-5 md:mb-6 sm:order-1 relative">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.6,
                        delay: index * 0.15 + 0.3,
                        type: "spring",
                        stiffness: 200,
                        damping: 15
                      }}
                      className="w-14 h-14 sm:w-20 sm:h-20 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full border-2 border-[#6f4a3c] bg-[#f7efe6] flex items-center justify-center relative z-20 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-110"
                    >
                      <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.15 + 0.5 }}
                        className="text-sm sm:text-lg md:text-xl lg:text-2xl text-[#6f4a3c]"
                        style={{
                          fontFamily: '"Playfair Display", serif',
                          fontWeight: 500,
                        }}
                      >
                        {item.year}
                      </motion.span>
                    </motion.div>
                  </div>

                  {/* Description - Right side on mobile */}
                  <div className="flex-1 text-left sm:text-center sm:px-1 md:px-2 sm:order-2">
                    <p
                      className="text-[11px] sm:text-xs md:text-sm text-[#6f4a3c]/80 leading-relaxed pl-2 sm:pl-0"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      {item.text}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Decorative dots at connection points - desktop only */}
          <div className="hidden md:flex absolute top-12 left-0 right-0 justify-between px-[calc(12.5%-2px)]">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
                className="w-1 h-1 rounded-full bg-[#6f4a3c]/40"
              ></motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
};

export default JourneySection;
