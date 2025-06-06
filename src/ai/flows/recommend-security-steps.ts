'use server';

/**
 * @fileOverview This file defines a Genkit flow for recommending security steps to users based on a threat assessment.
 *
 * - recommendSecuritySteps - A function that takes a threat assessment as input and returns a list of recommended security steps.
 * - RecommendSecurityStepsInput - The input type for the recommendSecuritySteps function.
 * - RecommendSecurityStepsOutput - The return type for the recommendSecuritySteps function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendSecurityStepsInputSchema = z.object({
  threatAssessment: z
    .string()
    .describe('A detailed assessment of the potential threat.'),
  threatLevel: z
    .number()
    .min(0)
    .max(10)
    .describe('The threat level, from 0 (safe) to 10 (extremely risky).'),
});
export type RecommendSecurityStepsInput = z.infer<
  typeof RecommendSecurityStepsInputSchema
>;

const RecommendSecurityStepsOutputSchema = z.object({
  actionSteps: z
    .array(z.string())
    .describe('A numbered list of recommended actions to take.'),
});
export type RecommendSecurityStepsOutput = z.infer<
  typeof RecommendSecurityStepsOutputSchema
>;

export async function recommendSecuritySteps(
  input: RecommendSecurityStepsInput
): Promise<RecommendSecurityStepsOutput> {
  return recommendSecurityStepsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendSecurityStepsPrompt',
  input: {schema: RecommendSecurityStepsInputSchema},
  output: {schema: RecommendSecurityStepsOutputSchema},
  prompt: `You are CyGuard, a cybersecurity assistant. Based on the following threat assessment and threat level, provide a numbered list of actionable security steps the user should take to mitigate the threat. Be clear, friendly, and focused on safety.

Threat Assessment: {{{threatAssessment}}}
Threat Level: {{{threatLevel}}}/10

Action Steps:`,
});

const recommendSecurityStepsFlow = ai.defineFlow(
  {
    name: 'recommendSecurityStepsFlow',
    inputSchema: RecommendSecurityStepsInputSchema,
    outputSchema: RecommendSecurityStepsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
