
import {genkit, GenerationCommonConfig} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import path from 'path';

// Base Genkit configuration with Google AI plugin
export const ai = genkit({
  plugins: [
    googleAI(),
  ],
  model: 'googleai/gemini-2.0-flash',
  logSinks: ['googleCloud'],
  enableTracing: true,
});
