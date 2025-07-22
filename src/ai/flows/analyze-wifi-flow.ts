
'use server';
/**
 * @fileOverview A Genkit flow to analyze Wi-Fi networks for potential "Evil Twin" threats.
 *
 * - analyzeWifiNetworks - A function that analyzes a list of user-provided Wi-Fi networks.
 */

import {ai} from '@/ai/genkit';
import { AnalyzeWifiInputSchema, AnalyzeWifiOutputSchema, type AnalyzeWifiInput, type AnalyzeWifiOutput } from '@/ai/schemas/wifi-analysis-schemas';

export async function analyzeWifiNetworks(input: AnalyzeWifiInput): Promise<AnalyzeWifiOutput> {
  return analyzeWifiFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeWifiPrompt',
  input: {schema: AnalyzeWifiInputSchema},
  output: {schema: AnalyzeWifiOutputSchema},
  prompt: `You are a cybersecurity expert specializing in wireless network security. Your task is to analyze a list of Wi-Fi networks provided by a user and identify potential "Evil Twin" or other malicious access points.

An "Evil Twin" is a rogue Wi-Fi access point that appears to be a legitimate one but is set up to eavesdrop on wireless communications.

Analyze the following list of networks. For each one, consider these factors:
- **SSID Name:** Does the name try to impersonate a well-known brand (e.g., 'Starbuks_Free_Wi-Fi' with a typo)? Does it use generic but alluring names like 'Free WiFi'?
- **Security:** Is the network open (no password)? An open network that purports to be from a sensitive entity (like a bank) is a major red flag. A legitimate guest network for a coffee shop might be open, but a corporate network should not be.
- **Context (based on common knowledge):** Assess the name in the context of where it might be found. For example, 'Google_Guest' is plausible at a Google office, but highly suspicious in a random cafe. 'Free_Airport_WiFi' is a classic name for malicious hotspots.

Based on your analysis of the list, provide a structured response. For each network, determine a risk score, provide a detailed analysis, and a clear recommendation.

Networks to analyze:
{{#each networks}}
- SSID: "{{ssid}}", Security: {{#if isOpen}}Open{{else}}Secured{{/if}}
{{/each}}

Provide a risk score from 0 (very safe) to 10 (extremely dangerous).
Your analysis should be concise but informative.
Your recommendation should be direct and easy for a non-technical user to understand.
Finally, provide an overall summary of the situation.
`,
});

const analyzeWifiFlow = ai.defineFlow(
  {
    name: 'analyzeWifiFlow',
    inputSchema: AnalyzeWifiInputSchema,
    outputSchema: AnalyzeWifiOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
