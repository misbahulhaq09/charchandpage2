import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import './BounceCards.css';

// ============================================================================
// LOWER PRODUCT RESULT AREA: CATEGORY-TO-PRODUCT MAPPING
// Easy to edit, customize, or replace with custom asset paths later.
// ============================================================================
export interface CategoryProductItem {
  id: string;
  categoryTitle: string;
  productImage: string;
  description: string;
  buttonText: string;
  shopUrl: string;
}

export const CATEGORY_PRODUCT_MAPPING: Record<string, CategoryProductItem> = {
  'indo-western': {
    id: 'indo-western',
    categoryTitle: 'INDO WESTERN',
    productImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85',
    description: 'Contemporary silhouettes crafted for modern Indian elegance.',
    buttonText: 'SHOP INDO WESTERN',
    shopUrl: 'https://shop.charchand.in/collections/indo-western',
  },
  'traditional-suits': {
    id: 'traditional-suits',
    categoryTitle: 'TRADITIONAL SUITS',
    productImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85',
    description: 'Regal hand-embroidered heirlooms woven with timeless zardozi and raw silk craftsmanship.',
    buttonText: 'SHOP TRADITIONAL SUITS',
    shopUrl: 'https://shop.charchand.in/collections/traditional-suits',
  },
  'mens-formal': {
    id: 'mens-formal',
    categoryTitle: "MEN'S FORMAL",
    productImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85',
    description: 'Impeccably tailored tuxedos and bespoke suiting engineered for commanding presence.',
    buttonText: "SHOP MEN'S FORMAL",
    shopUrl: 'https://shop.charchand.in/collections/mens-formal',
  },
  'womens-formal': {
    id: 'womens-formal',
    categoryTitle: "WOMEN'S FORMAL",
    productImage: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85',
    description: 'Sculptural evening gowns and fluid formal ensembles celebrating understated glamour.',
    buttonText: "SHOP WOMEN'S FORMAL",
    shopUrl: 'https://shop.charchand.in/collections/womens-formal',
  },
  perfumes: {
    id: 'perfumes',
    categoryTitle: 'HAUTE PARFUMERIE',
    productImage: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=85',
    description: 'Rare artisanal essences distilled from Kashmiri saffron, velvety oud, and damask rose.',
    buttonText: 'SHOP HAUTE PARFUMERIE',
    shopUrl: 'https://shop.charchand.in/collections/perfumes',
  },
  jewellery: {
    id: 'jewellery',
    categoryTitle: 'JEWELLERY',
    productImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85',
    description: 'Mastercrafted statement jewels set with natural polki, uncut emeralds, and 24k gold.',
    buttonText: 'SHOP JEWELLERY',
    shopUrl: 'https://shop.charchand.in/collections/jewellery',
  },
  bags: {
    id: 'bags',
    categoryTitle: 'BAGS',
    productImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85',
    description: 'Hand-stitched structured luxury leather carryalls designed with quiet luxury aesthetics.',
    buttonText: 'SHOP BAGS',
    shopUrl: 'https://shop.charchand.in/collections/bags',
  },
};

const ORDERED_CATEGORY_KEYS = [
  'indo-western',
  'traditional-suits',
  'mens-formal',
  'womens-formal',
  'perfumes',
  'jewellery',
  'bags',
];

export interface LookbookCardItem {
  id?: string;
  label: string;
  link: string;
  romanNumeral?: string;
  discipline?: string;
  edition?: string;
}

export interface BounceCardsProps {
  className?: string;
  items?: LookbookCardItem[];
  // Legacy / fallback props
  labels?: string[];
  links?: string[];
  containerWidth?: number | string;
  containerHeight?: number | string;
  animationDelay?: number;
  animationStagger?: number;
  easeType?: string;
  transformStyles?: string[];
  mobileTransformStyles?: string[];
  enableHover?: boolean;
  selectedCardIndex?: number;
  onCardClick?: (index: number) => void;
  onActiveChange?: (index: number) => void;
}

