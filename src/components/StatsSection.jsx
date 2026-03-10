import SectionWrapper from "./SectionWrapper";
import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useCart } from "../context/CartContext";

const useCountUp = (target, duration = 1500, shouldStart = false) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!shouldStart) {
      setValue(0);
      return;
    }
    let start;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, shouldStart]);
  return value;
};

const StatsSection = () => {
  const { openBuyModal } = useCart();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const herbs = useCountUp(65, 1500, isInView);
  const customers = useCountUp(65000, 2000, isInView);
  const years = useCountUp(12, 1500, isInView);

  const timeline = [
    {
      year: "2012",
      text: "Founded by Muneera in Malappuram, Kerala — rooted in her passion for Ayurvedic healing.",
    },
    {
      year: "2015",
      text: "Early batches of Meela Hair Oil gained traction in the local salons and wellness stores.",
    },
    {
      year: "2020",
      text: "Expanded reach to the UAE and GCC, taking clean Ayurvedic hair care beyond India.",
    },
    {
      year: "2024",
      text: "65,000+ units sold and trusted by thousands with clean Ayurveda as our identity.",
    },
  ];

  return (
    <div className="relative min-h-[350px] sm:min-h-[400px] md:min-h-[500px] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://res.cloudinary.com/dvaxoo30e/image/upload/v1764613560/product-bg_wrf3sz.webp"
          alt="Meela Hair Growth Oil"
          className="w-full h-full object-cover object-center sm:object-right"
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 min-h-[350px] sm:min-h-[400px] md:min-h-[500px] flex items-center py-6 sm:py-12 md:py-16">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-6 md:px-8">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
            {/* Left side - Empty space for product in background image */}
            <div className="hidden md:block"></div>

            {/* Right side - Title and Stats */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="flex flex-col space-y-2 sm:space-y-2.5 md:space-y-5 max-w-[200px] sm:max-w-sm md:max-w-none ml-auto mr-2 sm:mr-auto md:ml-0"
            >
              <h2
                className="text-md sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-[#6f4a3c] text-right sm:text-left"
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 600,
                }}
              >
                Ayurveda Rooted In Legacy
              </h2>
              <p
                className="text-[9px] sm:text-[11px] md:text-xs lg:text-sm text-[#6f4a3c]/90 leading-relaxed text-right sm:text-left"
                style={{ fontFamily: '"Poppins", sans-serif' }}
              >
                Nature's finest herbs, time-honored rituals, and over a decade of trust — the Meela journey continues with every drop.
              </p>

              {/* Stats Box */}
              <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="grid grid-cols-3 gap-0.5 sm:gap-1.5 md:gap-3 p-2 sm:p-2.5 md:p-4 md:py-6 md:px-2 rounded-md sm:rounded-xl md:rounded-2xl bg-white/40 backdrop-blur-sm border border-[#6f4a3c]/10"
              >
                <div className="text-center">
                  <p
                    className="text-sm sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-[#6f4a3c] mb-0.5 sm:mb-1 md:mb-2"
                    style={{ fontFamily: '"Playfair Display", serif', fontWeight: 400 }}
                  >
                    {herbs}+
                  </p>
                  <p
                    className="text-[7px] sm:text-[9px] md:text-[10px] lg:text-xs tracking-[0.03em] sm:tracking-[0.08em] md:tracking-[0.1em] uppercase text-[#6f4a3c]"
                    style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 400 }}
                  >
                    HERBS
                  </p>
                </div>
                <div className="text-center">
                  <p
                    className="text-sm sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-[#6f4a3c] mb-0.5 sm:mb-1 md:mb-2"
                    style={{ fontFamily: '"Playfair Display", serif', fontWeight: 400 }}
                  >
                    {customers.toLocaleString()}+
                  </p>
                  <p
                    className="text-[7px] sm:text-[9px] md:text-[10px] lg:text-xs tracking-[0.03em] sm:tracking-[0.08em] md:tracking-[0.1em] uppercase text-[#6f4a3c]"
                    style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 400 }}
                  >
                    CUSTOMERS
                  </p>
                </div>
                <div className="text-center">
                  <p
                    className="text-sm sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-[#6f4a3c] mb-0.5 sm:mb-1 md:mb-2"
                    style={{ fontFamily: '"Playfair Display", serif', fontWeight: 400 }}
                  >
                    {years}+
                  </p>
                  <p
                    className="text-[7px] sm:text-[9px] md:text-[10px] lg:text-xs tracking-[0.03em] sm:tracking-[0.08em] md:tracking-[0.1em] uppercase text-[#6f4a3c]"
                    style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 400 }}
                  >
                    YEARS
                  </p>
                </div>
              </motion.div>

              {/* Shop Now Button */}
              <motion.button
                onClick={openBuyModal}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="cursor-pointer px-4 py-3 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-[#f5e6d3] text-[#6f4a3c] text-[9px] sm:text-xs md:text-sm font-semibold tracking-wide uppercase hover:bg-[#f0dcc5] hover:shadow-lg transition-all shadow-md active:scale-95 mt-2 sm:mt-3 md:mt-4 w-auto mx-auto"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Shop Now
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
