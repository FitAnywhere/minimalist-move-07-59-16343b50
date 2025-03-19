
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  Vimeo?: {
    Player: any;
  };
}

// Extend HTMLIFrameElement attributes with modern loading attributes
declare namespace React {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    fetchpriority?: 'high' | 'low' | 'auto';
    importance?: 'high' | 'low' | 'auto';
  }
}
