
import {z} from 'genkit';

export const WifiNetworkInputSchema = z.object({
  ssid: z.string().describe("The name of the Wi-Fi network (SSID)."),
  isOpen: z.boolean().describe("Whether the network is open (no password required)."),
});
export type WifiNetworkInput = z.infer<typeof WifiNetworkInputSchema>;

export const AnalyzeWifiInputSchema = z.object({
  networks: z.array(WifiNetworkInputSchema).describe("An array of Wi-Fi networks to analyze."),
});
export type AnalyzeWifiInput = z.infer<typeof AnalyzeWifiInputSchema>;


const WifiAnalysisResultSchema = z.object({
    ssid: z.string().describe("The SSID of the analyzed network."),
    riskScore: z.number().min(0).max(10).describe("A risk score from 0 (very low risk) to 10 (extremely high risk)."),
    analysis: z.string().describe("A detailed analysis explaining the reasoning behind the risk score, including potential red flags."),
    recommendation: z.string().describe("Clear, actionable advice for the user (e.g., 'Avoid this network', 'Use with a VPN', 'Appears safe for general browsing')."),
});

export const AnalyzeWifiOutputSchema = z.object({
  results: z.array(WifiAnalysisResultSchema).describe("An array of analysis results for each submitted Wi-Fi network."),
  overallSummary: z.string().describe("A brief summary of the overall situation, highlighting the most significant threat if one exists.")
});
export type AnalyzeWifiOutput = z.infer<typeof AnalyzeWifiOutputSchema>;
