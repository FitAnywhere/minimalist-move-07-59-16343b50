
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
  const [isWhyDialogOpen, setIsWhyDialogOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [videoError, setVideoError] = useState(false);

  const bulletData = ["1 MONTH OF COACH ACCESS", "15-MIN DOPAMINE WORKOUTS"];

  const handleVideoError = () => {
    setVideoError(true);
  };

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
    <section className="py-12 px-4" style={{
      backgroundColor: '#f6f6f6'
    }}>
      <div className="container mx-auto">
        {/* Section title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-black relative inline-block py-0 my-0">
            CRUSH YOUR GOALS
            <span className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000 scale-x-100"></span>
          </h2>
        </div>

        {/* Desktop: Video on right, text on left
            Mobile: Title > Subtitle > Video > Bullet points */}
        <div className={cn("max-w-6xl mx-auto", isMobile ? "flex flex-col space-y-4" : "flex flex-row-reverse items-center gap-6")}>
          
          {/* Subtitle text - Mobile only - moved closer to title */}
          <div className={cn(isMobile ? "w-full text-center order-2 mb-1" : "hidden")}>
            <p className="text-xl font-bold text-gray-700 px-[18px] py-0 my-0 bg-red-50">WARNING: Your body will crave workouts more than a chocolate</p>
          </div>
          
          {/* Video Column */}
          <div className={cn("flex justify-center", isMobile ? "w-full order-3 mt-3" : "w-2/5")}>
            <div className={cn("relative overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-lg", isMobile ? "w-full max-w-md" : "w-full max-w-[360px]")}>
              <div className="relative w-full h-0" style={{
                paddingBottom: '133.33%'
              }}>
                {!videoError ? (
                  <video 
                    className="absolute inset-0 w-full h-full object-cover rounded-lg" 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    style={{
                      borderRadius: '8px'
                    }}
                    onError={handleVideoError}
                  >
                    <source src="/nn15.webm" type="video/webm" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img 
                    src="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1750975895/0620_1_.mp4_900_x_1200_pik_2_ziv3zf.png"
                    alt="Workout fallback"
                    className="absolute inset-0 w-full h-full object-cover rounded-lg"
                    style={{
                      borderRadius: '8px'
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          
          {/* Text Column - Desktop version includes subtitle + bullets, Mobile only bullets */}
          <div className={cn("flex flex-col", isMobile ? "w-full space-y-4 order-4" : "w-3/5 text-left space-y-4 pl-6")}>
            
            {/* Subtitle text - Desktop only */}
            {!isMobile && <p className="text-2xl font-bold text-gray-700 mt-0 pt-0 mb-8 bg-red-50">WARNING: Your body will crave workouts more than a chocolate</p>}
            
            {/* Non-interactive bullet points */}
            <ul className={cn("space-y-3", !isMobile && "mt-1 ml-4", isMobile ? "text-left" : "")}>
              {bulletData.map((bullet, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center mt-1">
                    <span className="text-yellow-400 text-lg">●</span>
                  </div>
                  <div className="text-gray-800">
                    <div className={cn("font-semibold", isMobile ? "text-sm" : "text-lg")}>
                      {bullet}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            
            {/* CTA Button */}
            <div className={cn("pt-4", isMobile ? "flex justify-center" : "")}>
              <Button variant="yellow" size="lg" className="font-semibold" onClick={() => setIsWhyDialogOpen(true)}>
                WHY YOU NEED IT →
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Why You Need It Modal */}
      <Dialog open={isWhyDialogOpen} onOpenChange={setIsWhyDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>Why You Need It</DialogTitle>
          </DialogHeader>
          
          <div className="py-6 text-left space-y-6 leading-relaxed text-gray-800 pr-8">
            <p><strong>The best path to change? Strip everything that stops you from starting.</strong></p>
            
            <p>We boiled it down to three keys:</p>
            
            <div className="space-y-6">
              <div>
                <p><strong>• A setup that kills every excuse before it starts.</strong></p>
                <p>Too tired? It's right there.</p>
                <p>No time? 15 minutes.</p>
                <p>No strength? Use the bands.</p>
                <p><em>You're out of reasons.</em></p>
              </div>
              
              <div>
                <p><strong>• A coach who checks in like a friend but holds you accountable like a pro.</strong></p>
                <p>You're not left wondering.</p>
                <p>You're not training alone.</p>
                <p>You're guided, supported, and reminded before the guilt ever kicks in.</p>
              </div>
              
              <div>
                <p><strong>• 15-minute workouts <em>feeling</em> so good, skipping feels worse than starting.</strong></p>
                <p>They don't drain you.</p>
                <p>They <em>charge</em> you.</p>
                <p>And leave you with a win your brain <em>wants</em> to repeat.</p>
              </div>
            </div>
            
            <p><strong>The result?</strong></p>
            
            <p>You start before hesitation even forms.</p>
            <p>The reps feel light.</p>
            <p>But something big is changing:</p>
            
            <p><strong>Not just your muscles.</strong></p>
            <p><strong>Your story.</strong></p>
            
            <p>You're not getting back on track.</p>
            <p>You're laying a new one.</p>
          </div>
        </DialogContent>
      </Dialog>

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
                  onChange={e => setOrderNumber(e.target.value)} 
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
                  onChange={e => setEmail(e.target.value)} 
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
