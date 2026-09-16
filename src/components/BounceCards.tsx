import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import './BounceCards.css';

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
  const currentLabel = currentItem?.label || `Collection ${activeIndex + 1}`;
  const currentLink = currentItem?.link || 'https://shop.charchand.in';

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
                  <span className="card-brand-mark">CHAR CHAND</span>
                  <span className="card-explore-arrow">→</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Touch-Friendly Mobile & Desktop Navigation Bar */}
      <div className="w-full max-w-md mx-auto mt-6 px-4 flex flex-col items-center">
        {/* Active Title, Pagination & Prev/Next Arrows */}
        <div className="w-full flex items-center justify-between py-2 border-y border-[#3E101D]/15">
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
            <span className="font-brand text-sm sm:text-base tracking-[0.18em] text-[#3E101D] uppercase mt-0.5 truncate max-w-[220px] font-medium">
              {currentLabel}
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

        {/* 7 Touch Pagination Dots */}
        <div className="flex items-center justify-center space-x-2 sm:space-x-2.5 mt-4">
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

        {/* Dedicated High-Affordance Action Button on Mobile & Desktop */}
        <a
          id="bounce-cards-explore-active-btn"
          href={currentLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center justify-center px-6 py-3 border border-[#260710] bg-[#260710] text-[#FFFFF0] font-nav text-[10px] sm:text-[11px] tracking-[0.25em] uppercase font-bold hover:bg-[#3D0F1E] hover:border-[#3D0F1E] transition-all shadow-md group"
        >
          <span>SHOP {currentLabel}</span>
          <ExternalLink size={13} className="ml-2 transition-transform duration-200 group-hover:translate-x-0.5" />
        </a>
      </div>
    </div>
  );
};

export default BounceCards;
