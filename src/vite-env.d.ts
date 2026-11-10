/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL of the AI assistant worker (see assistant/README.md); empty → the assistant is hidden */
  readonly VITE_ASSISTANT_URL?: string;
}
