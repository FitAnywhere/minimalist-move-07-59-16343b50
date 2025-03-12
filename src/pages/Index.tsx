
import { useEffect } from 'react';
import NavBar from '@/components/NavBar';
import HeroSection from '@/components/HeroSection';
import ProductIntro from '@/components/ProductIntro';
import ProductTabs from '@/components/ProductTabs';
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
      <HeroSection />
      <ProductIntro />
      <ProductTabs />
      <BundleOffer />
      <TestimonialsCarousel />
      <TargetAndFAQ />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Index;
