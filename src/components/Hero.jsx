
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";

const Hero = () => {
    const { openBuyModal } = useCart();

    return (
        <section className="relative h-screen min-h-[600px] sm:min-h-[700px] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0 overflow-hidden">
            <img
                src="/hero_bg_n.avif"
                alt="Meela hair oil"
                className="w-full h-full object-cover transition-all duration-700 ease-out"
                style={{
                objectPosition: 'center center',
                minHeight: '100%',
                }}
            />
            {/* Subtle overlay for better text readability - darker on desktop */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/20 md:from-black/25 md:via-black/10 md:to-black/30 lg:from-black/30 lg:via-black/15 lg:to-black/35"></div>
            </div>

            {/* Content - Centered */}
            <div className="relative z-10 w-full h-full px-4 sm:px-6 md:px-8 lg:px-12 flex items-end justify-center pb-8 sm:pb-12 md:pb-16 lg:pb-20">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-5xl text-center space-y-4 sm:space-y-5 md:space-y-4"
            >
                {/* Main Title */}
                <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold leading-tight"
                style={{ 
                    fontFamily: "'Playfair Display', serif",
                    color: '#ffffffff',
                    // textShadow: `
                    //     0 0 3px rgba(201, 169, 97, 0.9),
                    //     0 0 5px rgba(201, 169, 97, 0.7),
                    //     2px 2px 4px rgba(0, 0, 0, 1),
                    //     0 0 2px rgba(201, 169, 97, 1),
                    //     -1px -1px 2px rgba(0, 0, 0, 0.8)
                    // `
                }}
                >
                Meela Hair Growth Oil
                </motion.h1>

                {/* Description */}
                <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xs sm:text-sm lg:text-md leading-relaxed max-w-2xl mx-auto px-4"
                style={{ 
                    fontFamily: "'Poppins', sans-serif",
                    color: '#ffffffff',
                    // textShadow: `
                    //     0 0 2px rgba(212, 184, 150, 0.8),
                    //     0 0 4px rgba(212, 184, 150, 0.6),
                    //     1px 1px 3px rgba(0, 0, 0, 1),
                    //     0 0 1px rgba(212, 184, 150, 1),
                    //     -1px -1px 2px rgba(0, 0, 0, 0.7)
                    // `
                }}
                >
                Guaranteed Results for your hair problems 

                {/* Crafted with 65+ powerful herbs, our ISO & GMP certified Ayurvedic hair oil strengthens roots, fights dandruff, and promotes healthy hair growth naturally. */}
                </motion.p>

                {/* Price */}
                <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-xl md:text-2xl lg:text-3xl font-semibold"
                style={{ 
                    fontFamily: "'Playfair Display', serif",
                    color: '#ffffffff',
                    // textShadow: `
                    //     0 0 3px rgba(201, 169, 97, 0.9),
                    //     0 0 5px rgba(201, 169, 97, 0.7),
                    //     2px 2px 4px rgba(0, 0, 0, 1),
                    //     0 0 2px rgba(201, 169, 97, 1),
                    //     -1px -1px 2px rgba(0, 0, 0, 0.8)
                    // `
                }}
                >
                AED 55.00
                </motion.div>

                {/* Buy Now Button */}
                <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                onClick={openBuyModal}
                whileHover={{ 
                    scale: 1.06,
                    backgroundColor: "rgba(84, 84, 84, 0.1)",
                    boxShadow: "0 4px 15px rgba(255, 255, 255, 0.2)",
                    transition: { duration: 0.3, ease: "easeOut" }
                }}
                whileTap={{ scale: 0.96 }}
                className="cursor-pointer mt-2 sm:mt-4 px-8 sm:px-10 lg:px-12 py-3 sm:py-3.5 md:py-4 lg:py-4 text-sm sm:text-base lg:text-md font-bold uppercase tracking-wider transition-all duration-300 relative overflow-hidden bg-transparent"
                style={{ 
                    fontFamily: "'Poppins', sans-serif",
                    color: '#C9A961',
                    textShadow: '0 0 2px rgba(255, 255, 255, 0.3)',
                    border: '2px solid #C9A961',
                    boxShadow: '0 2px 8px rgba(255, 255, 255, 0.15)'
                }}
                >
                <span className="relative z-10">BUY NOW</span>
                </motion.button>
            </motion.div>
            </div>

            {/* Guarantee Image - Right Bottom */}
            <div className="absolute top-10 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 lg:bottom-10 lg:right-10 xl:bottom-12 xl:right-12 z-20">
            <img
                src="https://res.cloudinary.com/dvaxoo30e/image/upload/v1764508746/guaranteebg_uqyhb8.png"
                alt="Guarantee"
                className="w-16 h-auto sm:w-20 md:w-24 lg:w-28 xl:w-32 drop-shadow-lg"
                style={{
                objectFit: "contain",
                transform: "rotate(15deg)",
                filter: "brightness(0) saturate(100%) invert(15%) sepia(85%) saturate(5000%) hue-rotate(355deg) brightness(85%) contrast(110%)",
                }}
            />
            </div>
        </section>
        );
};

export default Hero;
