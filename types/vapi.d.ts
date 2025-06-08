declare module '@vapi-ai/web' {
  import { ComponentType, ReactNode } from 'react';

  interface VapiButtonProps {
    onToggle: () => void;
    className?: string;
  }

  interface VapiProviderProps {
    apiKey: string;
    children: ReactNode;
  }

  export const VapiButton: ComponentType<VapiButtonProps>;
  export const VapiProvider: ComponentType<VapiProviderProps>;
} 