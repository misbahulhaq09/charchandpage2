import React from 'react';
import { BounceCards, LookbookCardItem } from './BounceCards';

const LOOKBOOK_ITEMS: LookbookCardItem[] = [
  {
    id: 'indo-western',
    label: 'Indo Western Couture',
    link: 'https://shop.charchand.in/collections/indo-western',
    romanNumeral: 'I',
    discipline: 'Atelier Discipline 01',
    edition: 'Haute Collection',
  },
  {
    id: 'traditional-suits',
    label: 'Traditional Royal Suits',
    link: 'https://shop.charchand.in/collections/traditional-suits',
    romanNumeral: 'II',
    discipline: 'Atelier Discipline 02',
    edition: 'Heritage Suits',
  },
  {
    id: 'mens-formal',
    label: "Men's Formal Bespoke",
    link: 'https://shop.charchand.in/collections/mens-formal',
    romanNumeral: 'III',
    discipline: 'Atelier Discipline 03',
    edition: 'Sartorial Tailoring',
  },
  {
    id: 'womens-formal',
    label: "Women's Formal Eveningwear",
    link: 'https://shop.charchand.in/collections/womens-formal',
    romanNumeral: 'IV',
    discipline: 'Atelier Discipline 04',
    edition: 'Gala & Eveningwear',
  },
  {
    id: 'perfumes',
    label: 'Haute Parfumerie',
    link: 'https://shop.charchand.in/collections/perfumes',
    romanNumeral: 'V',
    discipline: 'Atelier Discipline 05',
    edition: 'Artisanal Scents',
  },
  {
    id: 'jewellery',
    label: 'Fine High Jewellery',
    link: 'https://shop.charchand.in/collections/jewellery',
    romanNumeral: 'VI',
    discipline: 'Atelier Discipline 06',
    edition: 'Precious Stones',
  },
  {
    id: 'bags',
    label: 'Artisan Leather Bags',
    link: 'https://shop.charchand.in/collections/bags',
    romanNumeral: 'VII',
    discipline: 'Atelier Discipline 07',
    edition: 'Handcrafted Leather',
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

  return (
    <section
      id="lookbook-section"
      style={{ backgroundColor: '#FFFFF0' }}
      className="relative w-full pt-28 sm:pt-36 md:pt-42 pb-16 sm:pb-24 px-3 sm:px-6 lg:px-12 bg-[#FFFFF0] text-[#3E101D] border-b border-[#3E101D]/15 overflow-hidden"
    >
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[700px] h-[400px] sm:h-[500px] bg-[#C5A880]/15 blur-[100px] sm:blur-[120px] pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center mb-5 sm:mb-8 md:mb-12">
          <span className="font-nav text-[9px] sm:text-[11px] tracking-[0.35em] sm:tracking-[0.4em] uppercase text-[#8E6932] font-semibold block mb-2 sm:mb-3">
            INTERACTIVE BOUNCE CARDS LOOKBOOK
          </span>
          <h2 className="font-brand text-2xl sm:text-4xl lg:text-5xl tracking-[0.16em] sm:tracking-[0.2em] font-normal text-[#3E101D] uppercase">
            ATELIER COMPENDIUM
          </h2>
        </div>

        {/* React Bits BounceCards Component with Mobile Gestures & Controls (No Stock Images) */}
        <div className="w-full flex justify-center items-center py-2 sm:py-4 min-h-[380px] sm:min-h-[440px] overflow-visible">
          <BounceCards
            className="atelier-bounce-cards"
            items={LOOKBOOK_ITEMS}
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
              const target = LOOKBOOK_ITEMS[idx];
              if (target?.link) {
                window.open(target.link, '_blank', 'noopener,noreferrer');
              }
            }}
          />
        </div>

        {/* Sub-caption with direct link */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-between w-full text-[10px] sm:text-[11px] font-nav tracking-[0.2em] sm:tracking-[0.25em] text-[#3E101D]/70 uppercase pt-5 sm:pt-6 border-t border-[#3E101D]/15 space-y-2 sm:space-y-0 text-center sm:text-left">
          <span>7 HAUTE DISCIPLINES</span>
          <span className="hidden sm:inline">POWERED BY GSAP & REACT BITS</span>
          <a
            href="https://shop.charchand.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#3E101D] hover:underline font-semibold"
          >
            EXPLORE COMPLETE ARCHIVE →
          </a>
        </div>
      </div>
    </section>
  );
};

export default AtelierLookbook;
