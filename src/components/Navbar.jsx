import { FiShoppingBag } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useState, useEffect, useRef } from "react";

const Navbar = () => {
  const { openCheckout, getTotalItems } = useCart();
  const location = useLocation();
  const totalItems = getTotalItems();
  const [isVisible, setIsVisible] = useState(true);
  const [hasBackground, setHasBackground] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hero section height - approximately 90vh/100vh
      const heroHeight = window.innerHeight;
      
      // Check if we're at the very top
      const atTop = currentScrollY < 10;
      
      // Check if we're in the hero section (not at the very top)
      const inHeroSection = currentScrollY >= 10 && currentScrollY <= heroHeight * 0.8;
      
      // Check if we're past the hero section
      const pastHero = currentScrollY > heroHeight * 0.8;
      
      // Determine scroll direction
      const scrollingUp = currentScrollY < lastScrollY.current;
      const scrollingDown = currentScrollY > lastScrollY.current;

      if (atTop) {
        // At the very top: show navbar without background
        setIsVisible(true);
        setHasBackground(false);
      } else if (inHeroSection) {
        // In hero section: always hide navbar (don't show until reaching top)
        setIsVisible(false);
        setHasBackground(false);
      } else if (pastHero) {
        // Past hero section: handle based on scroll direction
        if (scrollingUp) {
          // Scrolling up: show navbar with solid white background
          setIsVisible(true);
          setHasBackground(true);
        } else if (scrollingDown) {
          // Scrolling down: hide navbar
          setIsVisible(false);
          setHasBackground(false);
        }
      }

      lastScrollY.current = currentScrollY;
    };

    // Initial check on mount
    handleScroll();

    // Add scroll listener with throttling for better performance
    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", scrollListener, { passive: true });

    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, []);

  return (
    <motion.header
        className={`fixed top-0 inset-x-0 z-30 border-b transition-all duration-300 ${
          hasBackground 
            ? "bg-white border-coffee/10" 
            : "bg-transparent border-transparent"
        }`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ 
          y: isVisible ? 0 : -80, 
          opacity: isVisible ? 1 : 0 
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
    >
        <nav className="max-w-8xl mx-auto px-3 sm:px-4 md:px-8 lg:px-16 h-14 sm:h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center">
                <img
                    src="/meela_logo_text.avif"
                    alt="meela"
                    className="h-6 sm:h-7 md:h-8 w-auto"
                    loading="lazy"
                />
            </Link>
{/* Navigation Links */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-6 md:gap-8">
                <Link
                    to="/"
                    className={`text-sm md:text-base font-medium transition-colors ${
                        location.pathname === "/"
                            ? "text-coffee underline decoration-2 underline-offset-4"
                            : "text-coffee/70 hover:text-coffee"
                    }`}
                    style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                    Home
                </Link>
                <Link
                    to="/blog"
                    className={`text-sm md:text-base font-medium transition-colors ${
                        location.pathname.startsWith("/blog")
                            ? "text-coffee underline decoration-2 underline-offset-4"
                            : "text-coffee/70 hover:text-coffee"
                    }`}
                    style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                    Blog
                </Link>
            </div>

            
            <button
                type="button"
                onClick={openCheckout}
                className="relative cursor-pointer p-2 sm:p-2 rounded-full border border-coffee/30 hover:border-coffee hover:bg-cream/30 transition-all active:scale-95"
                aria-label="Shopping cart"
            >
                <FiShoppingBag className="w-5 h-5 sm:w-5 sm:h-5 text-[#6f4a3c]" />
                {totalItems > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-[#6f4a3c] text-white text-[10px] sm:text-xs flex items-center justify-center rounded-full font-semibold"
                    style={{ fontFamily: '"Poppins", sans-serif' }}
                  >
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
            </button>
        </nav>
    </motion.header>
  );
};

export default Navbar;
