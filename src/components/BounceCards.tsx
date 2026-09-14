import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import './BounceCards.css';

export interface BounceCardsProps {
  className?: string;
  images?: string[];
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
  images = [],
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

      images.forEach((_, i) => {
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
    [activeTransforms, images, isMobile, isSmallMobile]
  );

  const resetSiblings = useCallback(() => {
    if (!enableHover || isMobile || !containerRef.current) return;

    const q = gsap.utils.selector(containerRef);

    images.forEach((_, i) => {
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
  }, [activeTransforms, enableHover, images, isMobile]);

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
  }, [animationStagger, easeType, animationDelay, images.length]);

  // Sync with external selected index (e.g., from header)
  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      return;
    }
    if (
      selectedCardIndex !== undefined &&
      selectedCardIndex >= 0 &&
      selectedCardIndex < images.length
    ) {
      pushSiblings(selectedCardIndex);
    }
  }, [selectedCardIndex, pushSiblings, images.length]);

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
    } else if (links[idx]) {
      window.open(links[idx], '_blank', 'noopener,noreferrer');
    }
  };

  // Next / Previous navigation methods
  const navigateToCard = (nextIdx: number) => {
    const boundedIdx = (nextIdx + images.length) % images.length;
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
        // Swiped Left -> Go Next
        navigateToCard(activeIndex + 1);
      } else {
        // Swiped Right -> Go Previous
        navigateToCard(activeIndex - 1);
      }
    }
  };

  const currentLabel = labels[activeIndex] || `Collection ${activeIndex + 1}`;
  const currentLink = links[activeIndex] || 'https://shop.charchand.in';

  return (
    <div className={`w-full flex flex-col items-center ${className}`}>
      {/* Mobile Swipe / Interaction Hint */}
      <div className="md:hidden flex items-center justify-center space-x-2 mb-3">
        <span className="font-nav text-[9px] tracking-[0.25em] text-[#E6CA85]/80 uppercase">
          ← SWIPE OR TAP TO EXPLORE →
        </span>
      </div>

      {/* Main BounceCards Container */}
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
        {images.map((src, idx) => {
          const isActive = idx === activeIndex;
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
              aria-label={`View collection ${labels[idx] || idx + 1}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCardInteraction(idx);
                }
              }}
            >
              <img
                className="image"
                src={src}
                alt={labels[idx] || `card-${idx}`}
                loading="eager"
              />
              {labels[idx] && (
                <div className="card-caption">
                  {labels[idx]}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Touch-Friendly Mobile & Desktop Navigation Bar */}
      <div className="w-full max-w-md mx-auto mt-6 px-4 flex flex-col items-center">
        {/* Active Title, Pagination & Prev/Next Arrows */}
        <div className="w-full flex items-center justify-between py-2 border-y border-[#E6CA85]/20">
          <button
            id="bounce-cards-prev-btn"
            onClick={handlePrev}
            className="flex items-center justify-center w-11 h-11 border border-[#E6CA85]/40 bg-[#2B0B14]/80 text-[#E6CA85] hover:bg-[#3E101D] hover:border-[#E6CA85] active:scale-95 transition-all shadow-md focus:outline-none"
            aria-label="Previous Collection"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex flex-col items-center text-center px-3 flex-1">
            <span className="font-nav text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-[#E6CA85] font-semibold">
              {String(activeIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
            </span>
            <span className="font-brand text-sm sm:text-base tracking-[0.18em] text-[#FBF9F5] uppercase mt-0.5 truncate max-w-[220px]">
              {currentLabel}
            </span>
          </div>

          <button
            id="bounce-cards-next-btn"
            onClick={handleNext}
            className="flex items-center justify-center w-11 h-11 border border-[#E6CA85]/40 bg-[#2B0B14]/80 text-[#E6CA85] hover:bg-[#3E101D] hover:border-[#E6CA85] active:scale-95 transition-all shadow-md focus:outline-none"
            aria-label="Next Collection"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* 7 Touch Pagination Dots */}
        <div className="flex items-center justify-center space-x-2 sm:space-x-2.5 mt-4">
          {images.map((_, idx) => (
            <button
              key={idx}
              id={`bounce-dot-${idx}`}
              onClick={() => {
                pushSiblings(idx);
                if (onActiveChange) onActiveChange(idx);
              }}
              className={`transition-all duration-300 focus:outline-none ${
                idx === activeIndex
                  ? 'w-6 sm:w-7 h-2 bg-[#E6CA85] rounded-full shadow-[0_0_8px_#E6CA85]'
                  : 'w-2 h-2 bg-[#FBF9F5]/30 hover:bg-[#FBF9F5]/60 rounded-full'
              }`}
              aria-label={`Jump to ${labels[idx] || `Item ${idx + 1}`}`}
            />
          ))}
        </div>

        {/* Dedicated High-Affordance Action Button on Mobile & Desktop */}
        <a
          id="bounce-cards-explore-active-btn"
          href={currentLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center justify-center px-6 py-3 border border-[#E6CA85] bg-[#E6CA85] text-[#20070E] font-nav text-[10px] sm:text-[11px] tracking-[0.25em] uppercase font-bold hover:bg-[#FBF9F5] hover:border-[#FBF9F5] transition-all shadow-md group"
        >
          <span>SHOP {currentLabel}</span>
          <ExternalLink size={13} className="ml-2 transition-transform duration-200 group-hover:translate-x-0.5" />
        </a>
      </div>
    </div>
  );
};

export default BounceCards;
