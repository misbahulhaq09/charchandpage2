import React, { useState, useEffect, useRef } from 'react';
import { CATEGORIES } from '../data/categories';

interface HeaderProps {
  activeCategory: string;
  onNavigateTo: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeCategory, onNavigateTo }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navScrollRef = useRef<HTMLElement>(null);

  // Auto-scroll active category button into view on mobile horizontal bar
  useEffect(() => {
    if (!navScrollRef.current) return;
    const activeBtn = navScrollRef.current.querySelector(
      `#nav-link-${activeCategory}`
    ) as HTMLElement;
    if (activeBtn) {
      activeBtn.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeCategory]);

  return (
    <header
      id="main-header"
      className="fixed top-0 left-0 w-full z-50 bg-[#FBF9F5]/96 backdrop-blur-md border-b border-[#3E101D]/12 transition-all duration-300 shadow-[0_4px_24px_rgba(62,16,29,0.03)]"
    >
      {/* 1. Main Top Tier: Brand Identity & Actions */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-12 flex items-center justify-between py-2 sm:py-3 md:py-4">
        {/* Left Side: Editorial Location / Menu trigger */}
        <div className="flex items-center space-x-2 sm:space-x-4 w-1/4">
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#3E101D] min-h-[38px] px-2.5 py-1 border border-[#3E101D]/30 bg-[#FBF9F5] active:bg-[#3E101D]/10 focus:outline-none transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            <span className="font-nav text-[9px] tracking-[0.2em] uppercase font-semibold">
              {mobileMenuOpen ? 'CLOSE' : 'MENU'}
            </span>
          </button>
        </div>

        {/* Center: Majestic Brand Title */}
        <div className="flex-1 flex justify-center text-center">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group flex flex-col items-center justify-center focus:outline-none"
            id="brand-logo-link"
          >
            <span className="font-brand text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-[0.24em] sm:tracking-[0.32em] text-[#3E101D] font-medium whitespace-nowrap transition-opacity group-hover:opacity-85">
              CHAR CHAAND
            </span>
            <span className="font-nav text-[7.5px] sm:text-[9px] tracking-[0.4em] text-[#3E101D]/75 font-normal uppercase mt-0.5 whitespace-nowrap">
              HAUTE COUTURE
            </span>
          </a>
        </div>

        {/* Right Side: SHOP NOW Action */}
        <div className="flex items-center justify-end w-1/4">
          <a
            id="header-shop-now-btn"
            href="https://charchaand-e.myshopify.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-nav text-[9px] sm:text-[10.5px] lg:text-[11px] tracking-[0.2em] sm:tracking-[0.28em] uppercase px-3 sm:px-5 py-2 border border-[#260710] bg-[#260710] text-[#FBF9F5] hover:bg-[#3D0F1E] hover:border-[#3D0F1E] transition-all duration-300 whitespace-nowrap shadow-sm font-medium"
          >
            SHOP NOW
          </a>
        </div>
      </div>

      {/* 2. Secondary Tier: Swipeable Category Navigation on Mobile / Centered on Desktop */}
      <div className="w-full border-t border-[#3E101D]/10 bg-[#FBF9F5]/95 shadow-[0_2px_10px_rgba(62,16,29,0.02)]">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <nav
            ref={navScrollRef}
            id="category-navigation-bar"
            className="flex items-center justify-start md:justify-center overflow-x-auto no-scrollbar py-2 sm:py-2.5 gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 scroll-smooth px-1 sm:px-0"
            aria-label="Category Navigation"
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <a
                  key={cat.id}
                  id={`nav-link-${cat.id}`}
                  href={cat.shopUrl}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateTo(cat.id);
                  }}
                  className={`shrink-0 font-nav text-[9px] sm:text-[10.5px] lg:text-[11px] uppercase tracking-[0.16em] sm:tracking-[0.22em] whitespace-nowrap px-2.5 sm:px-3.5 py-1.5 transition-all duration-200 border rounded-none cursor-pointer ${
                    isActive
                      ? 'border-[#3E101D] bg-[#3E101D] text-[#FBF9F5] font-semibold shadow-sm'
                      : 'border-[#3E101D]/20 bg-transparent text-[#3E101D] hover:border-[#3E101D] hover:bg-[#3E101D]/5'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {cat.name}
                </a>
              );
            })}
          </nav>
        </div>
      </div>

      {/* 3. Mobile Slide-down Menu Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-category-menu"
          className="md:hidden bg-[#FBF9F5] border-t border-[#3E101D]/15 px-6 py-6 shadow-2xl transition-all animate-fadeIn"
        >
          <div className="flex flex-col space-y-3">
            <span className="font-nav text-[9px] tracking-[0.3em] uppercase text-[#3E101D]/50 border-b border-[#3E101D]/10 pb-2">
              SELECT COLLECTION
            </span>
            {CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className={`flex items-center justify-between border-b border-[#3E101D]/10 py-2 px-1 ${
                  activeCategory === cat.id ? 'bg-[#3E101D]/5' : ''
                }`}
              >
                <button
                  id={`mobile-nav-${cat.id}`}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigateTo(cat.id);
                  }}
                  className={`text-left font-nav text-[12px] uppercase tracking-[0.22em] flex-1 py-1 ${
                    activeCategory === cat.id
                      ? 'text-[#3E101D] font-bold'
                      : 'text-[#3E101D]/80'
                  }`}
                >
                  {cat.name}
                </button>
                <a
                  href={cat.shopUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-3 px-2 py-1 border border-[#3E101D]/25 font-nav text-[9px] tracking-[0.2em] uppercase text-[#3E101D] hover:bg-[#3E101D] hover:text-[#FBF9F5] transition-colors"
                  aria-label={`Visit ${cat.name} Collection`}
                >
                  SHOP ↗
                </a>
              </div>
            ))}
            <a
              href="https://charchaand-e.myshopify.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 text-center font-nav text-[11px] tracking-[0.3em] uppercase py-3.5 border border-[#260710] bg-[#260710] text-[#FBF9F5] hover:bg-[#3D0F1E] font-medium shadow-md"
            >
              VISIT ONLINE STORE
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
