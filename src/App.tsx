import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Header } from './components/Header';
import { AtelierLookbook } from './components/AtelierLookbook';
import { FinalShopSection } from './components/FinalShopSection';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [activeCategory, setActiveCategory] = useState<string>('indo-western');
  const mainContainerRef = useRef<HTMLDivElement>(null);

  // Smooth scroll to lookbook or shop section
  const handleNavigateTo = (id: string) => {
    setActiveCategory(id);
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
          onCategoryChange={setActiveCategory}
        />

        {/* Final Shop Section: Shop the Collection -> shop.charchand.in */}
        <FinalShopSection />
      </main>
    </div>
  );
}
