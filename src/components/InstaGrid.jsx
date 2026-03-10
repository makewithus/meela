import SectionWrapper from "./SectionWrapper";
import { FiInstagram } from "react-icons/fi";
import { useRef } from "react";

const instaImages = [
  // First large tall box
  { id: 1, src: "/insta-slide-bg.png", layout: "row-span-2", width: "340px", height: "700px", link: "https://www.instagram.com/p/DQHaoubEgrO/?igsh=MWdlcGJ5czh2MDNrcQ==" },
  // Two stacked boxes
  { id: 2, src: "/insta-slide-bg2.png", layout: "row-span-1", width: "340px", height: "340px", link: "https://www.instagram.com/p/DNic_XUSxhp/?igsh=dGV4cTVqOWt2Z2Vj" },
  { id: 3, src: "/insta-slide-bg3.png", layout: "row-span-1", width: "340px", height: "340px", link: "https://www.instagram.com/p/DQJ5E91krTa/?igsh=MWFuMXZ3c2RodTY4cg==" },
  // Top small box
  { id: 4, src: "/insta-slide-bg4.png", layout: "row-span-1", width: "340px", height: "340px", link: "https://www.instagram.com/p/DP8_zjKkrJG/?igsh=MTRwNm9sZndpYzduNw==" },
  // Bottom wide box (col-span-2)
  { id: 5, src: "/insta-slide-bg8.png", layout: "row-span-1 col-span-2", width: "700px", height: "340px", link: "https://www.instagram.com/p/DQCJtSIDWIv/?igsh=MW1pNjM3cXBqMjdjdw==" },
  { id: 6, src: "/insta-slide-bg6.png", layout: "row-span-1", width: "340px", height: "340px", link: "https://www.instagram.com/p/DQEzzqrEqy3/?igsh=MW9kMDhkcG0zZWoweg==" },
  // Last tall box
  { id: 7, src: "/insta-slide-bg9.png", layout: "row-span-2", width: "340px", height: "700px", link: "https://www.instagram.com/p/DP35fOXkofy/?igsh=MWM5amEyaWx4MHFueQ==" },
  { id: 8, src: "/insta-slide-bg7.png", layout: "row-span-1", width: "340px", height: "340px", link: "https://www.instagram.com/p/DPwTUARkig_/?igsh=MXh0YmQwY2ZsYTFiZA==" },
];

const InstaGrid = () => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -600 : 600;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <SectionWrapper className="bg-cream overflow-hidden max-w-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-serif text-3xl md:text-4xl text-coffee">
          As seen on Instagram
        </h2>
        <a
          href="https://www.instagram.com/meelaherbals/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-coffee hover:text-coffee/70 transition-all"
        >
          <FiInstagram className="w-5 h-5" />
          <span className="font-medium">@meelaherbals</span>
        </a>
      </div>
      
      {/* Scrollable Grid Container */}
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-coffee/90 text-cream items-center justify-center hover:bg-coffee hover:scale-110 transition-all shadow-xl"
          aria-label="Scroll left"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-coffee/90 text-cream items-center justify-center hover:bg-coffee hover:scale-110 transition-all shadow-xl"
          aria-label="Scroll right"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Scrollable Masonry Grid */}
        <div 
          ref={scrollRef}
          className="overflow-x-auto scrollbar-hide scroll-smooth px-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="inline-grid grid-rows-2 grid-flow-col gap-4 pb-4" style={{ height: '700px' }}>
            {instaImages.map((img) => {
              return (
                <a
                  key={img.id}
                  href={img.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`relative overflow-hidden rounded-3xl group cursor-pointer shadow-lg hover:shadow-2xl transition-all ${img.layout}`}
                  style={{ 
                    width: img.width,
                    height: img.height,
                  }}
                >
                  <img
                    src={img.src}
                    alt={`Meela Instagram post ${img.id}`}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-md rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                      <FiInstagram className="w-10 h-10 text-white" />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Follow Button - Mobile */}
      <div className="text-center mt-6 md:hidden">
        <a
          href="https://www.instagram.com/p/DQHaoubEgrO/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-coffee text-cream rounded-full hover:bg-coffee/90 transition-all shadow-lg"
        >
          <FiInstagram className="w-5 h-5" />
          <span className="font-medium">Follow @meelaherbals</span>
        </a>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </SectionWrapper>
  );
};

export default InstaGrid;
