import {genkit, GenerationCommonConfig} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Base Genkit configuration with Google AI plugin
export const ai = genkit({
  plugins: [
    googleAI(),
  ],
  model: 'googleai/gemini-2.0-flash',
  embedder: 'googleai/text-embedding-004',
});
