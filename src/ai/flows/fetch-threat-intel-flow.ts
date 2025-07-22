
'use server';
/**
 * @fileOverview A Genkit flow to fetch (mocked) threat intelligence data.
 *
 * - fetchThreatIntel - A function that returns a list of mock threat alerts.
 * - FetchThreatIntelInput - The input type (currently empty).
 * - FetchThreatIntelOutput - The return type, containing a list of alerts.
 */

import {ai} from '@/ai/genkit';
import {z}  from 'genkit';
import { v4 as uuidv4 } from 'uuid';

const ThreatIntelAlertSchema = z.object({
  id: z.string().describe("Unique identifier for the alert."),
  title: z.string().describe("Title of the threat intelligence alert."),
  summary: z.string().describe("A brief summary of the alert."),
  date: z.string().describe("Publication date of the alert (ISO 8601 format)."),
  severity: z.enum(["low", "medium", "high", "critical"]).describe("Severity of the threat."),
  source: z.string().optional().describe("Source of the threat intelligence (e.g., 'CyGuard Labs')."),
  link: z.string().url().optional().describe("Optional link for more details."),
  tags: z.array(z.string()).optional().describe("Keywords or tags associated with the alert."),
});
export type ThreatIntelAlert = z.infer<typeof ThreatIntelAlertSchema>;

const FetchThreatIntelInputSchema = z.object({
  // No input parameters for now, could add filters like category or date range later
  filter: z.string().optional().describe("Optional filter criteria."),
});
export type FetchThreatIntelInput = z.infer<typeof FetchThreatIntelInputSchema>;

const FetchThreatIntelOutputSchema = z.object({
  alerts: z.array(ThreatIntelAlertSchema).describe("A list of threat intelligence alerts."),
});
export type FetchThreatIntelOutput = z.infer<typeof FetchThreatIntelOutputSchema>;

// Mock data store
const mockAlerts: ThreatIntelAlert[] = [
  {
    id: uuidv4(),
    title: "Critical RCE Vulnerability in Apache Struts (CVE-2023-XXXX)",
    summary: "A new remote code execution vulnerability has been discovered in Apache Struts. Systems are at high risk. Immediate patching is required.",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    severity: "critical",
    source: "NVD",
    link: "https://nvd.nist.gov/",
    tags: ["rce", "apache", "vulnerability"],
  },
  {
    id: uuidv4(),
    title: "Phishing Campaign Impersonating Microsoft 365 Login",
    summary: "Ongoing phishing campaign targeting corporate users by mimicking Microsoft 365 login pages to steal credentials. Advise users to be vigilant.",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    severity: "high",
    source: "CyGuard Labs",
    tags: ["phishing", "microsoft365", "credentials"],
  },
  {
    id: uuidv4(),
    title: "Increase in DDoS Attacks Targeting E-commerce",
    summary: "Observed an uptick in Distributed Denial of Service (DDoS) attacks against e-commerce platforms. Review DDoS mitigation strategies.",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    severity: "medium",
    source: "Cloudflare Threat Report",
    link: "https://www.cloudflare.com/learning/ddos/what-is-a-ddos-attack/",
    tags: ["ddos", "e-commerce"],
  },
  {
    id: uuidv4(),
    title: "Malware Found in Popular Open-Source Library",
    summary: "A compromised version of the 'example-utils' library was found on NPM, containing data-stealing malware. Check dependencies and update if necessary.",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    severity: "high",
    source: "Snyk Security",
    tags: ["malware", "supply-chain", "npm"],
  },
  {
    id: uuidv4(),
    title: "Routine Security Advisory: Update Your Browsers",
    summary: "Major browser vendors have released updates addressing several low to medium severity vulnerabilities. Ensure all browsers are updated to the latest versions.",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
    severity: "low",
    source: "Vendor Advisories",
    tags: ["browser", "update", "patch"],
  },
];


export async function fetchThreatIntel(input: FetchThreatIntelInput): Promise<FetchThreatIntelOutput> {
  return fetchThreatIntelFlow(input);
}

// This flow doesn't call an LLM, it just returns structured mock data.
// It's defined as a flow to keep the pattern consistent and allow future integration
// with an LLM or external API if needed.
const fetchThreatIntelFlow = ai.defineFlow(
  {
    name: 'fetchThreatIntelFlow',
    inputSchema: FetchThreatIntelInputSchema,
    outputSchema: FetchThreatIntelOutputSchema,
  },
  async (input) => {
    // In a real scenario, this would fetch data from a database or external API.
    // We could also use an LLM to summarize or generate intel based on some source.
    // For now, we just return the mock data, possibly filtered by input.filter in the future.
    return { alerts: mockAlerts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) };
  }
);
