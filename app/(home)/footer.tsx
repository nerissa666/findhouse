export const Footer = () => {
  return (
    <footer
      className={`w-full py-1 border-t border-white/10 relative z-10 transition-all duration-700  "opacity-100" `}
      style={{ transitionDelay: "800ms" }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <p className="text-xs text-[#000] text-balance">
            Copyright © {new Date().getFullYear()} FindHouse. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
