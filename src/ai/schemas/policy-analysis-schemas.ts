
import {z} from 'genkit';

const KeyFindingSchema = z.object({
  findingType: z.enum(['DataCollection', 'DataSharing', 'DataSecurity', 'UserRights', 'DataRetention', 'PolicyChanges', 'Other'])
    .describe("The category of the policy finding."),
  description: z.string().describe("A simple, one-sentence explanation of what the clause means for the user."),
  riskLevel: z.enum(['low', 'medium', 'high']).describe("The assessed risk level of this finding for the user's privacy."),
});

export const AnalyzePolicyInputSchema = z.object({
  policyUrl: z.string().url().optional().describe('The URL of the privacy policy to analyze.'),
  policyText: z.string().min(100).optional().describe('The full text of the privacy policy to analyze.'),
}).refine(data => data.policyUrl || data.policyText, {
  message: "Either a URL or the policy text must be provided.",
});
export type AnalyzePolicyInput = z.infer<typeof AnalyzePolicyInputSchema>;

export const AnalyzePolicyOutputSchema = z.object({
  overallSummary: z.string().describe("A brief, high-level summary of the policy's implications for user privacy."),
  overallScore: z.number().min(0).max(10).describe("A score from 0 (very bad) to 10 (excellent) representing how privacy-friendly the policy is."),
  keyFindings: z.array(KeyFindingSchema).describe("A list of the most important findings from the policy analysis."),
  redFlags: z.array(z.string()).describe("A list of specific clauses or omissions that are concerning from a privacy perspective."),
  positivePoints: z.array(z.string()).describe("A list of specific clauses that are positive for user privacy."),
});
export type AnalyzePolicyOutput = z.infer<typeof AnalyzePolicyOutputSchema>;
