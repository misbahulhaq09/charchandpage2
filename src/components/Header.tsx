import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '../data/categories';

interface HeaderProps {
  activeCategory: string;
  onNavigateTo: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeCategory, onNavigateTo }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 w-full z-50 bg-[#FBF9F5]/96 backdrop-blur-md border-b border-[#3E101D]/12 transition-all duration-300 shadow-[0_4px_24px_rgba(62,16,29,0.03)]`}
    >
      {/* 1. Main Top Tier: Brand Identity & Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between py-3 md:py-4">
        {/* Left Side: Editorial Location / Menu trigger */}
        <div className="flex items-center space-x-4 w-1/4">
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#3E101D] py-1 px-2 border border-[#3E101D]/30 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            <span className="font-nav text-[9.5px] tracking-[0.2em] uppercase font-medium">
              {mobileMenuOpen ? 'CLOSE' : 'MENU'}
            </span>
          </button>
          <span className="hidden md:inline-block font-nav text-[9px] lg:text-[10px] tracking-[0.35em] text-[#3E101D]/60 uppercase whitespace-nowrap">
            PARIS · NEW DELHI
          </span>
        </div>

        {/* Center: Majestic Brand Title (Single line, no wrapping) */}
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
            <span className="font-brand text-2xl sm:text-3xl lg:text-4xl tracking-[0.28em] sm:tracking-[0.32em] text-[#3E101D] font-medium whitespace-nowrap transition-opacity group-hover:opacity-85">
              CHAR CHAND
            </span>
            <span className="font-nav text-[8.5px] sm:text-[9.5px] tracking-[0.45em] text-[#3E101D]/75 font-normal uppercase mt-0.5 whitespace-nowrap">
              HAUTE COUTURE
            </span>
          </a>
        </div>

        {/* Right Side: SHOP NOW Action */}
        <div className="flex items-center justify-end w-1/4">
          <a
            id="header-shop-now-btn"
            href="https://shop.charchand.in"
            target="_blank"
            rel="noopener noreferrer"
            className="font-nav text-[10px] sm:text-[11px] tracking-[0.28em] uppercase px-4 sm:px-5 py-2 border border-[#3E101D] text-[#3E101D] hover:bg-[#3E101D] hover:text-[#FBF9F5] transition-all duration-300 whitespace-nowrap"
          >
            SHOP NOW
          </a>
        </div>
      </div>

      {/* 2. Secondary Tier: Dedicated Category Navigation (Always 100% visible, no cutoff) */}
      <div className="w-full border-t border-[#3E101D]/10 bg-[#FBF9F5]/95 shadow-[0_2px_10px_rgba(62,16,29,0.02)]">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <nav
            id="category-navigation-bar"
            className="flex items-center justify-center flex-wrap py-2 sm:py-2.5 gap-1.5 sm:gap-2 md:gap-3 lg:gap-4"
            aria-label="Category Navigation"
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`nav-link-${cat.id}`}
                  onClick={() => onNavigateTo(cat.id)}
                  className={`font-nav text-[9.5px] sm:text-[10.5px] lg:text-[11px] uppercase tracking-[0.18em] sm:tracking-[0.22em] whitespace-nowrap px-2.5 sm:px-3.5 py-1.5 transition-all duration-200 border rounded-none ${
                    isActive
                      ? 'border-[#3E101D] bg-[#3E101D] text-[#FBF9F5] font-semibold shadow-sm'
                      : 'border-[#3E101D]/20 bg-transparent text-[#3E101D] hover:border-[#3E101D] hover:bg-[#3E101D]/5'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* 3. Mobile Slide-down Menu Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-category-menu"
          className="md:hidden bg-[#FBF9F5] border-t border-[#3E101D]/15 px-6 py-6 shadow-xl transition-all"
        >
          <div className="flex flex-col space-y-4">
            <span className="font-nav text-[9px] tracking-[0.3em] uppercase text-[#3E101D]/50 border-b border-[#3E101D]/10 pb-2">
              SELECT COLLECTION
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                id={`mobile-nav-${cat.id}`}
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateTo(cat.id);
                }}
                className={`text-left font-nav text-[12px] uppercase tracking-[0.25em] py-2 flex items-center justify-between border-b border-[#3E101D]/10 ${
                  activeCategory === cat.id
                    ? 'text-[#3E101D] font-semibold'
                    : 'text-[#3E101D]/75'
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-xs font-light">→</span>
              </button>
            ))}
            <a
              href="https://shop.charchand.in"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-center font-nav text-[11px] tracking-[0.3em] uppercase py-3 border border-[#3E101D] bg-[#3E101D] text-[#FBF9F5]"
            >
              VISIT ONLINE STORE
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
