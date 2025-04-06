import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './types/voiceflow.d.ts'

declare global {
  interface Window {
    Vimeo?: {
      Player: any;
    };
  }
}

createRoot(document.getElementById("root")!).render(<App />);
