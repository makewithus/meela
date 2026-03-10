import SectionWrapper from "./SectionWrapper";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { db } from "../firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Structure contact form data for Firestore
      const contactData = {
        name: {
          first: formData.firstName.trim(),
          last: formData.lastName.trim(),
          full: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
        },
        email: formData.email.trim().toLowerCase(),
        mobile: formData.mobile.trim(),
        message: formData.message.trim(),
        submittedAt: Timestamp.now(),
        status: "new",
      };

      // Save to Firestore
      await addDoc(collection(db, "contacts"), contactData);
      
      setSuccess(true);
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        message: "",
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      console.error("Error submitting contact form:", err);
      setError("Unable to send message. Please try again later.");
      
      // Clear error after 5 seconds
      setTimeout(() => {
        setError("");
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white py-6 sm:py-8 md:py-10 lg:py-12">
      <SectionWrapper id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 xl:gap-20">
            {/* Left Side - Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-4 sm:space-y-5 md:space-y-6"
            >
              <h2
                className="text-2xl text-center sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-[#6f4a3c] mb-4 sm:mb-5 md:mb-6"
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 700,
                }}
              >
                Contact Us
              </h2>

              <p
                className="text-[11px] sm:text-xs md:text-sm lg:text-base text-[#6f4a3c]/80 leading-relaxed"
                style={{ fontFamily: '"Poppins", sans-serif' }}
              >
                Feel free to use the form or drop us an email. Old-fashioned phone calls work too.
              </p>

              <div className="space-y-2 sm:space-y-3.5 md:space-y-4 pt-2 sm:pt-3 md:pt-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="flex items-start gap-2 sm:gap-2.5 md:gap-3"
                >
                  <span className="text-[#6f4a3c] mt-0.5 sm:mt-1 text-sm sm:text-lg md:text-xl">📞</span>
                  <div>
                    <p
                      className="text-[11px] sm:text-xs md:text-sm lg:text-base text-[#6f4a3c]"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      +971 567116651
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex items-start gap-2 sm:gap-2.5 md:gap-3"
                >
                  <span className="text-[#6f4a3c] mt-0.5 sm:mt-1 text-sm sm:text-lg md:text-xl">✉️</span>
                  <div>
                    <p
                      className="text-[11px] sm:text-xs md:text-sm lg:text-base text-[#6f4a3c] break-words"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      meelaherbals@gmail.com
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex items-start gap-2 sm:gap-2.5 md:gap-3"
                >
                  <span className="text-[#6f4a3c] mt-0.5 sm:mt-1 text-sm sm:text-lg md:text-xl">📍</span>
                  <div>
                    <p
                      className="text-[11px] sm:text-xs md:text-sm lg:text-base text-[#6f4a3c] leading-relaxed"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      Noor Al Khair General Trading LLC - S.P.C<br/>
              Al Nahyan, East 22_2_0; Building<br/>
              Al Jazira Sports and Cultural Club<br/>
              Abu Dhabi
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Side - Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5 md:space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5 md:gap-4">
                  <motion.input
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                    required
                    className="px-3 sm:px-4 md:px-5 py-2.5 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl border border-[#6f4a3c]/40 focus:border-[#6f4a3c]/70 focus:outline-none transition-colors duration-300 text-sm sm:text-base min-h-[44px] sm:min-h-[48px]"
                    style={{ fontFamily: '"Poppins", sans-serif' }}
                  />
                  <motion.input
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                    required
                    className="px-3 sm:px-4 md:px-5 py-2.5 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl border border-[#6f4a3c]/40 focus:border-[#6f4a3c]/70 focus:outline-none transition-colors duration-300 text-sm sm:text-base min-h-[44px] sm:min-h-[48px]"
                    style={{ fontFamily: '"Poppins", sans-serif' }}
                  />
                </div>

                <motion.input
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email address"
                  required
                  className="w-full px-3 sm:px-4 md:px-5 py-2.5 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl border border-[#6f4a3c]/40 focus:border-[#6f4a3c]/70 focus:outline-none transition-colors duration-300 text-sm sm:text-base min-h-[44px] sm:min-h-[48px]"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                />

                <motion.input
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Mobile Number"
                  required
                  className="w-full px-3 sm:px-4 md:px-5 py-2.5 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl border border-[#6f4a3c]/40 focus:border-[#6f4a3c]/70 focus:outline-none transition-colors duration-300 text-sm sm:text-base min-h-[44px] sm:min-h-[48px]"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                />

                <motion.textarea
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message..."
                  required
                  rows={4}
                  className="w-full px-3 sm:px-4 md:px-5 py-2.5 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl border border-[#6f4a3c]/40 focus:border-[#6f4a3c]/70 focus:outline-none resize-none transition-colors duration-300 text-sm sm:text-base"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                />

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-6 sm:px-7 md:px-8 py-2.5 sm:py-2.5 md:py-3 rounded-lg bg-[#6f4a3c] text-white hover:bg-[#5d3e31] transition-colors duration-300 text-sm sm:text-base min-h-[44px] sm:min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 500 }}
                >
                  {loading ? "Submitting..." : success ? "✓ Submitted!" : "Submit"}
                </motion.button>

                {/* Success Message */}
                <AnimatePresence>
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <p
                        className="text-green-700 text-xs sm:text-sm"
                        style={{ fontFamily: '"Poppins", sans-serif' }}
                      >
                        ✓ Thank you! Your message has been sent successfully. We'll get back to you soon.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg"
                    >
                      <p
                        className="text-red-700 text-xs sm:text-sm"
                        style={{ fontFamily: '"Poppins", sans-serif' }}
                      >
                        {error}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default ContactSection;
