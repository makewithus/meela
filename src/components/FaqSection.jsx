import SectionWrapper from "./SectionWrapper";
import { faqs } from "../data/faqs";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="bg-white py-8 sm:py-10 md:py-12 lg:py-16">
      <SectionWrapper>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16 text-[#6f4a3c]"
            style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 700,
            }}
          >
            Frequently Asked Questions
          </motion.h2>

          {/* FAQ Grid */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-x-8 lg:gap-x-12 md:items-start">
            {faqs.map((f, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white rounded-xl border border-[#6f4a3c]/10 hover:border-[#6f4a3c]/30 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md h-auto"
              >
                <button
                  onClick={() => setOpenIndex(idx === openIndex ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 md:p-6 cursor-pointer group"
                >
                  <div className="flex justify-between items-start gap-3 sm:gap-4">
                    <span
                      className="text-sm sm:text-base md:text-lg text-[#6f4a3c] leading-relaxed flex-1 font-semibold group-hover:text-[#8b5e4a] transition-colors"
                      style={{
                        fontFamily: '"Playfair Display", serif',
                      }}
                    >
                      {f.q}
                    </span>
                    
                    {/* Dropdown/Dropup Icon */}
                    <motion.div
                      animate={{ rotate: openIndex === idx ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="flex-shrink-0 mt-1"
                    >
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6 text-[#6f4a3c] group-hover:text-[#8b5e4a] transition-colors"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </motion.div>
                  </div>

                  <AnimatePresence>
                    {openIndex === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 border-t border-[#6f4a3c]/10">
                          <p
                            className="text-xs sm:text-sm md:text-base text-[#6f4a3c]/80 leading-relaxed"
                            style={{ fontFamily: '"Poppins", sans-serif' }}
                          >
                            {f.a}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default FaqSection;
