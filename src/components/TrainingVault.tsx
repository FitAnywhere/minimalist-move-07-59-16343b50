
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import VideoPlayer from '@/components/ui/VideoPlayer';

const TrainingVault = () => {
  const {
    toast
  } = useToast();
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'expert' | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const isMobile = useIsMobile();
  
  const handleLevelSelect = (level: 'beginner' | 'expert') => {
    setSelectedLevel(level);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email) {
      toast({
        title: "Error",
        description: "Please fill out all fields",
        variant: "destructive"
      });
      return;
    }

    // Check if already submitted
    if (hasSubmitted) {
      toast({
        title: "Already Sent",
        description: "Your sample workout is already on its way."
      });
      return;
    }
    setIsLoading(true);
    try {
      // Format the payload according to the requirements
      const payload = {
        value: {
          records: [{
            fields: {
              ime: formData.name,
              email: formData.email,
              inquiry: selectedLevel
            }
          }]
        }
      };

      // Send to the webhook
      await fetch('https://hook.eu2.make.com/a7bqlmancbm03b6igrd574afaiy20v1o', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        mode: 'no-cors',
        // Important for cross-origin requests
        body: JSON.stringify(payload)
      });

      // Mark as submitted
      setHasSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return <section className="bg-black text-white py-16">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative inline-block">
            <h2 className="text-4xl md:text-5xl font-bold uppercase text-white text-center">WORKOUT SAMPLES</h2>
            <div className="absolute -bottom-2 left-0 w-full h-1.5 bg-yellow"></div>
          </div>
        </div>
        
        {/* Two-column layout */}
        <div className="flex flex-col md:flex-row md:gap-8 md:items-center md:justify-center">
          {/* Left column: Content */}
          <div className="md:w-1/2 flex flex-col items-center">
            <p className="text-xl mb-10 text-white uppercase text-center">CHOOSE YOUR FREE WORKOUT SAMPLES</p>
            
            {/* Buttons */}
            <div className="flex gap-4 justify-center mb-8">
              <Button onClick={() => handleLevelSelect('beginner')} className={`bg-yellow hover:bg-yellow-dark text-black font-bold uppercase tracking-wide px-4 py-2 ${selectedLevel === 'beginner' ? 'ring-2 ring-yellow-light' : ''}`}>
                FOR BEGINNERS
              </Button>
              
              <Button onClick={() => handleLevelSelect('expert')} className={`bg-yellow hover:bg-yellow-dark text-black font-bold uppercase tracking-wide px-4 py-2 ${selectedLevel === 'expert' ? 'ring-2 ring-yellow-light' : ''}`}>
                FOR EXPERTS
              </Button>
            </div>
            
            {/* Form (shown after selection) */}
            {selectedLevel && !hasSubmitted && <div className="animate-fade-in w-full">
                <p className="text-lg mb-4 text-center font-medium">
                  Tell us where to send you FitAnywhere workout samples for {selectedLevel === 'beginner' ? 'beginners' : 'experts'}! 🏋️‍♂️
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto">
                  <div>
                    <Input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white" />
                  </div>
                  <div>
                    <Input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white" />
                  </div>
                  <Button type="submit" className="bg-yellow hover:bg-yellow-dark text-black font-bold w-full" disabled={isLoading}>
                    {isLoading ? 'Sending...' : 'Send my FREE workouts!'}
                  </Button>
                </form>
              </div>}
            
            {/* Success message (shown after submission) */}
            {hasSubmitted && <div className="animate-fade-in bg-gray-900 p-6 rounded-lg max-w-md mx-auto text-center">
                <h3 className="text-2xl font-bold mb-2">Congratulations, {formData.name}!</h3>
                <p className="mb-4">Your workout sample is on its way to {formData.email}.</p>
              </div>}
          </div>
          
          {/* Right column: Equipment Image */}
          <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center md:justify-start">
            <div className="relative w-full max-w-[40%] md:max-w-[40%] mx-auto" style={isMobile ? {
            maxWidth: '50%'
          } : undefined}>
              <div style={{
              padding: '177.78% 0 0 0',
              position: 'relative'
            }}>
                <VideoPlayer 
                  src="/114 Setup (1080P).mp4" 
                  poster="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744097749/Screenshot_69_w6ixx7.png"
                  aspectRatio="portrait"
                  autoPlay={true}
                  muted={true}
                  loop={true}
                  playMode="always"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default TrainingVault;
