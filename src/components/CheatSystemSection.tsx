
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Check, X, HelpCircle } from 'lucide-react';

const CheatSystemSection = () => {
  const isMobile = useIsMobile();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [activeBulletPopup, setActiveBulletPopup] = useState<number | null>(null);

  const bulletData = [
    {
      text: "1 MONTH OF COACH ACCESS",
      popupHeadline: "GET ON TRACK",
      popupBody: `Coach is here to eliminate confusion, silence your doubts, and hold you accountable like your future depends on it.

Because it does.`
    },
    {
      text: "15-MINUTE DOPAMINE WORKOUTS",
      popupHeadline: "YOUR BRAIN'S WIRED FOR QUICK WINS",
      popupBody: `Motivation is dead.

Dopamine is king.

These workouts are engineered to feel so good, your brain wants to do them again.

No long plans. No burnout.

Just 15 minutes that flip your lazy switch to beast mode — every damn time.`
    },
    {
      text: "WINNERS MINDSET LESSONS",
      popupHeadline: "FIX YOUR MIND AND YOUR BODY WILL FOLLOW",
      popupBody: `You don't need more workouts.

You need to stop quitting.

This isn't fluff. It's mental reprogramming from day one.

No more 'I'll start Monday.'

You'll act like a winner — because we'll wire you to be one.`
    }
  ];

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

  return (
    <section className="py-12 px-4 bg-white">
      <div className="container mx-auto">
        {/* Section title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-black relative inline-block py-0 my-0">
            YOU DON'T NEED A PLAN
            <span className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000 scale-x-100"></span>
          </h2>
        </div>

        {/* Desktop: Image on right, text on left
            Mobile: Title > Subtitle > Image > Bullet points */}
        <div className={cn("max-w-6xl mx-auto", isMobile ? "flex flex-col space-y-4" : "flex flex-row-reverse items-center gap-3")}>
          
          {/* Subtitle text - Mobile only - moved closer to title */}
          <div className={cn(isMobile ? "w-full text-center order-2 mb-1" : "hidden")}>
            <p className="text-lg font-bold text-gray-700 px-[18px] py-0 my-0">We built one your excuses can't beat</p>
          </div>
          
          {/* Image Column */}
          <div className={cn("flex justify-center", isMobile ? "w-full order-3 mt-3" : "w-2/5")}>
            <div className={cn("overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-lg", isMobile ? "w-full max-w-md" : "w-full max-w-[360px]")}>
              <img 
                src="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1749556400/Neon_Green_Fitness_and_Gym_Tips_Carousel_Instagram_Post_6_yioypp.png" 
                alt="Support System" 
                className="w-full h-auto object-cover rounded-lg"
                loading="eager"
                width={360}
                height={360}
                style={{ borderRadius: '8px' }}
              />
            </div>
          </div>
          
          {/* Text Column - Desktop version includes subtitle + bullets, Mobile only bullets */}
          <div className={cn("flex flex-col", isMobile ? "w-full space-y-4 order-4" : "w-3/5 text-left space-y-4 pl-6")}>
            
            {/* Subtitle text - Desktop only */}
            {!isMobile && <p className="text-2xl font-bold text-gray-700 mt-0 pt-0 mb-8">We built one your excuses can't beat</p>}
            
            {/* Interactive bullet points */}
            <ul className={cn("space-y-3", !isMobile && "mt-1 ml-4", isMobile ? "text-left" : "")}>
              {bulletData.map((bullet, index) => (
                <li 
                  key={index} 
                  className="flex items-start gap-3 cursor-pointer group"
                  onClick={() => setActiveBulletPopup(index)}
                >
                  <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center mt-1">
                    <span className="text-yellow group-hover:text-red-600 transition-colors text-lg">❓</span>
                  </div>
                  <div className="text-gray-800 group-hover:text-yellow transition-colors">
                    <div className={cn("font-semibold", isMobile ? "text-sm" : "text-lg")}>
                      ❓ {bullet.text}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            
            {/* CTA Button */}
            <div className={cn("pt-4", isMobile ? "flex justify-center" : "")}>
              <Button variant="yellow" size="lg" className="font-semibold" onClick={() => setIsDialogOpen(true)}>
                GET YOURS →
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bullet Point Popups */}
      {activeBulletPopup !== null && (
        <Dialog open={true} onOpenChange={() => setActiveBulletPopup(null)}>
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-center text-xl font-bold">
                {bulletData[activeBulletPopup].popupHeadline}
              </DialogTitle>
            </DialogHeader>
            
            <div className="py-4 text-left space-y-2">
              {bulletData[activeBulletPopup].popupBody.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="text-gray-800 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Original Modal Dialog for form submission */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">
              {isSuccess ? 'Request Submitted' : 'VERIFY TO GET ACCESS'}
            </DialogTitle>
          </DialogHeader>
          
          {isSuccess ? (
            <div className="py-6 text-center space-y-4">
              <div className="flex justify-center">
                <Check className="h-12 w-12 text-green-500" />
              </div>
              <p className="text-lg font-medium">Thank you.</p>
              <p>Once we confirm your order number, you will receive TIME HACKS on your email.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="order-number" className="text-sm font-medium">
                  Order Number
                </label>
                <Input 
                  id="order-number" 
                  value={orderNumber} 
                  onChange={(e) => setOrderNumber(e.target.value)} 
                  placeholder="Enter your order number" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="Enter your email address" 
                  required 
                />
              </div>
              
              {error && <p className="text-red-600 text-sm">{error}</p>}
              
              <div className="flex justify-center pt-2">
                <Button 
                  type="submit" 
                  variant="yellow" 
                  className="w-full font-semibold" 
                  disabled={isSubmitting}
                >
                  VERIFY
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default CheatSystemSection;
