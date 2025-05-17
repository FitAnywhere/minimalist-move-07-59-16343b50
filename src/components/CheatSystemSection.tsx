import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Check } from 'lucide-react';
const CheatSystemSection = () => {
  const isMobile = useIsMobile();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = ["https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1747232994/m15GG_pfiuiu.png", "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1747395657/Izdelek_brez_naslova_15_oqqh8v.png"];
  useEffect(() => {
    // Set up image carousel to switch every 3 seconds
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => prevIndex === 0 ? 1 : 0);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!orderNumber.trim() || !email.trim()) {
      setError('Please fill in all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      const response = await fetch('https://hook.eu2.make.com/278gv0h3o3lxy7lafe1s7v2cwr4e192g', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          order_number: orderNumber,
          email: email
        })
      });

      // Handle successful submission
      setIsSuccess(true);
      setOrderNumber('');
      setEmail('');
    } catch (error) {
      setError('Failed to submit. Please try again.');
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return <section className="py-12 px-4 bg-white">
      <div className="container mx-auto">
        {/* Section title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-black relative inline-block py-0 my-[27px]">
            TIME HACKS
            <span className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000 scale-x-100"></span>
          </h2>
        </div>

        {/* Desktop: Image on right, text on left
            Mobile: Title > Subtitle > Image > Bullet points */}
        <div className={cn("max-w-6xl mx-auto", isMobile ? "flex flex-col space-y-4" : "flex flex-row-reverse items-center gap-3")}>
          {/* Subtitle text - Mobile only */}
          <div className={cn(isMobile ? "w-full text-center order-2 mb-0" : "hidden")}>
            <p className="text-base font-semibold text-gray-700">THE FASTEST MUSCLE BUILDING FORMULA</p>
          </div>
          
          {/* Image Column with Carousel */}
          <div className={cn("flex justify-center", isMobile ? "w-full order-3 mt-3" : "w-2/5")}>
            <div className={cn("overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:shadow-lg relative", isMobile ? "w-full max-w-md" : "w-full max-w-[360px]")}>
              {images.map((src, index) => <img key={index} src={src} alt="Daily Pump System" className={`w-full h-auto object-cover absolute top-0 left-0 transition-opacity duration-1000 ${currentImageIndex === index ? 'opacity-100' : 'opacity-0'}`} loading={index === 0 ? "eager" : "lazy"} width={360} height={320} srcSet={`
                    ${src} 360w,
                    ${src} 560w
                  `} sizes="(max-width: 768px) 100vw, 360px" />)}
              {/* This is a placeholder to maintain the correct aspect ratio */}
              <img src={images[0]} alt="" className="w-full h-auto object-cover invisible" aria-hidden="true" width={360} height={320} />
            </div>
          </div>
          
          {/* Text Column - Desktop version includes subtitle + bullets, Mobile only bullets */}
          <div className={cn("flex flex-col", isMobile ? "w-full text-center space-y-4 order-4" : "w-3/5 text-left space-y-4 pl-6")}>
            
            {/* Subtitle text - Desktop only - Increased text size and added more margin bottom */}
            {!isMobile && <p className="text-2xl font-medium text-gray-700 mt-0 pt-0 mb-8">THE FASTEST MUSCLE BUILDING FORMULA</p>}
            
            {/* Updated bullet points with consistent spacing and larger text on desktop */}
            <ul className={cn("space-y-3", !isMobile && "mt-1 ml-4")}>
              {isMobile ?
            // Mobile bullet points
            ["FREE FOR FITANY USERS", "FUN 15MIN DAILY CHALLENGES", "THE EASIEST WAY TO GROW"].map((point, index) => <li key={index} className={cn("flex items-center gap-3", !isMobile && "text-[16px] font-semibold")}>
                    {/* Smaller bullet points */}
                    <div className="w-4 h-4 bg-yellow rounded-full flex-shrink-0 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-yellow rounded-full"></div>
                    </div>
                    <span className="text-gray-800">{point}</span>
                  </li>) :
            // Desktop bullet points - updated with consistent spacing and larger text
            ["FREE for FITANY users", "FUN 15min daily challenges", "THE EASIEST way to grow"].map((point, index) => <li key={index} className="flex items-center gap-4 mb-6 last:mb-0 py-[6px] px-0">
                    {/* Bullet points */}
                    <div className="w-5 h-5 bg-yellow rounded-full flex-shrink-0 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-yellow rounded-full"></div>
                    </div>
                    <span className="text-gray-800 text-lg font-medium">{point}</span>
                  </li>)}
            </ul>
            
            {/* CTA Button - Updated URL redirect */}
            <div className={cn("pt-4", isMobile ? "flex justify-center" : "")}>
              <Button variant="yellow" size="lg" className="font-semibold" onClick={() => setIsDialogOpen(true)}>
                REQUEST YOURS
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">
              {isSuccess ? 'Request Submitted' : 'Request Your Time Hacks'}
            </DialogTitle>
          </DialogHeader>
          
          {isSuccess ? <div className="py-6 text-center space-y-4">
              <div className="flex justify-center">
                <Check className="h-12 w-12 text-green-500" />
              </div>
              <p className="text-lg font-medium">Thank you.</p>
              <p>Once we confirm your order number, you will receive TIME HACKS on your email.</p>
            </div> : <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="order-number" className="text-sm font-medium">
                  Order Number
                </label>
                <Input id="order-number" value={orderNumber} onChange={e => setOrderNumber(e.target.value)} placeholder="Enter your order number" required />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email address" required />
              </div>
              
              {error && <p className="text-red-600 text-sm">{error}</p>}
              
              <div className="flex justify-center pt-2">
                <Button type="submit" variant="yellow" className="w-full font-semibold" disabled={isSubmitting}>
                  GET MY TIME HACKS
                </Button>
              </div>
            </form>}
        </DialogContent>
      </Dialog>
    </section>;
};
export default CheatSystemSection;