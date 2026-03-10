import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

const BuyNowModal = () => {
  const { isBuyModalOpen, closeBuyModal, addToCart, openCheckout, removeFromCart, cartItems } = useCart();
  const [selectedOption, setSelectedOption] = useState("1");

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isBuyModalOpen) {
      // Store the current scroll position
      const scrollY = window.scrollY;
      
      // Prevent scrolling on body
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      // Also prevent scroll on html
      document.documentElement.style.overflow = 'hidden';
      
      return () => {
        // Restore scroll position
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isBuyModalOpen]);

  if (!isBuyModalOpen) return null;

  const proceed = () => {
    // Remove existing item if it exists (to replace with new selection)
    const existingItem = cartItems.find(item => item.id === 'meela-hair-oil');
    if (existingItem) {
      removeFromCart('meela-hair-oil');
    }

    if (selectedOption === "1") {
      // 1 bottle at AED 55
      addToCart({
        id: 'meela-hair-oil',
        name: 'MEELA AYURVDIC Hair Growth Oil',
        price: 55,
        qty: 1,
        image: '/images/product.jpg'
      });
    } else {
      // 2 bottles at AED 47.50 each (total AED 95)
      addToCart({
        id: 'meela-hair-oil',
        name: 'MEELA AYURVDIC Hair Growth Oil',
        price: 47.50,
        qty: 2,
        image: '/images/product.jpg'
      });
    }
    closeBuyModal();
    openCheckout();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-8 overflow-y-auto" 
      style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
      onClick={(e) => {
        // Close modal if clicking on backdrop
        if (e.target === e.currentTarget) {
          closeBuyModal();
        }
      }}
      onTouchMove={(e) => {
        // Prevent scroll on touch devices when touching backdrop
        if (e.target === e.currentTarget) {
          e.preventDefault();
        }
      }}
    >
      <div 
        className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl max-w-3xl w-full shadow-2xl relative my-4 sm:my-6 mx-2 pb-4 sm:mx-4 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeBuyModal}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-[#4a4a4a] text-white rounded-full hover:bg-[#333] transition-all hover:scale-110 shadow-lg active:scale-95"
          aria-label="Close modal"
        >
          <span className="text-lg sm:text-2xl leading-none font-light">×</span>
        </button>

        <div className="grid md:grid-cols-2 overflow-y-auto">
          {/* Left Side - Product Image */}
          <div className="p-2 sm:p-5 md:p-6 flex items-center justify-center bg-gradient-to-br from-[#d4b5a0] to-[#c9a88a] min-h-[140px] sm:min-h-[280px] md:min-h-0">
            <div className="relative w-full max-w-[130px] sm:max-w-[240px] md:max-w-[280px]">
              <div className="absolute inset-0 bg-[#e8d4c0] rounded-full blur-3xl opacity-60"></div>
              <img
                src="https://res.cloudinary.com/dvaxoo30e/image/upload/v1764617790/cart_tbhbky.webp"
                alt="Meela Hair Growth Oil"
                className="relative z-10 w-full max-w-full object-contain drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Right Side - Product Details */}
          <div className="p-2.5 sm:p-5 md:p-6 flex flex-col pt-9 sm:pt-14">
            <h2 
              className="text-base sm:text-lg md:text-xl text-[#4a4a4a] mb-1 sm:mb-2 leading-tight pr-8 sm:pr-10"
              style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700 }}
            >
              MEELA AYURVDIC Hair Growth Oil
            </h2>
            
            <p 
              className="text-[10px] sm:text-xs text-[#6a6a6a] mb-1 sm:mb-3 leading-snug sm:leading-relaxed"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              Crafted with 65+ powerful herbs, our ISO & GMP certified Ayurvedic hair oil strengthens roots, fights dandruff, and promotes healthy hair growth naturally.
            </p>

            <div className="mb-1 sm:mb-3">
              <p 
                className="text-lg sm:text-2xl md:text-3xl font-bold text-[#4a4a4a]"
                style={{ fontFamily: '"Poppins", sans-serif' }}
              >
                AED 55.00
              </p>
            </div>

            <div className="mb-1 sm:mb-3">
              <p 
                className="text-[9px] sm:text-[10px] font-semibold text-[#4a4a4a] mb-1 sm:mb-2.5 md:mb-3 uppercase tracking-wider"
                style={{ fontFamily: '"Poppins", sans-serif' }}
              >
                SELECT QUANTITY
              </p>
              
              {/* Quantity Options */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className={`flex items-center justify-between p-2 sm:p-2.5 md:p-3 border-2 rounded-lg cursor-pointer hover:border-[#6f4a3c] hover:shadow-md transition-all active:scale-[0.98] ${selectedOption === "1" ? "border-[#6f4a3c] bg-[#f7efe6]" : "border-[#e0e0e0]"}`}>
                  <div className="flex items-center gap-1.5 sm:gap-3 flex-1 min-w-0">
                    <input 
                      type="radio" 
                      name="quantity" 
                      value="1"
                      checked={selectedOption === "1"}
                      onChange={(e) => setSelectedOption(e.target.value)}
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#6f4a3c] flex-shrink-0"
                      style={{ accentColor: '#6f4a3c' }}
                    />
                    <div style={{ fontFamily: '"Poppins", sans-serif' }} className="min-w-0 flex-1">
                      <p className="font-semibold text-[#4a4a4a] text-[11px] sm:text-sm">1 Bottle</p>
                      <p className="text-[9px] sm:text-[10px] text-[#6a6a6a] mt-0.5">100ml - AED 55.00</p>
                    </div>
                  </div>
                  <p className="text-base sm:text-lg md:text-xl font-bold text-[#4a4a4a] flex-shrink-0 ml-1" style={{ fontFamily: '"Poppins", sans-serif' }}>AED 55</p>
                </label>

                <label className={`flex items-center justify-between p-2 sm:p-2.5 md:p-3 border-2 rounded-lg cursor-pointer hover:border-[#6f4a3c] hover:shadow-md transition-all relative active:scale-[0.98] ${selectedOption === "2" ? "border-[#6f4a3c] bg-[#f7efe6]" : "border-[#e0e0e0]"}`}>
                  <div className="flex items-center gap-1.5 sm:gap-3 flex-1 min-w-0">
                    <input 
                      type="radio" 
                      name="quantity" 
                      value="2"
                      checked={selectedOption === "2"}
                      onChange={(e) => setSelectedOption(e.target.value)}
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#6f4a3c] flex-shrink-0"
                      style={{ accentColor: '#6f4a3c' }}
                    />
                    <div style={{ fontFamily: '"Poppins", sans-serif' }} className="min-w-0 flex-1">
                      <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                        <p className="font-semibold text-[#4a4a4a] text-[11px] sm:text-sm">2 Bottles</p>
                        <span className="bg-[#d9534f] text-white text-[8px] sm:text-[9px] font-bold px-1 sm:px-2 py-0.5 rounded-md whitespace-nowrap">SAVE AED 15</span>
                      </div>
                      <p className="text-[9px] sm:text-[10px] text-[#6a6a6a] mt-0.5">AED 47.50 each</p>
                    </div>
                  </div>
                  <p className="text-base sm:text-lg md:text-xl font-bold text-[#5cb85c] flex-shrink-0 ml-1" style={{ fontFamily: '"Poppins", sans-serif' }}>AED 95</p>
                </label>
              </div>
            </div>

            {/* Free Delivery Banner */}
            <div className="mb-1 sm:mb-3 p-1.5 sm:p-2.5 bg-[#d4edda] border-l-4 border-[#5cb85c] rounded-lg">
              <p className="text-[10px] sm:text-xs text-[#155724] font-medium flex items-center gap-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                <span className="text-[11px] sm:text-sm">✓</span> Free delivery all over UAE
              </p>
            </div>

            {/* Buttons */}
            <div className="mt-auto space-y-2 sm:space-y-2 pt-6 sm:pt-2">
              <button
                onClick={proceed}
                className="w-full py-3 sm:py-3 bg-[#4a4a4a] text-white rounded-lg font-semibold text-xs sm:text-sm hover:bg-[#333] transition-all hover:shadow-lg active:scale-95"
                style={{ fontFamily: '"Poppins", sans-serif' }}
              >
                Proceed to Checkout
              </button>
              <button
                onClick={closeBuyModal}
                className="w-full py-2.5 sm:py-3 border-2 border-[#4a4a4a] text-[#4a4a4a] rounded-lg font-semibold text-xs sm:text-sm hover:bg-gray-50 transition-all hover:shadow-md active:scale-95"
                style={{ fontFamily: '"Poppins", sans-serif' }}
              >
                CONTINUE SHOPPING
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyNowModal;
