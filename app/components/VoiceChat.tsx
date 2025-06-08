'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const VapiButton = dynamic(
  () => import('@vapi-ai/web').then((mod) => mod.VapiButton),
  { 
    ssr: false,
    loading: () => (
      <button
        disabled
        className="px-4 py-2 bg-marriott-secondary text-marriott-dark rounded-lg opacity-50 cursor-not-allowed"
        title="Loading voice features..."
      >
        🎤
      </button>
    )
  }
);

interface VoiceChatProps {
  isActive: boolean;
  onToggle: () => void;
}

export default function VoiceChat({ isActive, onToggle }: VoiceChatProps) {
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    const checkAvailability = async () => {
      try {
        const vapi = await import('@vapi-ai/web');
        setIsAvailable(!!vapi.VapiButton);
      } catch (error) {
        console.error('VAPI not available:', error);
        setIsAvailable(false);
      }
    };
    checkAvailability();
  }, []);

  if (!isAvailable) {
    return (
      <button
        disabled
        className="px-4 py-2 bg-marriott-secondary text-marriott-dark rounded-lg opacity-50 cursor-not-allowed"
        title="Voice features not available"
      >
        🎤
      </button>
    );
  }

  return (
    <VapiButton
      onToggle={onToggle}
      className={`px-4 py-2 rounded-lg transition-colors ${
        isActive
          ? 'bg-marriott-accent text-white'
          : 'bg-marriott-secondary text-marriott-dark'
      }`}
    />
  );
} 