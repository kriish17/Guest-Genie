import { initializeVectorStore } from '../lib/vectorStore';

async function main() {
  try {
    console.log('Initializing vector store...');
    const vectorStore = await initializeVectorStore();
    console.log('Vector store initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing vector store:', error);
    process.exit(1);
  }
}

main(); 