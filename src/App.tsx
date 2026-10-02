import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Header } from './components/Header';
import { AtelierLookbook } from './components/AtelierLookbook';
import { FinalShopSection } from './components/FinalShopSection';

gsap.registerPlugin(ScrollTrigger);

const CATEGORY_SLUG_MAP: Record<string, string> = {
  'indo-western': 'indo-western',
  'mens-formal': 'mens-formal',
  'womens-formal': 'womens-formal',
  'perfumes': 'perfumes',
  'jewellery': 'jewellery',
  'bags': 'bags',
};

const SLUG_TO_ID_MAP: Record<string, string> = {
  'indo-western': 'indo-western',
  'mens-formal': 'mens-formal',
  'womens-formal': 'womens-formal',
  'perfumes': 'perfumes',
  'jewellery': 'jewellery',
  'bags': 'bags',
};

export default function App() {
  const [activeCategory, setActiveCategory] = useState<string>('indo-western');
  const mainContainerRef = useRef<HTMLDivElement>(null);

  // Initialize category based on current pathname (e.g. /collections/perfumes) or hash
  useEffect(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase().replace('#', '');

    for (const [slug, id] of Object.entries(SLUG_TO_ID_MAP)) {
      if (path.includes(`/collections/${slug}`) || hash === slug || hash === id) {
        setActiveCategory(id);
        break;
      }
    }
  }, []);

  // Smooth scroll to lookbook or shop section and update state
  const handleNavigateTo = (id: string) => {
    setActiveCategory(id);
    const slug = CATEGORY_SLUG_MAP[id];
    if (slug && (window.location.pathname.startsWith('/collections/') || window.location.pathname === '/')) {
      window.history.replaceState(null, '', `/collections/${slug}`);
    }

    if (id === 'shop-section') {
      const target = document.getElementById('shop-section');
      if (target) {
        const headerOffset = 90;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    } else {
      const lookbook = document.getElementById('lookbook-section');
      if (lookbook) {
        const headerOffset = 90;
        const elementPosition = lookbook.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }
  };

  const handleCategoryChange = (id: string) => {
    setActiveCategory(id);
    const slug = CATEGORY_SLUG_MAP[id];
    if (slug && window.location.pathname.startsWith('/collections/')) {
      window.history.replaceState(null, '', `/collections/${slug}`);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate Final Shop CTA
      const finalSection = document.querySelector('.final-shop-section');
      if (finalSection) {
        const cta = finalSection.querySelector('#final-shop-collection-cta');
        if (cta) {
          gsap.fromTo(
            cta,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 1.2,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: finalSection,
                start: 'top 70%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        }
      }
    }, mainContainerRef);

    const handleImageLoad = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('load', handleImageLoad);

    return () => {
      window.removeEventListener('load', handleImageLoad);
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={mainContainerRef}
      className="relative w-full min-h-screen bg-[#FBF9F5] text-[#2A0E15] overflow-x-hidden selection:bg-[#3E101D] selection:text-[#FBF9F5]"
    >
      {/* 1. Minimal Haute Couture Header */}
      <Header
        activeCategory={activeCategory}
        onNavigateTo={handleNavigateTo}
      />

      {/* Main Experience */}
      <main id="main-content" className="w-full">
        {/* Interactive Atelier Accordion Lookbook */}
        <AtelierLookbook
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />

        {/* Final Shop Section: Shop the Collection -> charchaand-e.myshopify.com */}
        <FinalShopSection />
      </main>
    </div>
  );
}
