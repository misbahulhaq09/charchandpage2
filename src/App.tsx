import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CATEGORIES } from './data/categories';
import { Header } from './components/Header';
import { CategorySection } from './components/CategorySection';
import { FinalShopSection } from './components/FinalShopSection';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [activeCategory, setActiveCategory] = useState<string>('indo-western');
  const mainContainerRef = useRef<HTMLDivElement>(null);

  // Smooth scroll to category or shop section
  const handleNavigateTo = (id: string) => {
    setActiveCategory(id);
    const target = document.getElementById(id);
    if (target) {
      const headerOffset = 110;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    // Wait for DOM layout to settle
    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>('.category-section');

      sections.forEach((section, i) => {
        const categoryId = section.getAttribute('data-category-id') || '';
        const image = section.querySelector<HTMLImageElement>('.category-image');
        const title = section.querySelector<HTMLHeadingElement>('.category-title');
        const arrow = section.querySelector<HTMLElement>('.category-arrow');

        // 1. Active category tracking for Header
        ScrollTrigger.create({
          trigger: section,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => setActiveCategory(categoryId),
          onEnterBack: () => setActiveCategory(categoryId),
        });

        // 2. Parallax and Gentle Image Zoom
        if (image) {
          gsap.fromTo(
            image,
            { scale: 1.12, yPercent: -5 },
            {
              scale: 1.0,
              yPercent: 5,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.2,
              },
            }
          );
        }

        // 3. Category Title & Arrow Fade-in and subtle float
        if (title) {
          gsap.fromTo(
            title,
            { opacity: 0, y: 35 },
            {
              opacity: 1,
              y: 0,
              duration: 1.2,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 70%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        }

        if (arrow) {
          if (i === 0) {
            gsap.fromTo(
              arrow,
              { opacity: 0, y: 15 },
              {
                opacity: 1,
                y: 0,
                duration: 0.9,
                delay: 0.2,
                ease: 'power2.out',
              }
            );
          } else {
            gsap.fromTo(
              arrow,
              { opacity: 0, y: 20 },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: section,
                  start: 'top 85%',
                  toggleActions: 'play none none none',
                },
              }
            );
          }
        }

        // 4. Smooth scale-down / fade as user scrolls past (previous section transition)
        if (i < sections.length - 1) {
          const nextSection = sections[i + 1];
          gsap.to(section, {
            scale: 0.94,
            opacity: 0.45,
            ease: 'none',
            scrollTrigger: {
              trigger: nextSection,
              start: 'top bottom',
              end: 'top top',
              scrub: 0.8,
            },
          });
        }
      });

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

    // Refresh triggers once all images load
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
      {/* 1. Minimal Header */}
      <Header
        activeCategory={activeCategory}
        onNavigateTo={handleNavigateTo}
      />

      {/* 2. Category Experience: One by one large cinematic full-screen sections */}
      <main id="main-content" className="w-full">
        {CATEGORIES.map((cat, idx) => (
          <CategorySection
            key={cat.id}
            category={cat}
            index={idx}
            total={CATEGORIES.length}
          />
        ))}

        {/* 3. Final Shop Section: Shop the Collection -> shop.charchand.in */}
        <FinalShopSection />
      </main>
    </div>
  );
}
