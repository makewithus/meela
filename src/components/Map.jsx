import { motion } from "framer-motion";

const Map = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-white w-full h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden shadow-lg px-2 sm:px-4 md:px-8 lg:px-12 xl:px-20 pt-2 sm:pt-4 md:pt-8 lg:pt-12 pb-2 sm:pb-4 md:pb-12 lg:pb-20 xl:pb-28"
    >
      <iframe
        title="Meela Location Map"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31268.823771477634!2d75.5351!3d11.7701!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba43f3b68000001%3A0x1234567890abcdef!2sMahe%2C%20Puducherry!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </motion.div>
  );
};

export default Map;
