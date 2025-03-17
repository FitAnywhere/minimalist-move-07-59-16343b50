
import { useEffect } from 'react';
import NavBar from '@/components/NavBar';
import HeroSection from '@/components/HeroSection';
import ProductIntro from '@/components/ProductIntro';
import ProductTabs from '@/components/ProductTabs';
import ChampionSection from '@/components/ChampionSection';
import LifestyleSection from '@/components/LifestyleSection';
import BundleOffer from '@/components/BundleOffer';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import TargetAndFAQ from '@/components/TargetAndFAQ';
import CallToAction from '@/components/CallToAction';
import Footer from '@/components/Footer';

const Index = () => {
  // Add smooth scroll behavior for anchor links and handle URL hash on page load
  useEffect(() => {
    // Handle URL hash on initial load
    const handleInitialHash = () => {
      const hash = window.location.hash;
      if (hash) {
        setTimeout(() => {
          const targetElement = document.querySelector(hash);
          if (targetElement) {
            window.scrollTo({
              top: targetElement.getBoundingClientRect().top + window.scrollY - 100,
              behavior: 'smooth'
            });
          }
        }, 500); // Increased delay to ensure all elements are fully rendered
      }
    };
    
    handleInitialHash();
    
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.hash && anchor.hash.startsWith('#') && anchor.hostname === window.location.hostname) {
        e.preventDefault();
        
        const targetElement = document.querySelector(anchor.hash);
        if (targetElement) {
          // Scroll to the target element with smooth behavior
          window.scrollTo({
            top: targetElement.getBoundingClientRect().top + window.scrollY - 100,
            behavior: 'smooth'
          });
          
          // Update URL without scrolling
          history.pushState(null, '', anchor.hash);
        }
      }
    };
    
    document.addEventListener('click', handleAnchorClick);
    
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);
  
  return (
    <div className="overflow-x-hidden">
      <NavBar />
      <div id="hero">
        <HeroSection />
      </div>
      <div id="product">
        <ProductIntro />
        <ProductTabs />
      </div>
      <ChampionSection />
      <div id="lifestyle">
        <LifestyleSection />
      </div>
      <div id="bundle">
        <BundleOffer />
      </div>
      <div id="reviews">
        <TestimonialsCarousel />
      </div>
      <div id="faq">
        <TargetAndFAQ />
      </div>
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Index;
