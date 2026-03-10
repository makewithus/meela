import { motion } from "framer-motion";

const SectionWrapper = ({ children, className = "", id }) => (
  <motion.section
    id={id}
    className={`py-20 px-4 md:px-12 max-w-6xl mx-auto ${className}`}
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.7 }}
  >
    {children}
  </motion.section>
);

export default SectionWrapper;
