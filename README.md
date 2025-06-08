# Marriott AI Concierge

An intelligent concierge system for Marriott hotels that combines text and voice interactions using LLMs, RAG, and VAPI for real-time voice processing.

## Features

- 🤖 AI-powered chat interface with context awareness
- 🎙️ Voice interaction support via VAPI.ai
- 📚 RAG implementation for hotel-specific knowledge
- 🎨 Modern UI with Marriott branding
- 📱 Mobile-friendly and accessible design
- 🌍 Local recommendations via Google Places API

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Next.js API Routes
- **AI/ML**: LangChain, OpenAI, Pinecone
- **Voice**: VAPI.ai
- **Styling**: TailwindCSS with Marriott theme

## Prerequisites

- Node.js 18+
- OpenAI API key
- Pinecone API key
- VAPI.ai API key
- Google Places API key

## Environment Variables

Create a `.env.local` file with the following variables:

```env
OPENAI_API_KEY=your_openai_key
PINECONE_API_KEY=your_pinecone_key
PINECONE_ENVIRONMENT=your_pinecone_env
VAPI_API_KEY=your_vapi_key
GOOGLE_PLACES_API_KEY=your_google_places_key
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables
4. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   └── components/        # React components
├── lib/                   # Utility functions
├── public/               # Static assets
└── styles/              # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is proprietary and confidential. 