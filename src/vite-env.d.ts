
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

// Vimeo Player API interface
interface VimeoPlayerAPI {
  play: () => Promise<void>;
  pause: () => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  setMuted: (muted: boolean) => Promise<void>;
  setLoop: (loop: boolean) => Promise<void>;
  setAutopause: (autopause: boolean) => Promise<void>;
  loadVideo: (videoId: number) => Promise<void>;
  ready: () => Promise<void>;
  destroy: () => void;
  on: (event: string, callback: (data?: any) => void) => void;
  off: (event: string, callback?: (data?: any) => void) => void;
}
