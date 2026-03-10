import SectionWrapper from "./SectionWrapper";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";

const Benefits = () => {
  const { openBuyModal } = useCart();

  const benefits = [
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

  // Duplicate benefits for seamless loop
  const duplicatedBenefits = [...benefits, ...benefits];

  return (
    <SectionWrapper id="benefits" className="bg-cream py-8 sm:py-12 md:py-16 lg:py-20 max-w-full overflow-hidden">
      <div className="w-full">
        {/* Two Column Layout: Left Static Content + Right Marquee */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-6 xl:gap-8">
          
          {/* Left Side - Static Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-[320px] xl:w-[380px] flex-shrink-0 px-6 sm:px-8 lg:px-0 lg:pl-8 xl:pl-12"
          >
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[3rem] xl:text-[3.5rem] text-[#6f4a3c] mb-4 sm:mb-5 lg:mb-6 leading-tight"
              style={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 600,
              }}
            >
              Benefits
            </h2>
            <p
              className="text-sm sm:text-base md:text-lg text-[#6f4a3c]/75 leading-relaxed mb-6 sm:mb-7 lg:mb-8 max-w-md lg:max-w-none"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              Strengthen, nourish, and restore your hair with Meela Hair Oil, crafted from 100% natural botanicals.
            </p>
            <motion.button
              onClick={openBuyModal}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer px-8 sm:px-10 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-[#6f4a3c] to-[#8b5e4d] text-white text-sm sm:text-base font-semibold tracking-wide uppercase hover:shadow-xl transition-all shadow-lg active:scale-95"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              Shop Now
            </motion.button>
          </motion.div>

          {/* Right Side - Marquee Container */}
          <div className="flex-1 relative overflow-hidden w-full lg:w-auto">
            {/* Gradient overlays for fade effect */}
            <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 md:w-20 lg:w-24 bg-gradient-to-r from-cream to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 md:w-20 lg:w-24 bg-gradient-to-l from-cream to-transparent z-10 pointer-events-none"></div>
            
            {/* Marquee Animation */}
            <div className="flex overflow-hidden">
              <div 
                className="flex gap-4 sm:gap-5 md:gap-6" 
                style={{ 
                  width: "max-content",
                  animation: "marquee 45s linear infinite"
                }}
              >
                {duplicatedBenefits.map((benefit, index) => (
                  <motion.div
                    key={`${benefit.id}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ 
                      y: -8,
                      transition: { duration: 0.3 }
                    }}
                    className="group relative flex-shrink-0 w-[240px] sm:w-[270px] md:w-[300px] lg:w-[320px] rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-7 transition-all duration-300 hover:shadow-xl border border-[#6f4a3c]/10 hover:border-[#6f4a3c]/30"
                  >
                    {/* Icon Container */}
                    <motion.div
                      className="mb-4 sm:mb-5"
                      whileHover={{ 
                        scale: 1.15,
                        rotate: [0, -5, 5, -5, 0]
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-[#6f4a3c]/15 via-[#6f4a3c]/10 to-[#6f4a3c]/5 flex items-center justify-center group-hover:from-[#6f4a3c]/25 group-hover:via-[#6f4a3c]/20 group-hover:to-[#6f4a3c]/10 transition-all duration-300 shadow-md group-hover:shadow-xl p-2.5 sm:p-3">
                        <img 
                          src={benefit.icon} 
                          alt={benefit.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </motion.div>

                    {/* Title */}
                    <h3
                      className="text-lg sm:text-xl md:text-2xl font-bold text-[#6f4a3c] mb-2 sm:mb-3 tracking-tight uppercase"
                      style={{ fontFamily: '"Poppins", sans-serif', letterSpacing: '0.5px' }}
                    >
                      {benefit.title}
                    </h3>

                    {/* Description */}
                    <p
                      className="text-xs sm:text-sm md:text-base text-[#6f4a3c]/70 leading-relaxed"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      {benefit.description}
                    </p>

                    {/* Bottom accent line */}
                    <motion.div
                      className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#6f4a3c] via-[#8b5e4d] to-[#6f4a3c] w-0 group-hover:w-full transition-all duration-500 rounded-b-xl"
                      initial={false}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Benefits;
