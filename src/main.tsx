
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { criticalResourcePreloader } from '@/utils/criticalResourcePreloader'

// Initialize critical resource preloading
criticalResourcePreloader.preloadCriticalImages();

// Modern React 18 rendering with createRoot
createRoot(document.getElementById("root")!).render(<App />);
