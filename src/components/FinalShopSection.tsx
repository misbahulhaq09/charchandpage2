import React from 'react';

export const FinalShopSection: React.FC = () => {
  return (
    <section
      id="shop-section"
      className="final-shop-section relative w-full min-h-[75vh] sm:min-h-[85vh] flex flex-col items-center justify-between px-4 sm:px-6 py-16 sm:py-24 md:py-32 bg-[#FBF9F5] text-[#3E101D] select-none"
    >
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center my-auto">
        {/* Brand identity */}
        <span className="font-brand text-2xl sm:text-3xl lg:text-4xl tracking-[0.25em] sm:tracking-[0.3em] font-normal mb-2 text-[#3E101D]">
          CHAR CHAND
        </span>
        <span className="font-nav text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.35em] sm:tracking-[0.4em] uppercase text-[#3E101D]/70 mb-8 sm:mb-12">
          HAUTE COUTURE
        </span>

        {/* Minimal Thin Separator */}
        <div className="w-12 h-[1px] bg-[#3E101D]/20 mb-8 sm:mb-12" />

        {/* FINAL SHOP CTA: "SHOP THE COLLECTION" */}
        <a
          id="final-shop-collection-cta"
          href="https://shop.charchand.in"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-flex items-center justify-center px-6 sm:px-10 md:px-14 py-4 sm:py-5 border border-[#260710] bg-[#260710] hover:bg-[#3D0F1E] text-[#FBF9F5] transition-all duration-500 overflow-hidden shadow-lg w-full max-w-xs sm:max-w-none sm:w-auto"
        >
          <span className="relative z-10 font-nav text-[10.5px] sm:text-[12px] md:text-[14px] tracking-[0.25em] sm:tracking-[0.35em] uppercase font-medium whitespace-nowrap">
            SHOP THE COLLECTION
          </span>
          <span className="relative z-10 ml-3 sm:ml-4 transform transition-transform duration-500 group-hover:translate-x-2 text-sm sm:text-base">
            →
          </span>
        </a>

        {/* Sub-label showing direct domain */}
        <a
          href="https://shop.charchand.in"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 sm:mt-6 font-nav text-[9.5px] sm:text-[10px] tracking-[0.25em] sm:tracking-[0.3em] uppercase text-[#3E101D]/50 hover:text-[#3E101D] transition-colors"
        >
          SHOP.CHARCHAND.IN
        </a>
      </div>

      {/* Minimal Footer Line */}
      <footer className="w-full max-w-6xl mx-auto pt-10 sm:pt-16 flex flex-col sm:flex-row items-center justify-between text-[#3E101D]/45 border-t border-[#3E101D]/10 text-[9px] sm:text-[10px] font-nav tracking-[0.2em] sm:tracking-[0.25em] uppercase space-y-3 sm:space-y-0 text-center">
        <span>© CHAR CHAND</span>
        <span>HAUTE COUTURE · NEW DELHI</span>
        <a
          href="https://shop.charchand.in"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#3E101D] transition-colors"
        >
          STORE →
        </a>
      </footer>
    </section>
  );
};

export default FinalShopSection;
