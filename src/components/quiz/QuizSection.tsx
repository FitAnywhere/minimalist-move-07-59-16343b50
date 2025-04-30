
import React, { useState, useRef, useEffect } from 'react';
import { useInView } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Separator } from '@/components/ui/separator';

// Types for our quiz state
type QuizState = {
  currentStep: number;
  answers: {
    q1: string | null;
    q2: string | null;
    q3: string | null;
    email: string;
  };
  isSubmitting: boolean;
  isCompleted: boolean;
};

const QuizSection = () => {
  const toast = useToast();
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef);
  const [state, setState] = useState<QuizState>({
    currentStep: 0, // 0=intro, 1=q1, 2=q2, 3=q3, 4=email, 5=thank you
    answers: {
      q1: null,
      q2: null,
      q3: null,
      email: '',
    },
    isSubmitting: false,
    isCompleted: false,
  });
  
  const scrollToRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (state.currentStep > 0 && scrollToRef.current) {
      scrollToRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [state.currentStep]);
  
  const nextStep = () => {
    setState(prev => ({
      ...prev,
      currentStep: prev.currentStep + 1,
    }));
  };
  
  const selectAnswer = (question: 'q1' | 'q2', answer: string) => {
    setState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [question]: answer,
      },
      currentStep: prev.currentStep + 1,
    }));
  };
  
  const updateQ3Answer = (answer: string) => {
    setState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        q3: answer,
      },
    }));
  };
  
  const updateEmail = (email: string) => {
    setState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        email,
      },
    }));
  };
  
  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  const submitQuiz = async () => {
    if (!validateEmail(state.answers.email)) {
      toast.toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    if (!state.answers.q3 || state.answers.q3.trim() === '') {
      toast.toast({
        title: "Missing answer",
        description: "Please provide an answer to question 3",
        variant: "destructive",
      });
      return;
    }
    
    setState(prev => ({ ...prev, isSubmitting: true }));
    
    try {
      const response = await fetch('https://hook.eu2.make.com/cscop7on7a9n2eshsjwrhwny6bh74ozo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q1: state.answers.q1,
          q2: state.answers.q2,
          q3: state.answers.q3,
          email: state.answers.email,
        }),
      });
      
      if (response.ok) {
        setState(prev => ({ 
          ...prev, 
          isSubmitting: false,
          isCompleted: true,
          currentStep: 5,
        }));
        
        // Scroll to thank you section
        setTimeout(() => {
          if (scrollToRef.current) {
            scrollToRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
        
      } else {
        throw new Error('Failed to submit quiz');
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.toast({
        title: "Submission failed",
        description: "There was an error submitting your answers. Please try again.",
        variant: "destructive",
      });
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  };
  
  // Options for each multiple choice question
  const q1Options = [
    { icon: '❌', text: 'No space' },
    { icon: '🤯', text: 'No motivation' },
    { icon: '🧠', text: "Don't know what to do" },
    { icon: '😴', text: 'Too boring' },
    { icon: '💪', text: "I'm already working out consistently" },
  ];
  
  const q2Options = [
    { icon: '📈', text: 'Progress tracking' },
    { icon: '🧑‍🏫', text: 'A personal plan' },
    { icon: '🎮', text: 'Fun workouts' },
    { icon: '🧑‍🤝‍🧑', text: 'Group challenges' },
    { icon: '🏠', text: 'A setup I enjoy using' },
  ];

  return (
    <section 
      ref={sectionRef} 
      id="quiz-section" 
      className="py-16 md:py-20 bg-white relative overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Section Title */}
          <div className={cn(
            "text-center mb-12 transition-all duration-1000",
            isInView ? "opacity-100" : "opacity-0 translate-y-8"
          )}>
            <h2 className="text-3xl md:text-5xl font-extrabold text-black relative inline-block">
              YOUR OPINION MATTERS
              <span className={cn(
                "absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", 
                isInView ? "scale-x-100" : "scale-x-0"
              )}></span>
            </h2>
          </div>
          
          {/* Quiz Container */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <div ref={scrollToRef} className="min-h-[300px]">
              {/* Progress indicator */}
              {state.currentStep > 0 && state.currentStep < 5 && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">
                      Step {state.currentStep} of 4
                    </span>
                    <span className="text-sm font-medium">
                      {Math.round((state.currentStep / 4) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow transition-all duration-500 h-2 rounded-full" 
                      style={{ width: `${(state.currentStep / 4) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {/* Introduction - Updated design */}
              {state.currentStep === 0 && (
                <div className={cn(
                  "py-4 md:py-6",
                  isInView ? "animate-fade-in" : ""
                )}>
                  <div className={cn(
                    isMobile 
                      ? "flex flex-col items-center" 
                      : "flex flex-row items-center justify-between gap-6"
                  )}>
                    <div className={cn(
                      "flex flex-col",
                      isMobile ? "items-center text-center w-full" : "items-start text-left w-1/2"
                    )}>
                      <h3 className="text-2xl md:text-3xl font-bold mb-3">
                        €100 for your voice
                      </h3>
                      
                      {isMobile && (
                        <div className="w-full mb-4 px-4">
                          <img 
                            src="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1746005144/Screenshot_10_dzmyl1.png" 
                            alt="FitAnywhere Quiz" 
                            className="w-full h-auto rounded-lg"
                          />
                        </div>
                      )}
                      
                      <p className="text-gray-700 mb-2">
                        Help us improve.
                      </p>
                      <p className="text-gray-700 mb-6">
                        Share your opinion, get <span className="font-bold">€100 OFF</span>.
                      </p>
                      
                      <Button
                        onClick={nextStep}
                        variant="yellow" 
                        size="lg"
                        className="rounded-full font-bold uppercase"
                      >
                        Start Now
                      </Button>
                    </div>
                    
                    {!isMobile && (
                      <div className="w-5/12">
                        <img 
                          src="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1746005144/Screenshot_10_dzmyl1.png" 
                          alt="FitAnywhere Quiz" 
                          className="w-full h-auto rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Question 1 */}
              {state.currentStep === 1 && (
                <div className="animate-fade-in">
                  <h3 className="text-xl font-bold mb-6">
                    What's your biggest obstacle with home workouts?
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {q1Options.map((option, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className={cn(
                          "justify-start text-left h-auto py-3 px-4 hover:bg-yellow/10 hover:border-yellow transition-all",
                          state.answers.q1 === option.text && "border-yellow bg-yellow/10"
                        )}
                        onClick={() => selectAnswer('q1', option.text)}
                      >
                        <span className="text-xl mr-3">{option.icon}</span>
                        <span>{option.text}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Question 2 */}
              {state.currentStep === 2 && (
                <div className="animate-fade-in">
                  <h3 className="text-xl font-bold mb-6">
                    What would motivate you to train regularly at home?
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {q2Options.map((option, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className={cn(
                          "justify-start text-left h-auto py-3 px-4 hover:bg-yellow/10 hover:border-yellow transition-all",
                          state.answers.q2 === option.text && "border-yellow bg-yellow/10"
                        )}
                        onClick={() => selectAnswer('q2', option.text)}
                      >
                        <span className="text-xl mr-3">{option.icon}</span>
                        <span>{option.text}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Question 3 */}
              {state.currentStep === 3 && (
                <div className="animate-fade-in">
                  <h3 className="text-xl font-bold mb-6">
                    If you could wave a magic wand and instantly fix one thing about home training, what would it be?
                  </h3>
                  <div className="mb-6">
                    <Textarea 
                      placeholder="Write your answer here..." 
                      className="min-h-[120px] focus:border-yellow focus:ring-yellow"
                      value={state.answers.q3 || ''}
                      onChange={(e) => updateQ3Answer(e.target.value)}
                    />
                  </div>
                  <div className="text-right">
                    <Button
                      onClick={nextStep}
                      variant="yellow"
                      disabled={!state.answers.q3 || state.answers.q3.trim() === ''}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Email Collection */}
              {state.currentStep === 4 && (
                <div className="animate-fade-in">
                  <h3 className="text-xl font-bold mb-4">
                    Almost done! Enter your email to get your €100 OFF PowerTower™ link.
                  </h3>
                  <div className="mb-6">
                    <Input
                      type="email"
                      placeholder="Your email address"
                      className="focus:border-yellow focus:ring-yellow"
                      value={state.answers.email}
                      onChange={(e) => updateEmail(e.target.value)}
                    />
                  </div>
                  <div className="text-center">
                    <Button
                      onClick={submitQuiz}
                      variant="yellow"
                      size="lg"
                      className="rounded-full font-bold"
                      disabled={state.isSubmitting || !validateEmail(state.answers.email)}
                    >
                      {state.isSubmitting ? 'Submitting...' : 'Get My €100 Gift'}
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Thank You */}
              {state.currentStep === 5 && state.isCompleted && (
                <div className="animate-fade-in text-center py-6">
                  <h3 className="text-2xl font-bold mb-4">
                    🎉 Thanks, Legend.
                  </h3>
                  <p className="text-gray-700 mb-8">
                    Your exclusive €100 OFF link is below 👇
                  </p>
                  
                  <a 
                    href="https://buy.stripe.com/dR65kKbVz15O5bybIZ" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-yellow text-black px-6 py-3 rounded-full font-bold hover:bg-yellow-dark transition-all"
                  >
                    Claim Your €100 Discount
                  </a>
                  
                  <p className="text-sm text-gray-500 mt-4">
                    (Also sent to your email)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuizSection;
