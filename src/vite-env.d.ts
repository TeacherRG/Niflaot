/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL of the AI assistant worker (see assistant/README.md); empty → the assistant is hidden */
  readonly VITE_ASSISTANT_URL?: string;
  /** the newsletter sign-up form posts there (src/components/Subscribe.tsx) */
  readonly VITE_SUBSCRIBE_URL?: string;
}
