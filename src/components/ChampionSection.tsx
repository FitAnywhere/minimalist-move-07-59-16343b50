import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Video, Clock, Dumbbell, Globe } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { useInView } from '@/utils/animations';
import { useIsMobile } from '@/hooks/use-mobile';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogFooter } from '@/components/ui/dialog';
const ChampionSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(sectionRef);
  const isMobile = useIsMobile();
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isPlayingFullVideo, setIsPlayingFullVideo] = useState(false);
  const [showLibraryAccess, setShowLibraryAccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  // Animated underline effect
  useEffect(() => {
    if (isInView && titleRef.current) {
      setTimeout(() => {
        titleRef.current?.classList.add('underline-animation');
      }, 300);
    }
  }, [isInView]);

  // Improved video handling with proper error handling
  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      const handleCanPlay = () => {
        setIsVideoLoaded(true);
        setVideoError(false);
        console.log("Video can play now");
      };
      const handleError = (e: Event) => {
        console.error("Video error:", e);
        setVideoError(true);
      };

      // Add event listeners
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('error', handleError);

      // Try to play the video when in view
      if (isInView && !videoError) {
        // Use a timeout to give browser a moment to process
        const playTimeout = setTimeout(() => {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.error("Video play error:", error);
              // Only set error if it's not a user interaction error
              if (error.name !== 'NotAllowedError') {
                setVideoError(true);
              }
            });
          }
        }, 300);
        return () => clearTimeout(playTimeout);
      }

      // Cleanup
      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
      };
    }
  }, [isInView, videoError]);

  // Toggle mute state
  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      videoRef.current.muted = newMutedState;
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log("Form submitted:", formData);
    // Show a success message or redirect
    setShowLibraryAccess(false);
    alert("Thank you! Access to the video library will be sent to your email.");
  };
  return <section id="video-library" ref={sectionRef} className="py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text Content with adjusted spacing */}
            <div className="space-y-6 flex flex-col justify-between h-full">
              <div className="space-y-3">
                <h2 ref={titleRef} className="text-3xl md:text-4xl font-extrabold text-black relative inline-block">
                  EXCLUSIVE VIDEO LIBRARY
                  <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isInView ? "scale-x-100" : "scale-x-0")}></span>
                </h2>
                
                
                
              </div>
              
              {/* Feature points with fancy animations */}
              <div className="space-y-5">
                <div className={cn("flex items-start gap-3 transform transition-all duration-500", isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10")} style={{
                transitionDelay: "100ms"
              }}>
                  <div className="flex-shrink-0 p-2 bg-gray-100 rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                    <Video className="h-5 w-5 text-yellow" />
                  </div>
                  <div>
                    <p className="text-lg font-bold">
                      EXPERT GUIDED
                    </p>
                  </div>
                </div>
                
                <div className={cn("flex items-start gap-3 transform transition-all duration-500", isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10")} style={{
                transitionDelay: "200ms"
              }}>
                  <div className="flex-shrink-0 p-2 bg-gray-100 rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                    <Clock className="h-5 w-5 text-yellow" />
                  </div>
                  <div>
                    <p className="text-lg font-bold">
                      20 MINUTE SESSIONS
                    </p>
                  </div>
                </div>
                
                <div className={cn("flex items-start gap-3 transform transition-all duration-500", isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10")} style={{
                transitionDelay: "300ms"
              }}>
                  <div className="flex-shrink-0 p-2 bg-gray-100 rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                    <Dumbbell className="h-5 w-5 text-yellow" />
                  </div>
                  <div>
                    <p className="text-lg font-bold">
                      ADAPTS TO YOU
                    </p>
                  </div>
                </div>
                
                <div className={cn("flex items-start gap-3 transform transition-all duration-500", isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10")} style={{
                transitionDelay: "400ms"
              }}>
                  <div className="flex-shrink-0 p-2 bg-gray-100 rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                    <Globe className="h-5 w-5 text-yellow" />
                  </div>
                  <div>
                    <p className="text-lg font-bold">
                      ANYTIME, ANYWHERE
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Training tagline with reduced spacing */}
              <p className="text-lg text-gray-700 italic font-medium leading-relaxed mt-2">
                Training that fits your lifestyle. Exactly how it should be.
              </p>
            </div>
            
            {/* Video Side */}
            <div className="relative perspective">
              <div className="relative overflow-hidden rounded-2xl shadow-xl transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] group">
                {/* Video with better compatibility */}
                <video ref={videoRef} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" playsInline muted={isMuted} autoPlay loop preload="auto" poster="/lovable-uploads/e524ebde-bbdd-4668-bfd4-595182310d6b.png">
                  <source src="/0314 (3)(1).mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                
                {/* Sound toggle button */}
                <div className="absolute bottom-3 right-3 z-10">
                  <Toggle aria-label={isMuted ? "Unmute video" : "Mute video"} className="bg-black/60 hover:bg-black/80 text-white rounded-full w-10 h-10 flex items-center justify-center" pressed={!isMuted} onPressedChange={toggleMute}>
                    {isMuted ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                      </svg> : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <line x1="23" y1="9" x2="17" y2="15" />
                        <line x1="17" y1="9" x2="23" y2="15" />
                      </svg>}
                  </Toggle>
                </div>
                
                {/* Play Full Video Button (centered) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="bg-black/50 hover:bg-black/70 text-white border-white border-2 rounded-full px-6 py-5 
                      transition-all duration-300 transform hover:scale-105" onClick={() => setIsPlayingFullVideo(true)}>
                    <div className="flex items-center gap-2">
                      <Video className="h-5 w-5" />
                      <span>Play Full Video</span>
                    </div>
                  </button>
                </div>
                
                {/* Pulse Border */}
                <div className="absolute inset-0 border-2 border-yellow rounded-2xl transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Video Modal */}
      <Dialog open={isPlayingFullVideo} onOpenChange={setIsPlayingFullVideo}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden p-1 bg-black">
          <DialogClose className="absolute right-2 top-2 z-10 bg-black/70 text-white rounded-full p-1 hover:bg-black/90">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </DialogClose>

          <div className="aspect-video w-full">
            <video className="w-full h-full object-cover" controls autoPlay>
              <source src="/0314 (3)(1).mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Library Access Modal */}
      <Dialog open={showLibraryAccess} onOpenChange={setShowLibraryAccess}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Get Access to the Full Video Library
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-8 md:grid-cols-2 mt-4">
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <video className="w-full h-full object-cover" autoPlay muted loop>
                <source src="/0314 (3)(1).mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            <div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </label>
                  <input id="name" name="name" type="text" required value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow" placeholder="Enter your name" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </label>
                  <input id="email" name="email" type="email" required value={formData.email} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow" placeholder="Enter your email" />
                </div>

                <div className="pt-2">
                  <button type="submit" className="w-full bg-yellow hover:bg-yellow-dark text-black font-bold py-3 rounded-md">
                    Get Instant Access
                  </button>
                </div>

                <p className="text-xs text-gray-500 text-center mt-2">
                  We respect your privacy. Your information will never be shared.
                </p>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>;
};
export default ChampionSection;