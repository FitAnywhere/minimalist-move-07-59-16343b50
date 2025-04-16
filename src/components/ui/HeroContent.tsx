
import { memo } from 'react';
import { ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeroContentProps {
  isInView: boolean;
  scrollToOwnBoth: (e: React.MouseEvent) => void;
  isMobile?: boolean;
}

const HeroContent = memo(({
  isInView,
  scrollToOwnBoth,
  isMobile = false
}: HeroContentProps) => {
  const words = ["CALISTHENICS", "BOX", "FITNESS"];
  const [displayText, setDisplayText] = useState(words[0].substring(0, 1));
  const [isDeleting, setIsDeleting] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [isWaiting, setIsWaiting] = useState(false);
  const [showTypewriter, setShowTypewriter] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const typingSpeed = 250;
  const deletingSpeed = 80;
  const waitingTime = 1000;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowTypewriter(true);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!showTypewriter) return;
    const currentWord = words[wordIndex];
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      if (isWaiting) {
        setIsWaiting(false);
        setIsDeleting(true);
        return;
      }
      if (isDeleting) {
        setDisplayText(currentWord.substring(0, displayText.length - 1));
        if (displayText.length === 1) {
          setIsDeleting(false);
          setWordIndex(prevIndex => (prevIndex + 1) % words.length);
        }
      } else {
        setDisplayText(currentWord.substring(0, displayText.length + 1));
        if (displayText.length === currentWord.length) {
          setIsWaiting(true);
        }
      }
    }, isWaiting ? waitingTime : isDeleting ? deletingSpeed : typingSpeed);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [displayText, isDeleting, wordIndex, isWaiting, words, showTypewriter]);

  return <div className="text-center md:text-left">
      <h1 className={cn("text-4xl md:text-5xl lg:text-6xl font-bold text-black transition-all duration-1000", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
        <span className="relative inline-block min-w-[300px] md:min-w-[400px] min-h-[1.2em]">
          {showTypewriter ? <>
              {displayText}
              <span className={`${isWaiting ? 'opacity-0' : 'opacity-100'} inline-block w-[2px] h-[1em] bg-black ml-1 animate-pulse`} aria-hidden="true" />
            </> : <>
              FITNESS
              <span className="inline-block w-[2px] h-[1em] opacity-0 ml-1" aria-hidden="true" />
            </>}
          <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isInView ? "scale-x-100" : "scale-x-0")} aria-hidden="true" />
        </span>
      </h1>
      
      <p className={cn("mt-6 text-xl md:text-2xl text-gray-800 transition-all duration-1000 delay-200", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
        3 IN 1 PORTABLE GYM
      </p>
      
      {!isMobile && <div className={cn("mt-10 transition-all duration-1000 delay-500", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
          <div className="mt-4 space-y-1">
            <p className="text-gray-700 font-bold text-lg">Cancel your gym membership.</p>
            <p className="text-gray-700 px-0 py-[4px] font-bold text-lg">Build muscle at home in 20 mins a day.</p>
          </div>
          
          <button 
            onClick={(e) => e.preventDefault()} 
            disabled
            className="inline-flex items-center bg-yellow text-black hover:bg-yellow-dark rounded-full text-lg font-semibold tracking-wide transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group button-glow py-[15px] px-[58px] my-[20px] cursor-not-allowed opacity-50"
          >
            40% OFF LAUNCH OFFER ↓
            <ArrowDown className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>}
    </div>;
});

HeroContent.displayName = 'HeroContent';
export default HeroContent;
