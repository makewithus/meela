import { motion } from "framer-motion";

const Footer = () => {
  // Smooth scroll function
  const scrollToSection = (sectionId) => {
    if (sectionId === 'top') {
      // Scroll to top of page (hero section)
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      // Scroll to specific section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  return (
    <footer className="relative bg-[#f5f0ea] mt-0">
      
      {/* TOP WAVES */}
      <div className="relative w-full overflow-hidden h-[90px] md:h-[100px]">
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          {/* Wave Layer 1 */}
          <motion.path
            fill="#f5f0ea"
            initial={{ d: "M0,60 Q360,90 720,60 T1440,60 L1440,0 L0,0 Z" }}
            animate={{
              d: [
                "M0,60 Q360,90 720,60 T1440,60 L1440,0 L0,0 Z",
                "M0,60 Q360,20 720,60 T1440,60 L1440,0 L0,0 Z",
                "M0,60 Q360,90 720,60 T1440,60 L1440,0 L0,0 Z",
              ],
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="opacity-100"
          />

          {/* Wave Layer 2 */}
          <motion.path
            fill="#f5f0ea"
            opacity="0.6"
            initial={{ d: "M0,70 Q360,40 720,70 T1440,70 L1440,0 L0,0 Z" }}
            animate={{
              d: [
                "M0,70 Q360,40 720,70 T1440,70 L1440,0 L0,0 Z",
                "M0,70 Q360,110 720,70 T1440,70 L1440,0 L0,0 Z",
                "M0,70 Q360,40 720,70 T1440,70 L1440,0 L0,0 Z",
              ],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </div>

      <div className="px-5 md:px-12 pb-2 pt-0 max-w-8xl mx-auto">

        {/* Main 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* LEFT COLUMN - Sitemap, Shop, Connect */}
          <div className="flex gap-6 lg:gap-8 justify-center md:justify-start">
            {/* Sitemap */}
            <div>
              <h3 className="text-sm font-semibold text-[#6f4a3c] mb-2" style={{ fontFamily: '"Poppins", sans-serif' }}>
                Sitemap
              </h3>
              <ul className="space-y-1 text-xs text-[#6f4a3c]/75" style={{ fontFamily: '"Poppins", sans-serif' }}>
                <li>
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('top');
                    }}
                    className="hover:text-[#6f4a3c] transition-colors cursor-pointer"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a 
                    href="#product" 
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('product');
                    }}
                    className="hover:text-[#6f4a3c] transition-colors cursor-pointer"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a 
                    href="#contact" 
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('contact');
                    }}
                    className="hover:text-[#6f4a3c] transition-colors cursor-pointer"
                  >
                    Contact
                  </a>
                </li>
                {/* <li><a href="#" className="hover:text-[#6f4a3c] transition-colors">Products</a></li>
                <li><a href="#" className="hover:text-[#6f4a3c] transition-colors">Blogs</a></li> */}
              </ul>
            </div>

            {/* Shop */}
            {/* <div>
              <h3 className="text-sm font-semibold text-[#6f4a3c] mb-2" style={{ fontFamily: '"Poppins", sans-serif' }}>
                Shop
              </h3>
              <ul className="space-y-1 text-xs text-[#6f4a3c]/75" style={{ fontFamily: '"Poppins", sans-serif' }}>
                <li><a href="#" className="hover:text-[#6f4a3c] transition-colors">Skincare</a></li>
                <li><a href="#" className="hover:text-[#6f4a3c] transition-colors">Haircare</a></li>
                <li><a href="#" className="hover:text-[#6f4a3c] transition-colors">Bodycare</a></li>
              </ul>
            </div> */}

            {/* Connect */}
            <div>
              <h3 className="text-sm font-semibold text-[#6f4a3c] mb-2" style={{ fontFamily: '"Poppins", sans-serif' }}>
                Connect with Us
              </h3>
              <ul className="space-y-1 text-xs text-[#6f4a3c]/75" style={{ fontFamily: '"Poppins", sans-serif' }}>
                <li><a href="" className="hover:text-[#6f4a3c] transition-colors">WhatsApp</a></li>
                <li><a href="mailto:meelaherbals@gmail.com" className="hover:text-[#6f4a3c] transition-colors">Email</a></li>
                <li><a href="https://www.instagram.com/p/DPwTUARkig_/?igsh=MXh0YmQwY2ZsYTFiZA==" className="hover:text-[#6f4a3c] transition-colors">Instagram</a></li>
                <li><a href="" className="hover:text-[#6f4a3c] transition-colors">Facebook</a></li>
                <li><a href="" className="hover:text-[#6f4a3c] transition-colors">YouTube</a></li>
              </ul>
            </div>
          </div>

          {/* CENTER COLUMN - Logo & Badges */}
          <div className="flex flex-col items-center justify-start lg:mx-auto">
            <img
              src="https://res.cloudinary.com/dvaxoo30e/image/upload/v1764607849/footer-logo_tlfsta.webp"
              alt="Meela Logo"
              className="h-28 md:h-28 mb-1"
            />
            <p className="text-xs italic text-[#6f4a3c]/70 mb-4" style={{ fontFamily: '"Playfair Display", serif' }}>
              Pure. Natural. Radiant
            </p>

            <div className="flex flex-wrap gap-3 justify-center max-w-xs"> 
              <img src="/chemical_free-icon.webp" alt="Chemical Free" className="h-10 opacity-80" />
              <img src="/ayurvedic-icon.webp" alt="Ayurvedic" className="h-10 opacity-80" />
              <img src="/gmp-icon.webp" alt="GMP" className="h-10 opacity-80" /> 
              <img src="/iso-icon.webp" alt="ISO" className="h-10 opacity-80" />
            </div>
          </div>

          {/* RIGHT COLUMN - Company Info */}
          <div className="space-y-4 text-[12px] md:text-xs text-[#6f4a3c]/75 leading-relaxed lg:text-right" style={{ fontFamily: '"Poppins", sans-serif' }}>
            {/* <div>
              <p className="font-semibold text-[#6f4a3c] mb-1.5">
                Manufactured & Marketed By
              </p>
              <p>Herbland Cosmetics and Manufacturer</p>
              <p>Naluthara, Palloor, Mahe—673310</p>
              <p>Puducherry, India</p>
              <p>Mfg. Lic. No.: 22174389</p>
            </div> */}

            <div>
              <p className="font-semibold text-[#6f4a3c] mb-1.5">
                Imported & Distributed By
              </p>
              <p>Noor Al Khair General Trading LLC - S.P.C</p>
              <p>Al Nahyan, East 22_2_0; Building</p>
              <p>Al Jazira Sports and Cultural Club</p>
              <p>Abu Dhabi</p>
            </div>
          </div>

        </div>

        {/* COPYRIGHT */}

      </div>
        <div className="mt-8 pt-5 border-t border-[#6f4a3c]/20 text-center">
          <p className="text-[10px] md:text-xs text-[#6f4a3c]/60">
            © 2025 MEELA, Herbland Cosmetics and Manufacturers. All rights reserved.
            Developed by <a href="https://makewithus.in" target="_blank">makewithus</a>

          </p>

          <div className="flex justify-center gap-3 mt-2 text-[10px] md:text-xs text-[#6f4a3c]/60">
            Privacy Policy
            <span>|</span>
            Refund Policy
            <span>|</span>
            Terms & Conditions
          </div>
        </div>
    </footer>
  );
};

export default Footer;
