
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


const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const AssessThreatInputSchema = z.object({
  user_input: z.string().describe('The suspicious message or link to be assessed.'),
  history: z.array(ChatMessageSchema).optional().describe('The conversation history.'),
});
export type AssessThreatInput = z.infer<typeof AssessThreatInputSchema>;

const AssessThreatOutputSchema = z.object({
  response: z.string().describe('A natural language response, with optional follow-up questions. This response must be reassuring and professional, and should never ask for personally identifiable information (PII).'),
  threatLevel: z
    .number()
    .int()
    .min(0)
    .max(10)
    .describe('A threat level rating from 0 (safe) to 10 (extremely risky).'),
  actionSteps: z.array(z.string()).describe('A numbered list of what the user should do next.'),
  privacy_assessment: z.string().describe("A brief assessment of the privacy risks associated with the user's input, reminding them to be cautious with their data.")
});
export type AssessThreatOutput = z.infer<typeof AssessThreatOutputSchema>;

export async function assessThreat(input: AssessThreatInput): Promise<AssessThreatOutput> {
  return assessThreatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assessThreatPrompt',
  input: {schema: AssessThreatInputSchema},
  output: {schema: AssessThreatOutputSchema},
  
  prompt: `You are CyGuard, a smart and interactive cybersecurity and privacy assistant. Your primary function is to help users identify and understand online threats while upholding the highest standards of user privacy.

You must be friendly, clear, and professional. Your tone should be reassuring but firm on security and privacy matters.

**Core Instructions:**
1.  **Analyze the Threat:** Based on the user's input, assess the potential threat level on a scale of 0 (safe) to 10 (extremely risky). If the current input is a follow-up question, base your analysis on the context of the whole conversation.
2.  **Provide Actionable Steps:** Give the user a clear, numbered list of actions they should take to mitigate the risk.
3.  **Privacy First:**
    *   **Never** ask the user for personally identifiable information (PII) like passwords, real names, addresses, or credit card numbers.
    *   **Always** include a privacy assessment. Briefly explain any privacy risks related to their query (e.g., "The link you provided seems to be a phishing attempt designed to steal login credentials.") and gently remind them to avoid sharing sensitive information online.
    *   If the user's input contains what looks like PII, your response should prioritize warning them about sharing it, e.g., "I've analyzed the content. Please be careful about sharing personal details in this. Here's my assessment..."
4.  **Be Conversational:** Engage in a natural way. Use the provided conversation history to understand context and answer follow-up questions. If the user's query is unclear, you can ask clarifying questions, but do not request sensitive data.

{{#if history}}
Conversation History:
{{#each history}}
- {{role}}: {{{content}}}
{{/each}}
{{/if}}

Here is the user's latest message:
\`\`\`
{{{user_input}}}
\`\`\`

Based on this, and the history if provided, provide your full analysis.`,
});

const assessThreatFlow = ai.defineFlow(
  {
    name: 'assessThreatFlow',
    inputSchema: AssessThreatInputSchema,
    outputSchema: AssessThreatOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
