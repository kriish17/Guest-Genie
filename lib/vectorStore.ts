import { OpenAI } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';
import { Pinecone } from '@pinecone-database/pinecone';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Document } from 'langchain/document';

// Sample hotel knowledge base - in production, this would come from a database or CMS
const hotelKnowledge = [
  {
    content: `Marriott Hotel Services:
    - 24/7 Room Service
    - Concierge Service
    - Business Center
    - Fitness Center
    - Swimming Pool
    - Spa Services
    - Restaurant Reservations
    - Airport Shuttle Service`,
    metadata: { category: 'services' }
  },
  {
    content: `Marriott Loyalty Program Benefits:
    - Silver Elite: 10% bonus points
    - Gold Elite: 25% bonus points, room upgrades
    - Platinum Elite: 50% bonus points, suite upgrades
    - Titanium Elite: 75% bonus points, executive lounge access
    - Ambassador Elite: 100% bonus points, personal ambassador`,
    metadata: { category: 'loyalty' }
  },
  {
    content: `Hotel Policies:
    - Check-in: 3:00 PM
    - Check-out: 12:00 PM
    - Late check-out available for elite members
    - Free WiFi for all guests
    - Parking available for $30/day
    - Pet-friendly rooms available
    - Smoking not permitted in rooms`,
    metadata: { category: 'policies' }
  }
];

export async function initializeVectorStore() {
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
    environment: process.env.PINECONE_ENVIRONMENT!,
  });

  const embeddings = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: 'text-embedding-ada-002',
  });

  // Create text splitter
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  // Process documents
  const docs = await textSplitter.createDocuments(
    hotelKnowledge.map(k => k.content),
    hotelKnowledge.map(k => k.metadata)
  );

  // Initialize vector store
  const vectorStore = await PineconeStore.fromDocuments(
    docs,
    embeddings,
    {
      pineconeIndex: pinecone.Index('marriott-concierge'),
      namespace: 'hotel-knowledge',
    }
  );

  return vectorStore;
}

export async function getVectorStore() {
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
    environment: process.env.PINECONE_ENVIRONMENT!,
  });

  return await PineconeStore.fromExistingIndex(
    new OpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'text-embedding-ada-002',
    }),
    {
      pineconeIndex: pinecone.Index('marriott-concierge'),
      namespace: 'hotel-knowledge',
    }
  );
} 