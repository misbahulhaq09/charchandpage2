import React from 'react';
import { BounceCards } from './BounceCards';

const LOOKBOOK_ITEMS = [
  {
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=2400&auto=format&fit=crop',
    label: 'Indo Western Couture',
    link: 'https://shop.charchand.in/collections/indo-western',
    alt: 'Indo Western Couture Collection',
  },
  {
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=2400&auto=format&fit=crop',
    label: 'Traditional Royal Suits',
    link: 'https://shop.charchand.in/collections/traditional-suits',
    alt: 'Traditional Suits Collection',
  },
  {
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2400&auto=format&fit=crop',
    label: "Men's Formal Bespoke",
    link: 'https://shop.charchand.in/collections/mens-formal',
    alt: "Men's Formal Collection",
  },
  {
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2400&auto=format&fit=crop',
    label: "Women's Formal Eveningwear",
    link: 'https://shop.charchand.in/collections/womens-formal',
    alt: "Women's Formal Collection",
  },
  {
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=2400&auto=format&fit=crop',
    label: 'Haute Parfumerie',
    link: 'https://shop.charchand.in/collections/perfumes',
    alt: 'Haute Parfumerie Collection',
  },
  {
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=2400&auto=format&fit=crop',
    label: 'Fine High Jewellery',
    link: 'https://shop.charchand.in/collections/jewellery',
    alt: 'Fine Jewellery Collection',
  },
  {
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=2400&auto=format&fit=crop',
    label: 'Artisan Leather Bags',
    link: 'https://shop.charchand.in/collections/bags',
    alt: 'Artisan Bags Collection',
  },
];

const CATEGORY_IDS = [
  'indo-western',
  'traditional-suits',
  'mens-formal',
  'womens-formal',
  'perfumes',
  'jewellery',
  'bags',
];

export const AtelierLookbook: React.FC<{
  activeCategory?: string;
  onCategoryChange?: (id: string) => void;
}> = ({ activeCategory, onCategoryChange }) => {
  const selectedIndex = activeCategory
    ? CATEGORY_IDS.indexOf(activeCategory) !== -1
      ? CATEGORY_IDS.indexOf(activeCategory)
      : undefined
    : undefined;

  const handleActiveChange = (idx: number) => {
    if (idx >= 0 && idx < CATEGORY_IDS.length && onCategoryChange) {
      onCategoryChange(CATEGORY_IDS[idx]);
    }
  };

  const images = LOOKBOOK_ITEMS.map((item) => item.image);
  const labels = LOOKBOOK_ITEMS.map((item) => item.label);
  const links = LOOKBOOK_ITEMS.map((item) => item.link);

  return (
    <section
      id="lookbook-section"
      className="relative w-full pt-28 sm:pt-36 md:pt-42 pb-16 sm:pb-24 px-3 sm:px-6 lg:px-12 bg-[#20070E] text-[#FBF9F5] border-b border-[#3E101D]/40 overflow-hidden"
    >
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[700px] h-[400px] sm:h-[500px] bg-[#3E101D]/25 blur-[100px] sm:blur-[120px] pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center mb-5 sm:mb-8 md:mb-12">
          <span className="font-nav text-[9px] sm:text-[11px] tracking-[0.35em] sm:tracking-[0.4em] uppercase text-[#E6CA85] font-semibold block mb-2 sm:mb-3">
            INTERACTIVE BOUNCE CARDS LOOKBOOK
          </span>
          <h2 className="font-brand text-2xl sm:text-4xl lg:text-5xl tracking-[0.16em] sm:tracking-[0.2em] font-normal text-[#FBF9F5] uppercase">
            ATELIER COMPENDIUM
          </h2>
        </div>

        {/* React Bits BounceCards Component with Mobile Gestures & Controls */}
        <div className="w-full flex justify-center items-center py-2 sm:py-4 min-h-[380px] sm:min-h-[440px] overflow-visible">
          <BounceCards
            className="atelier-bounce-cards"
            images={images}
            labels={labels}
            links={links}
            containerWidth="100%"
            containerHeight={420}
            animationDelay={0.15}
            animationStagger={0.06}
            easeType="elastic.out(1, 0.65)"
            enableHover={true}
            selectedCardIndex={selectedIndex}
            onActiveChange={handleActiveChange}
            onCardClick={(idx) => {
              handleActiveChange(idx);
              if (links[idx]) {
                window.open(links[idx], '_blank', 'noopener,noreferrer');
              }
            }}
          />
        </div>

        {/* Sub-caption with direct link */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-between w-full text-[10px] sm:text-[11px] font-nav tracking-[0.2em] sm:tracking-[0.25em] text-[#FBF9F5]/60 uppercase pt-5 sm:pt-6 border-t border-[#FBF9F5]/10 space-y-2 sm:space-y-0 text-center sm:text-left">
          <span>7 HAUTE DISCIPLINES</span>
          <span className="hidden sm:inline">POWERED BY GSAP & REACT BITS</span>
          <a
            href="https://shop.charchand.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#E6CA85] hover:underline font-medium"
          >
            EXPLORE COMPLETE ARCHIVE →
          </a>
        </div>
      </div>
    </section>
  );
};

export default AtelierLookbook;
