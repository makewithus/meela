import { useEffect, useState } from "react";

const ScrollTopProgress = () => {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const p = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setPercent(p);
    };
    
    // Throttle scroll events for better performance
    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          onScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", scrollListener, { passive: true });
    return () => window.removeEventListener("scroll", scrollListener);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={handleClick}
      className="cursor-pointer fixed right-4 bottom-4 sm:right-8 sm:bottom-6 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center bg-cream shadow-lg hover:shadow-xl transition-shadow"
      style={{
        backgroundImage: `conic-gradient(#6f4a3c ${percent}%, #e4d1c2 ${percent}% 100%)`,
      }}
    >
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-cream flex items-center justify-center text-2xl sm:text-2xl font-bold text-[#6f4a3c]">
        ↑
      </div>
    </button>
  );
};

export default ScrollTopProgress;
