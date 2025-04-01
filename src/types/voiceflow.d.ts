
interface VoiceflowChat {
  load: (config: any) => void;
  open: () => void;
  close: () => void;
}

interface Voiceflow {
  chat: VoiceflowChat;
}

interface Window {
  voiceflow: Voiceflow;
}
