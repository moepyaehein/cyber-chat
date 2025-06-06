'use server';

/**
 * @fileOverview Threat assessment AI agent.
 *
 * - assessThreat - A function that handles the threat assessment process.
 * - AssessThreatInput - The input type for the assessThreat function.
 * - AssessThreatOutput - The return type for the assessThreat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssessThreatInputSchema = z.object({
  user_input: z.string().describe('The suspicious message or link to be assessed.'),
});
export type AssessThreatInput = z.infer<typeof AssessThreatInputSchema>;

const AssessThreatOutputSchema = z.object({
  response: z.string().describe('A natural language response, with optional follow-up questions.'),
  threatLevel: z
    .number()
    .int()
    .min(0)
    .max(10)
    .describe('A threat level rating from 0 (safe) to 10 (extremely risky).'),
  actionSteps: z.array(z.string()).describe('A numbered list of what the user should do next.'),
});
export type AssessThreatOutput = z.infer<typeof AssessThreatOutputSchema>;

export async function assessThreat(input: AssessThreatInput): Promise<AssessThreatOutput> {
  return assessThreatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assessThreatPrompt',
  input: {schema: AssessThreatInputSchema},
  output: {schema: AssessThreatOutputSchema},
  prompt: `You are CyGuard, a smart and interactive cybersecurity assistant. Your job is to help users identify online threats, stay safe, and respond to suspicious activity. Hold natural conversations, ask follow-up questions if needed, and rate the threat level from 0–10 (0 = safe, 10 = extremely risky).

Always be friendly, clear, and focused on safety.

Here is the user's message:

{{user_input}}

Your Output:
- Response: [Natural response, with optional follow-up questions]
- Threat Level: [Number from 0 to 10]
- Action Steps: [Numbered list of what the user should do next]`,
});

const assessThreatFlow = ai.defineFlow(
  {
    name: 'assessThreatFlow',
    inputSchema: AssessThreatInputSchema,
    outputSchema: AssessThreatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
