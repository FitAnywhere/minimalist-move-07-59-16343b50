
import { useLocation, useNavigate } from 'react-router-dom';

interface LogoProps {
  onNavigate?: () => void;
}

export const Logo = ({ onNavigate }: LogoProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const navigateToHome = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isHomePage) {
      const heroElement = document.querySelector('#hero');
      if (heroElement) {
        window.scrollTo({
          top: heroElement.getBoundingClientRect().top + window.scrollY - 100,
          behavior: 'smooth'
        });
      }
    } else {
      navigate('/', { state: { fromExternalPage: true }});
    }
    onNavigate?.();
  };

  return (
    <a 
      href="/"
      className="text-2xl font-bold tracking-tighter transition-all relative z-50"
      onClick={navigateToHome}
    >
      <span>Fit</span>
      <span className="text-yellow">Anywhere</span>
    </a>
  );
};
