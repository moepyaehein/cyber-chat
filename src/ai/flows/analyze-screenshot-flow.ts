
'use server';
/**
 * @fileOverview A Genkit flow to analyze screenshots for phishing and other security threats.
 *
 * - analyzeScreenshot - A function that analyzes a user-provided screenshot.
 * - AnalyzeScreenshotInput - The input type for the analyzeScreenshot function.
 * - AnalyzeScreenshotOutput - The return type for the analyzeScreenshot function.
 */

import {ai} from '@/ai/genkit';
import { AnalyzeScreenshotInputSchema, AnalyzeScreenshotOutputSchema, type AnalyzeScreenshotInput, type AnalyzeScreenshotOutput } from '@/ai/schemas/screenshot-analysis-schemas';

export async function analyzeScreenshot(input: AnalyzeScreenshotInput): Promise<AnalyzeScreenshotOutput> {
  return analyzeScreenshotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeScreenshotPrompt',
  input: {schema: AnalyzeScreenshotInputSchema},
  output: {schema: AnalyzeScreenshotOutputSchema},
  prompt: `You are a cybersecurity expert specializing in visual threat analysis. Your task is to meticulously analyze the provided screenshot for any signs of phishing, scams, or other security threats.

You must analyze both the image content and any accompanying user prompt.

**User Prompt/Question:**
{{{prompt}}}

**Screenshot to Analyze:**
{{media url=screenshotDataUri}}

**Analysis Instructions:**
1.  **Examine Visual Elements:** Look for fake logos, pixelated images, design inconsistencies, or anything that seems unprofessional or out of place for the purported sender.
2.  **Inspect Text Content:** Read all text in the screenshot. Look for urgent or threatening language, spelling and grammar mistakes, generic greetings, and suspicious calls to action.
3.  **Check Links and URLs:** If any URLs, links, or buttons are visible, scrutinize them. Do they point to a legitimate domain? Are there subtle misspellings (typosquatting)?
4.  **Synthesize Findings:** Based on all visual and textual evidence, form a conclusion.
5.  **Provide a Structured Response:**
    *   **riskScore:** Assign a risk score from 0 (Safe) to 10 (Critical Threat).
    *   **summary:** Write a concise summary of your assessment.
    *   **redFlags:** List the specific visual or textual elements that are suspicious. If there are none, return an empty array.
    *   **recommendation:** Provide a clear, direct recommendation to the user.
`,
});

const analyzeScreenshotFlow = ai.defineFlow(
  {
    name: 'analyzeScreenshotFlow',
    inputSchema: AnalyzeScreenshotInputSchema,
    outputSchema: AnalyzeScreenshotOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
