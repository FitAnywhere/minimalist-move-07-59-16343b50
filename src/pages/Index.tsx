
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
  // Add smooth scroll behavior for anchor links
  useEffect(() => {
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
          
          // Handle specific sections
          if (anchor.hash === '#lifestyle') {
            // If there's a collapsible section in the lifestyle section, we could expand it here
            // For now, this ensures the URL is updated
            setTimeout(() => {
              // Update URL without scrolling after the smooth scroll completes
              history.pushState(null, '', anchor.hash);
            }, 800); // The delay allows for the scroll animation to complete
          } else {
            // Update URL without scrolling
            history.pushState(null, '', anchor.hash);
          }
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
      <HeroSection />
      <ProductIntro />
      <ProductTabs />
      <ChampionSection />
      <LifestyleSection />
      <BundleOffer />
      <TestimonialsCarousel />
      <TargetAndFAQ />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Index;
