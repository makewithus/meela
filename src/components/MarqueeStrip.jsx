const items = [
  { text: "ISO CERTIFIED", icon: "/iso-icon.webp" },
  { text: "NATURAL AND CHEMICAL FREE", icon: "/chemical_free-icon.webp" },
  { text: "65+ AYURVEDIC INGREDIENTS", icon: "/ayurvedic-icon.webp" },
  { text: "GMP CERTIFIED", icon: "/gmp-icon.webp" }, 
];

const MarqueeStrip = () => (
  <div className="border-y border-coffee/10 bg-cream">
    <div className="overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee py-2 sm:py-4">
        {[...items, ...items].map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 px-16 text-xs md:text-sm tracking-[0.25em] uppercase"
          >
            <img 
              src={item.icon} 
              alt={item.text} 
              className="w-6 h-6 object-contain"
            />
            <span className="font-semibold">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default MarqueeStrip;
