'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import VoiceChat from './VoiceChat';

// Dynamically import VAPI provider with no SSR
const VapiProvider = dynamic(
  () => import('@vapi-ai/web').then((mod) => mod.VapiProvider),
  { 
    ssr: false,
    loading: () => null
  }
);

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ConciergeChatProps {
  guestContext?: {
    roomNumber?: string;
    loyaltyTier?: string;
    checkInDate?: string;
    checkOutDate?: string;
  };
}

export default function ConciergeChat({ guestContext }: ConciergeChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isVapiAvailable, setIsVapiAvailable] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if VAPI is available
    const checkVapiAvailability = async () => {
      try {
        const vapi = await import('@vapi-ai/web');
        setIsVapiAvailable(!!vapi.VapiProvider);
      } catch (error) {
        console.error('VAPI not available:', error);
        setIsVapiAvailable(false);
      }
    };
    checkVapiAvailability();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/chat', {
        message: content,
        guestContext,
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.data.response,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceToggle = () => {
    setIsVoiceActive(!isVoiceActive);
  };

  const renderChat = () => (
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Chat Header */}
      <div className="p-4 bg-marriott-primary text-white rounded-t-lg">
        <h2 className="text-xl font-semibold">Marriott Concierge</h2>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-marriott-primary text-white'
                  : 'bg-marriott-secondary text-marriott-dark'
              }`}
            >
              <p>{message.content}</p>
              <span className="text-xs opacity-70">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-marriott-secondary rounded-lg p-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-marriott-primary rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-marriott-primary rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-marriott-primary rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(input)}
            placeholder="Ask me anything..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-marriott-primary"
          />
          <button
            onClick={() => handleSendMessage(input)}
            className="px-4 py-2 bg-marriott-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Send
          </button>
          <VoiceChat isActive={isVoiceActive} onToggle={handleVoiceToggle} />
        </div>
      </div>
    </div>
  );

  if (!isVapiAvailable) {
    return renderChat();
  }

  return (
    <VapiProvider apiKey={process.env.NEXT_PUBLIC_VAPI_API_KEY || ''}>
      {renderChat()}
    </VapiProvider>
  );
} 