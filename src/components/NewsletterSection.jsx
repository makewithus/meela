import SectionWrapper from "./SectionWrapper";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { db } from "../firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      if (!db) {
        throw new Error("Newsletter service is unavailable offline. Please contact us via WhatsApp to subscribe.");
      }
      // Save to Firestore
      const subscriptionData = {
        email: email.trim().toLowerCase(),
        subscribedAt: Timestamp.now(),
        status: "active",
      };

      await addDoc(collection(db, "newsletter"), subscriptionData);

      setSuccess(true);
      setEmail("");

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Error subscribing to newsletter:", err);
      setError("Unable to subscribe. Please try again later.");

      // Clear error after 3 seconds
      setTimeout(() => {
        setError("");
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#6d4c3d] py-4 sm:py-6 md:py-8 lg:py-10 xl:py-12">
      <SectionWrapper>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2
              className="text-lg sm:text-xl md:text-3xl lg:text-4xl xl:text-5xl text-white mb-2 sm:mb-3 md:mb-4"
              style={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 700,
                letterSpacing: '0.05em',
              }}
            >
              JOIN OUR NEWSLETTER
            </h2>
            <p
              className="text-[10px] sm:text-xs md:text-sm lg:text-base text-white/80 mb-4 sm:mb-5 md:mb-6 lg:mb-8 xl:mb-10"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              Be the first to know about new launches and exclusive offers.
            </p>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onSubmit={handleSubmit}
              className="max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto"
            >
              <div className="relative flex flex-row items-center gap-0 bg-transparent border border-white/40 rounded-full p-1 sm:p-1.5 md:p-2 transition-all duration-300 overflow-hidden"
                style={{
                  borderColor: focused ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.4)',
                }}
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  required
                  className="flex-1 px-2.5 sm:px-3 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3 bg-transparent text-white placeholder:text-white/60 focus:outline-none text-xs sm:text-sm md:text-base min-h-[44px] sm:min-h-[48px] min-w-0"
                  style={{
                    fontFamily: '"Poppins", sans-serif',
                    fontSize: '14px',
                  }}
                />
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="cursor-pointer px-3 sm:px-4 md:px-7 lg:px-8 py-2.5 sm:py-3 md:py-3 rounded-full bg-white text-[#6d4c3d] font-medium tracking-wide hover:bg-white/95 transition-colors duration-300 text-xs sm:text-sm md:text-base min-h-[44px] sm:min-h-[48px] whitespace-nowrap flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  {loading ? "Subscribing..." : success ? "✓ Subscribed!" : "Subscribe"}
                </motion.button>
              </div>

              {/* Success Message */}
              <AnimatePresence>
                {success && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-center mt-3 sm:mt-4 text-white text-xs sm:text-sm"
                    style={{ fontFamily: '"Poppins", sans-serif' }}
                  >
                    ✓ Successfully subscribed to our newsletter!
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-center mt-3 sm:mt-4 text-red-200 text-xs sm:text-sm"
                    style={{ fontFamily: '"Poppins", sans-serif' }}
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.form>
          </motion.div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default NewsletterSection;
