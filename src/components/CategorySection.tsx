import React, { useRef } from 'react';
import { CategoryItem } from '../types';

interface CategorySectionProps {
  category: CategoryItem;
  index: number;
  total: number;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  index,
  total,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  return (
    <section
      ref={sectionRef}
      id={category.id}
      data-category-id={category.id}
      className="category-section relative w-full h-screen min-h-[660px] overflow-hidden flex items-center justify-center bg-[#2B0B14] select-none pt-24 sm:pt-28 scroll-mt-24 sm:scroll-mt-28"
    >
      {/* Background Image Container with Smooth Zoom & Parallax */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {category.imageUrl && (
          <img
            ref={imageRef}
            src={category.imageUrl}
            alt={`Char Chand Haute Couture ${category.name}`}
            className="category-image w-full h-full object-cover object-center transform scale-100 transition-transform duration-1000 ease-out will-change-transform"
            loading={index === 0 ? 'eager' : 'lazy'}
            decoding="async"
          />
        )}

        {/* Subtle Luxury Editorial Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2B0B14]/80 via-[#2B0B14]/35 to-[#2B0B14]/40 transition-opacity duration-700 pointer-events-none" />
        <div className="absolute inset-0 bg-[#3E101D]/20 mix-blend-multiply pointer-events-none" />
      </div>

      {/* Magazine Cover Category Title & Explore CTA */}
      <a
        ref={ctaRef}
        href={category.shopUrl}
        target="_blank"
        rel="noopener noreferrer"
        id={`category-cover-${category.id}`}
        className="group relative z-10 flex flex-col items-center justify-center text-center px-6 py-12 max-w-4xl cursor-pointer focus:outline-none"
        aria-label={`Explore ${category.name} collection on Char Chand Shopify store`}
      >
        {/* Category Name */}
        <h2
          ref={titleRef}
          className="category-title font-italiana text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-[#FBF9F5] tracking-[0.12em] uppercase font-normal drop-shadow-md transition-all duration-700 group-hover:tracking-[0.15em] group-hover:-translate-y-1.5"
        >
          {category.name}
        </h2>

        {/* High-Contrast Radiance Luxury Action Button ("Battan") */}
        <div className="category-arrow mt-8 sm:mt-10 flex items-center justify-center">
          <span
            id={`btn-explore-${category.id}`}
            className="inline-flex items-center space-x-3 sm:space-x-4 px-7 sm:px-10 py-3.5 sm:py-4 bg-[#FBF9F5] text-[#3E101D] border-2 border-[#FBF9F5] hover:bg-[#3E101D] hover:text-[#FBF9F5] hover:border-[#FBF9F5] shadow-[0_12px_36px_rgba(0,0,0,0.55)] transition-all duration-300 group-hover:scale-105 cursor-pointer"
          >
            <span className="font-nav text-[11px] sm:text-[12.5px] tracking-[0.3em] uppercase font-semibold whitespace-nowrap">
              SHOP {category.name}
            </span>
            <span className="text-sm sm:text-base font-light transition-transform duration-300 group-hover:translate-x-1.5">
              →
            </span>
          </span>
        </div>
      </a>

      {/* Subtle Corner Index Indicator (e.g., 01 / 05) */}
      <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-10 pointer-events-none flex items-center space-x-2">
        <span className="font-nav text-[10px] md:text-[11px] tracking-[0.3em] text-[#FBF9F5]/60 font-light">
          {category.indexNumber}
        </span>
        <span className="w-6 h-[1px] bg-[#FBF9F5]/30" />
        <span className="font-nav text-[10px] md:text-[11px] tracking-[0.3em] text-[#FBF9F5]/40 font-light">
          0{total}
        </span>
      </div>

      {/* Subtle Bottom Scroll Cue on First Section */}
      {index === 0 && (
        <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 z-10 pointer-events-none hidden sm:flex items-center space-x-2 text-[#FBF9F5]/50 animate-pulse">
          <span className="font-nav text-[9px] tracking-[0.3em] uppercase">
            SCROLL
          </span>
          <span className="text-xs">↓</span>
        </div>
      )}
    </section>
  );
};