const DEFAULT_DESKTOP_TRANSFORMS = [
  'rotate(14deg) translate(-270px)',
  'rotate(9deg) translate(-180px)',
  'rotate(4deg) translate(-90px)',
  'rotate(0deg) translate(0px)',
  'rotate(-4deg) translate(90px)',
  'rotate(-9deg) translate(180px)',
  'rotate(-14deg) translate(270px)',
];

const DEFAULT_MOBILE_TRANSFORMS = [
  'rotate(10deg) translate(-105px)',
  'rotate(7deg) translate(-70px)',
  'rotate(3deg) translate(-35px)',
  'rotate(0deg) translate(0px)',
  'rotate(-3deg) translate(35px)',
  'rotate(-7deg) translate(70px)',
  'rotate(-10deg) translate(105px)',
];

const DEFAULT_XS_TRANSFORMS = [
  'rotate(8deg) translate(-88px)',
  'rotate(5deg) translate(-58px)',
  'rotate(3deg) translate(-29px)',
  'rotate(0deg) translate(0px)',
  'rotate(-3deg) translate(29px)',
  'rotate(-5deg) translate(58px)',
  'rotate(-8deg) translate(88px)',
];

export const BounceCards: React.FC<BounceCardsProps> = ({
  className = '',
  items = [],
  labels = [],
  links = [],
  containerWidth = '100%',
  containerHeight = 420,
  animationDelay = 0.2,
  animationStagger = 0.06,
  easeType = 'elastic.out(1, 0.65)',
  transformStyles = DEFAULT_DESKTOP_TRANSFORMS,
  mobileTransformStyles = DEFAULT_MOBILE_TRANSFORMS,
  enableHover = true,
  selectedCardIndex,
  onCardClick,
  onActiveChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitialMountRef = useRef<boolean>(true);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  // Normalize card data from items or legacy labels/links arrays
  const cardItems: LookbookCardItem[] = items.length > 0
    ? items
    : labels.map((label, idx) => ({
        label,
        link: links[idx] || 'https://shop.charchand.in',
        romanNumeral: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'][idx] || `0${idx + 1}`,
        edition: 'HAUTE COUTURE',
      }));

  const totalCards = cardItems.length;
  const [activeIndex, setActiveIndex] = useState<number>(selectedCardIndex ?? 0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isSmallMobile, setIsSmallMobile] = useState<boolean>(false);

  // Responsive screen detection
  useEffect(() => {
    const checkScreen = () => {
      if (typeof window === 'undefined') return;
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsSmallMobile(width <= 380);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen, { passive: true });
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // Determine active transform styles based on viewport
  const activeTransforms = isSmallMobile
    ? DEFAULT_XS_TRANSFORMS
    : isMobile
    ? mobileTransformStyles
    : transformStyles;

  const getNoRotationTransform = (transformStr: string) => {
    const hasRotate = /rotate\([\s\S]*?\)/.test(transformStr);
    if (hasRotate) {
      return transformStr.replace(/rotate\([\s\S]*?\)/, 'rotate(0deg)');
    } else if (transformStr === 'none') {
      return 'rotate(0deg)';
    } else {
      return `${transformStr} rotate(0deg)`;
    }
  };

  const getPushedTransform = (baseTransform: string, offsetX: number) => {
    const translateRegex = /translate\(([-0-9.]+)px\)/;
    const match = baseTransform.match(translateRegex);
    if (match) {
      const currentX = parseFloat(match[1]);
      const newX = currentX + offsetX;
      return baseTransform.replace(translateRegex, `translate(${newX}px)`);
    } else {
      return baseTransform === 'none'
        ? `translate(${offsetX}px)`
        : `${baseTransform} translate(${offsetX}px)`;
    }
  };

  const pushSiblings = useCallback(
    (targetIdx: number) => {
      if (!containerRef.current) return;
      setActiveIndex(targetIdx);

      const q = gsap.utils.selector(containerRef);

      cardItems.forEach((_, i) => {
        const target = q(`.card-${i}`);
        if (!target.length) return;
        gsap.killTweensOf(target);

        const baseTransform = activeTransforms[i] || 'none';

        if (i === targetIdx) {
          const noRotationTransform = getNoRotationTransform(baseTransform);
          gsap.to(target, {
            transform: noRotationTransform,
            scale: isMobile ? 1.05 : 1.08,
            opacity: 1,
            duration: 0.38,
            ease: 'back.out(1.4)',
            overwrite: 'auto',
            zIndex: 40,
          });
        } else {
          const offsetAmount = isSmallMobile ? 38 : isMobile ? 50 : 125;
          const offsetX = i < targetIdx ? -offsetAmount : offsetAmount;
          const pushedTransform = getPushedTransform(baseTransform, offsetX);

          const distance = Math.abs(targetIdx - i);
          const delay = distance * 0.025;

          gsap.to(target, {
            transform: pushedTransform,
            scale: isMobile ? 0.92 : 0.95,
            opacity: isMobile ? 0.78 : 0.85,
            duration: 0.38,
            ease: 'back.out(1.4)',
            delay,
            overwrite: 'auto',
            zIndex: 10 + i,
          });
        }
      });
    },
    [activeTransforms, cardItems, isMobile, isSmallMobile]
  );

  const resetSiblings = useCallback(() => {
    if (!enableHover || isMobile || !containerRef.current) return;

    const q = gsap.utils.selector(containerRef);

    cardItems.forEach((_, i) => {
      const target = q(`.card-${i}`);
      if (!target.length) return;
      gsap.killTweensOf(target);
      const baseTransform = activeTransforms[i] || 'none';
      gsap.to(target, {
        transform: baseTransform,
        scale: 1,
        opacity: 1,
        duration: 0.38,
        ease: 'back.out(1.4)',
        overwrite: 'auto',
        zIndex: 10 + i,
      });
    });
  }, [activeTransforms, enableHover, cardItems, isMobile]);

  // Initial bounce intro animation
  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.card',
        { scale: 0.2, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: animationStagger,
          ease: easeType,
          delay: animationDelay,
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [animationStagger, easeType, animationDelay, totalCards]);

  // Sync with external selected index (e.g., from header)
  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      return;
    }
    if (
      selectedCardIndex !== undefined &&
      selectedCardIndex >= 0 &&
      selectedCardIndex < totalCards
    ) {
      pushSiblings(selectedCardIndex);
    }
  }, [selectedCardIndex, pushSiblings, totalCards]);

  // Handle card click or tap
  const handleCardInteraction = (idx: number) => {
    if (isMobile) {
      // On mobile: if not currently active, bring it to front
      if (idx !== activeIndex) {
        pushSiblings(idx);
        if (onActiveChange) {
          onActiveChange(idx);
        }
        return;
      }
    }
    // If already active or on desktop: perform direct click action
    if (onCardClick) {
      onCardClick(idx);
    } else if (cardItems[idx]?.link) {
      window.open(cardItems[idx].link, '_blank', 'noopener,noreferrer');
    }
  };

  // Next / Previous navigation methods
  const navigateToCard = (nextIdx: number) => {
    const boundedIdx = (nextIdx + totalCards) % totalCards;
    pushSiblings(boundedIdx);
    if (onActiveChange) {
      onActiveChange(boundedIdx);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigateToCard(activeIndex - 1);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigateToCard(activeIndex + 1);
  };

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now(),
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touchEnd = e.changedTouches[0];
    const deltaX = touchEnd.clientX - touchStartRef.current.x;
    const deltaY = touchEnd.clientY - touchStartRef.current.y;
    const elapsedTime = Date.now() - touchStartRef.current.time;

    touchStartRef.current = null;

    // Detect horizontal swipe if deltaX is significant and primarily horizontal
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) && elapsedTime < 500) {
      if (deltaX < 0) {
        navigateToCard(activeIndex + 1);
      } else {
        navigateToCard(activeIndex - 1);
      }
    }
  };

  const currentItem = cardItems[activeIndex] || cardItems[0];
  const currentKey = currentItem?.id || ORDERED_CATEGORY_KEYS[activeIndex] || 'indo-western';
  const currentProduct = CATEGORY_PRODUCT_MAPPING[currentKey] || CATEGORY_PRODUCT_MAPPING['indo-western'];
  const currentLabel = currentProduct?.categoryTitle || currentItem?.label || `Collection ${activeIndex + 1}`;
  const currentLink = currentProduct?.shopUrl || currentItem?.link || 'https://shop.charchand.in';

  // Preload category product images for instantaneous smooth transitions
  useEffect(() => {
    Object.values(CATEGORY_PRODUCT_MAPPING).forEach((product) => {
      if (product.productImage) {
        const img = new Image();
        img.src = product.productImage;
      }
    });
  }, []);

  return (
    <div className={`w-full flex flex-col items-center ${className}`}>
      {/* Mobile Swipe / Interaction Hint */}
      <div className="md:hidden flex items-center justify-center space-x-2 mb-3">
        <span className="font-nav text-[9px] tracking-[0.25em] text-[#8E6932] uppercase font-semibold">
          ← SWIPE OR TAP TO EXPLORE →
        </span>
      </div>

      {/* Main BounceCards Container (No Images - Pure Luxury Typographic Archival Cards) */}
      <div
        className="bounceCardsContainer"
        ref={containerRef}
        style={{
          position: 'relative',
          width: typeof containerWidth === 'number' ? `${containerWidth}px` : containerWidth,
          height: isMobile ? 320 : typeof containerHeight === 'number' ? `${containerHeight}px` : containerHeight,
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {cardItems.map((item, idx) => {
          const isActive = idx === activeIndex;
          const roman = item.romanNumeral || ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'][idx] || `0${idx + 1}`;
          return (
            <div
              key={idx}
              id={`bounce-card-${idx}`}
              className={`card card-${idx} ${isActive ? 'is-active' : ''}`}
              style={{
                transform: activeTransforms[idx] ?? 'none',
                zIndex: isActive ? 40 : 10 + idx,
              }}
              onMouseEnter={() => {
                if (!isMobile) pushSiblings(idx);
              }}
              onMouseLeave={() => {
                if (!isMobile) resetSiblings();
              }}
              onClick={() => handleCardInteraction(idx)}
              role="button"
              tabIndex={0}
              aria-label={`View collection ${item.label}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCardInteraction(idx);
                }
              }}
            >
              {/* Luxury Emblem Card Frame (No Images) */}
              <div className="card-inner-frame select-none">
                <div className="card-top-row">
                  <span className="card-roman">{roman}</span>
                  <span className="card-sparkle">✦</span>
                  <span className="card-code">CC-0{idx + 1}</span>
                </div>

                <div className="card-center-content">
                  <div className="card-emblem">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#E6CA85" strokeWidth="1.2">
                      <polygon points="12,2 15,9 22,12 15,15 12,22 9,15 2,12 9,9" />
                      <circle cx="12" cy="12" r="2.5" fill="#E6CA85" />
                    </svg>
                  </div>
                  <h3 className="card-collection-title">
                    {item.label}
                  </h3>
                  <div className="card-divider" />
                  <span className="card-sub-edition">
                    {item.edition || 'HAUTE COUTURE'}
                  </span>
                </div>

                <div className="card-bottom-row">
                  <span className="card-brand-mark">CHAR CHAAND</span>
                  <span className="card-explore-arrow">→</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Touch-Friendly Lower Product Result Area */}
      <div className="w-full max-w-xl mx-auto mt-7 sm:mt-9 px-4 flex flex-col items-center">
        {/* Active Title, Pagination Indicator & Prev/Next Arrows */}
        <div className="w-full max-w-md flex items-center justify-between py-2.5 border-y border-[#3E101D]/15">
          <button
            id="bounce-cards-prev-btn"
            onClick={handlePrev}
            className="flex items-center justify-center w-11 h-11 border border-[#3E101D]/20 bg-[#FFFFF0] text-[#3E101D] hover:bg-[#3E101D] hover:text-[#FFFFF0] active:scale-95 transition-all shadow-sm focus:outline-none"
            aria-label="Previous Collection"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex flex-col items-center text-center px-3 flex-1">
            <span className="font-nav text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-[#8E6932] font-semibold">
              {String(activeIndex + 1).padStart(2, '0')} / {String(totalCards).padStart(2, '0')}
            </span>
            <span className="font-brand text-sm sm:text-base tracking-[0.18em] text-[#3E101D] uppercase mt-0.5 truncate max-w-[240px] font-medium">
              {currentProduct.categoryTitle}
            </span>
          </div>

          <button
            id="bounce-cards-next-btn"
            onClick={handleNext}
            className="flex items-center justify-center w-11 h-11 border border-[#3E101D]/20 bg-[#FFFFF0] text-[#3E101D] hover:bg-[#3E101D] hover:text-[#FFFFF0] active:scale-95 transition-all shadow-sm focus:outline-none"
            aria-label="Next Collection"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Dynamic Category Product Visual Presentation with 400-600ms Fade & Scale Transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProduct.id}
            initial={{ opacity: 0, scale: 0.985, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.985, y: -8 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full flex flex-col items-center"
          >
            {/* [ LARGE PREMIUM PRODUCT IMAGE WITH EMBEDDED SHOP BUTTON AT BOTTOM ] */}
            <div className="relative w-full max-w-[320px] sm:max-w-[400px] md:max-w-[450px] aspect-[4/5] mx-auto mt-6 sm:mt-7 mb-5 sm:mb-6 overflow-hidden border border-[#3E101D]/15 shadow-[0_16px_45px_rgba(62,16,29,0.08)] bg-[#F5F2EB] group">
              <img
                src={currentProduct.productImage}
                alt={`Char Chaand ${currentProduct.categoryTitle} Haute Couture`}
                className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-103"
                loading="eager"
                decoding="async"
              />

              {/* Embedded Shop Button positioned inside the bottom of the image */}
              <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4 bg-gradient-to-t from-[#260710]/95 via-[#260710]/60 to-transparent flex items-center justify-center">
                <a
                  id="bounce-cards-explore-active-btn"
                  href={currentProduct.shopUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full max-w-[270px] sm:max-w-[320px] inline-flex items-center justify-center px-6 py-3 border border-[#FFFFF0]/30 bg-[#260710]/90 hover:bg-[#3D0F1E] text-[#FFFFF0] font-nav text-[10px] sm:text-[11px] tracking-[0.25em] uppercase font-bold transition-all duration-300 shadow-lg backdrop-blur-xs group/btn"
                >
                  <span className="truncate">{currentProduct.buttonText}</span>
                  <ExternalLink size={13} className="ml-2.5 flex-shrink-0 text-[#E5D7B7] transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                </a>
              </div>
            </div>

            {/* [ Short Premium Product/Category Description ] */}
            <p className="font-nav text-[12px] sm:text-[13px] leading-relaxed tracking-[0.14em] text-[#3E101D]/80 max-w-sm sm:max-w-md text-center italic font-light mb-4 sm:mb-5">
              "{currentProduct.description}"
            </p>

            {/* 7 Touch Pagination Dots */}
            <div className="flex items-center justify-center space-x-2 sm:space-x-2.5">
              {cardItems.map((item, idx) => (
                <button
                  key={idx}
                  id={`bounce-dot-${idx}`}
                  onClick={() => {
                    pushSiblings(idx);
                    if (onActiveChange) onActiveChange(idx);
                  }}
                  className={`transition-all duration-300 focus:outline-none ${
                    idx === activeIndex
                      ? 'w-6 sm:w-7 h-2 bg-[#3E101D] rounded-full shadow-[0_0_8px_rgba(62,16,29,0.3)]'
                      : 'w-2 h-2 bg-[#3E101D]/25 hover:bg-[#3E101D]/50 rounded-full'
                  }`}
                  aria-label={`Jump to ${item.label}`}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BounceCards;
