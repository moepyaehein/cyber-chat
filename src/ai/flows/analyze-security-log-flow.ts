
'use server';
/**
 * @fileOverview Security log analysis AI agent.
 *
 * - analyzeSecurityLog - A function that handles the security log analysis process.
 * - AnalyzeSecurityLogInput - The input type for the analyzeSecurityLog function.
 * - AnalyzeSecurityLogOutput - The return type for the analyzeSecurityLog function.
 */

import {ai} from '@/ai/genkit';
import {z}  from 'genkit';

const AnalyzeSecurityLogInputSchema = z.object({
  logContent: z.string().describe('The security log content to be analyzed. This can be multi-line text representing log entries.'),
});
export type AnalyzeSecurityLogInput = z.infer<typeof AnalyzeSecurityLogInputSchema>;

const PotentialThreatSchema = z.object({
  description: z.string().describe("Description of the potential threat or anomaly found in the logs."),
  severity: z.enum(["low", "medium", "high", "critical"]).describe("The assessed severity of the threat."),
  recommendation: z.string().describe("Recommended action to mitigate or investigate this specific threat."),
  evidence: z.array(z.string()).describe("Specific log lines or patterns that indicate this threat."),
});

const AnalyzeSecurityLogOutputSchema = z.object({
  summary: z.string().describe("A concise summary of the findings from the log analysis. This should highlight the most critical issues found, if any."),
  potentialThreats: z.array(PotentialThreatSchema).describe("A list of potential threats, anomalies, or suspicious activities identified in the logs."),
  overallRiskLevel: z.enum(["low", "medium", "high", "critical", "informational"]).describe("An overall risk level assessed from the log analysis. 'Informational' if no specific threats are found but there are points of interest."),
  keyObservations: z.array(z.string()).describe("A list of key observations or patterns noted, even if not direct threats (e.g., unusual login times, repeated failed attempts)."),
  actionableRecommendations: z.array(z.string()).describe("A list of general actionable recommendations for improving security based on the log review, beyond specific threats."),
});
export type AnalyzeSecurityLogOutput = z.infer<typeof AnalyzeSecurityLogOutputSchema>;

export async function analyzeSecurityLog(input: AnalyzeSecurityLogInput): Promise<AnalyzeSecurityLogOutput> {
  return analyzeSecurityLogFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSecurityLogPrompt',
  input: {schema: AnalyzeSecurityLogInputSchema},
  output: {schema: AnalyzeSecurityLogOutputSchema},
  prompt: `You are an expert Senior Security Operations Center (SOC) Analyst. Your task is to meticulously analyze the provided security log content.
Identify potential threats, anomalies, suspicious activities, and misconfigurations.

Log Content to Analyze:
\`\`\`
{{{logContent}}}
\`\`\`

Based on your analysis, provide a structured response:
- summary: A concise summary of your findings. If no threats are found, state that clearly.
- potentialThreats: A list of identified threats. For each threat, include:
    - description: What is the threat?
    - severity: How severe is it (low, medium, high, critical)?
    - recommendation: What should be done about it?
    - evidence: Which specific log lines or patterns support this finding? (Cite 2-3 key pieces of evidence)
- overallRiskLevel: Your overall assessment of the risk based on these logs (low, medium, high, critical, informational).
- keyObservations: Any other notable observations or patterns (e.g., unusual activity, policy violations) even if not direct threats.
- actionableRecommendations: General recommendations for improving security posture based on what you've seen in the logs.

Focus on accuracy and provide actionable insights. If the logs are very short or seem incomplete, note that in your summary. If no specific threats are found, ensure 'potentialThreats' is an empty array and 'overallRiskLevel' is 'informational' or 'low'.
`,
});

const analyzeSecurityLogFlow = ai.defineFlow(
  {
    name: 'analyzeSecurityLogFlow',
    inputSchema: AnalyzeSecurityLogInputSchema,
    outputSchema: AnalyzeSecurityLogOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
