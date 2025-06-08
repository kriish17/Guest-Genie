import ConciergeChat from './components/ConciergeChat';

export default function Home() {
  return (
    <main className="min-h-screen bg-marriott-secondary flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-marriott-primary mb-2">Welcome to Marriott Concierge</h1>
        <p className="text-marriott-dark text-lg max-w-xl mx-auto">
          Your smart, multimodal assistant for all your hotel needs. Ask about services, local recommendations, or anything else—by text or voice!
        </p>
      </div>
      <ConciergeChat />
    </main>
  );
} 