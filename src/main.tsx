
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './types/voiceflow.d.ts'

declare global {
  interface Window {
    Vimeo?: {
      Player: new (element: HTMLIFrameElement | string | HTMLElement, options?: any) => any;
    };
  }
}

createRoot(document.getElementById("root")!).render(<App />);
