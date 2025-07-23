
import {genkit, GenerationCommonConfig} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {chroma} from '@genkit-ai/chroma';
import path from 'path';

// Base Genkit configuration with Google AI plugin
export const ai = genkit({
  plugins: [
    googleAI(),
    chroma({
      collectionName: 'cyguard-kb-v1',
      embedder: 'googleai/text-embedding-004',
    }),
  ],
  model: 'googleai/gemini-2.0-flash',
  embedder: 'googleai/text-embedding-004',
  retriever: 'chroma',
  logSinks: ['googleCloud'],
  enableTracing: true,
});
