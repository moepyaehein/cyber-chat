
'use server';
/**
 * @fileOverview A Genkit flow to analyze privacy policies for security and privacy concerns.
 *
 * - analyzePolicy - A function that analyzes a privacy policy from text or a URL.
 */
import {ai} from '@/ai/genkit';
import { AnalyzePolicyInputSchema, AnalyzePolicyOutputSchema, type AnalyzePolicyInput, type AnalyzePolicyOutput } from '@/ai/schemas/policy-analysis-schemas';

export async function analyzePolicy(input: AnalyzePolicyInput): Promise<AnalyzePolicyOutput> {
  // In a real implementation, if a URL is provided, we would first fetch the text from the URL.
  // For this prototype, we will assume the text is provided directly and the URL is for context.
  if (input.policyUrl && !input.policyText) {
    // This is where you would add fetching logic.
    // For now, we'll return a message indicating this limitation.
    // In a real app, you'd use a library like 'node-fetch' or 'axios' here.
    throw new Error('Fetching from URL is not implemented in this prototype. Please paste the policy text directly.');
  }

  return analyzePolicyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzePolicyPrompt',
  input: {schema: AnalyzePolicyInputSchema},
  output: {schema: AnalyzePolicyOutputSchema},
  prompt: `You are a meticulous privacy and cybersecurity analyst. Your task is to analyze the provided privacy policy text.
Your goal is to simplify the complex legal language into a clear, understandable summary for an average user.

**Policy Text to Analyze:**
\`\`\`
{{{policyText}}}
\`\`\`
{{#if policyUrl}}
**Source URL (for context):**
{{{policyUrl}}}
{{/if}}

**Your Analysis Must Include:**
1.  **Overall Summary:** A brief, high-level overview of the policy. Is it generally good, bad, or standard?
2.  **Overall Score:** A score from 0 (Extremely Bad) to 10 (Excellent), representing how privacy-friendly the policy is. A higher score means better privacy practices.
3.  **Key Findings:** Identify and list the most important clauses. For each finding, you must include:
    *   **findingType:** Classify the finding into one of these categories: 'DataCollection', 'DataSharing', 'DataSecurity', 'UserRights', 'DataRetention', 'PolicyChanges', 'Other'.
    *   **description:** A simple, one-sentence explanation of what the clause means for the user.
    *   **riskLevel:** Assess the risk associated with this clause: 'low', 'medium', or 'high'.
4.  **Red Flags:** Explicitly list any clauses or missing information that are concerning from a privacy perspective (e.g., vague language, sharing with advertisers, no mention of encryption). If none, return an empty array.
5.  **Positive Points:** Explicitly list any clauses that are good for the user (e.g., clear data deletion processes, strong security commitments, opt-out options). If none, return an empty array.
`,
});

const analyzePolicyFlow = ai.defineFlow(
  {
    name: 'analyzePolicyFlow',
    inputSchema: AnalyzePolicyInputSchema,
    outputSchema: AnalyzePolicyOutputSchema,
  },
  async (input) => {
    // Basic validation, as we are not fetching from URL in this version.
    if (!input.policyText) {
        throw new Error('Policy text is required for analysis.');
    }
    const {output} = await prompt(input);
    return output!;
  }
);
