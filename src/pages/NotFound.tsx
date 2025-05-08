
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Check if this is a known route with incorrect formatting
    const path = location.pathname.toLowerCase();
    if (path.includes('box') && path !== '/box') {
      console.log("Detected malformed box URL, redirecting to correct /box path");
      // Navigate to the correct box page
      navigate('/box', { replace: true });
      return;
    }
    
    // Check for redirect path from session storage (from 404.html)
    const redirectPath = sessionStorage.getItem('redirectPath');
    if (redirectPath && redirectPath.includes('box')) {
      console.log("NotFound: Found box redirect path in session storage:", redirectPath);
      sessionStorage.removeItem('redirectPath');
      navigate('/box', { replace: true });
      return;
    }
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-4">
        <div className="mb-6">
          <span className="inline-block p-4 bg-gray-100 rounded-full">
            <Home className="h-10 w-10 text-yellow" />
          </span>
        </div>
        
        <h1 className="text-4xl font-bold mb-3 text-gray-900">Page not found</h1>
        
        <p className="text-gray-600 mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="default" className="bg-yellow hover:bg-yellow/90 text-black">
            <Link to="/" className="flex items-center">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
