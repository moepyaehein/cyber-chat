
'use server';

import { assessThreat, type AssessThreatOutput } from '@/ai/flows/assess-threat';
import { analyzeSecurityLog, type AnalyzeSecurityLogOutput } from '@/ai/flows/analyze-security-log-flow';
import { fetchThreatIntel, type FetchThreatIntelOutput } from '@/ai/flows/fetch-threat-intel-flow';
import { analyzeWifiNetworks } from '@/ai/flows/analyze-wifi-flow';
import { analyzeScreenshot } from '@/ai/flows/analyze-screenshot-flow';
import { AnalyzeWifiInputSchema, type WifiNetworkInput, type AnalyzeWifiOutput } from '@/ai/schemas/wifi-analysis-schemas';
import type { AnalyzeScreenshotOutput } from '@/ai/schemas/screenshot-analysis-schemas';
import { AnalyzeScreenshotInputSchema } from '@/ai/schemas/screenshot-analysis-schemas';
import { z } from 'zod';
import { checkDataBreach as checkDataBreachFlow } from '@/ai/flows/check-data-breach-flow';
import type { CheckDataBreachOutput } from '@/ai/schemas/data-breach-schemas';

const chatInputSchema = z.object({
  message: z.string().max(2000, "Message too long."),
});

const chatHistorySchema = z.array(z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
}));

export interface ClientMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  image?: string;
  threatAssessment?: AssessThreatOutput;
  screenshotAnalysis?: AnalyzeScreenshotOutput;
  isLoading?: boolean;
}

export async function handleUserMessage(
  messageId: string,
  userInput: string,
  history: { role: 'user' | 'model'; content: string }[],
): Promise<ClientMessage | { error: string }> {
  
  const parsedInput = chatInputSchema.safeParse({ message: userInput });
  if (!parsedInput.success) {
    return { error: parsedInput.error.errors.map(e => e.message).join(', ') };
  }

  const parsedHistory = chatHistorySchema.safeParse(history);
  if (!parsedHistory.success) {
     return { error: "Invalid chat history format." };
  }

  try {
    const aiResponse = await assessThreat({
        user_input: parsedInput.data.message,
        history: parsedHistory.data,
    });
    
    return {
        id: messageId,
        sender: 'ai',
        text: aiResponse.response,
        threatAssessment: aiResponse,
        isLoading: false,
    };
  } catch (error) {
    console.error("Error handling user message:", error);
    return { error: "Sorry, I encountered an issue processing your request. Please try again." };
  }
}

const phishingReportSchema = z.object({
  content: z.string().min(10, "Report content is too short.").max(5000, "Report content is too long."),
});

export async function handlePhishingReport(
  reportContent: string
): Promise<{ success: true; assessment: AssessThreatOutput } | { success: false; error: string }> {
  const parsedReport = phishingReportSchema.safeParse({ content: reportContent });

  if (!parsedReport.success) {
    return { success: false, error: parsedReport.error.errors.map(e => e.message).join(', ') };
  }

  try {
    // Phishing report is a one-shot analysis, so no history is passed.
    const aiResponse = await assessThreat({ user_input: parsedReport.data.content, history: [] });
    return { success: true, assessment: aiResponse };
  } catch (error) {
    console.error("Error calling assessThreat flow for phishing report:", error);
    return { success: false, error: "Sorry, I encountered an issue analyzing the report. Please try again." };
  }
}

const securityLogSchema = z.object({
  logContent: z.string().min(10, "Log content is too short.").max(10000, "Log content is too long. Please provide a smaller snippet or break it into parts."),
});

export async function handleLogAnalysis(
  logContent: string
): Promise<{ success: true; analysis: AnalyzeSecurityLogOutput } | { success: false; error: string }> {
  const parsedLog = securityLogSchema.safeParse({ logContent });

  if (!parsedLog.success) {
    return { success: false, error: parsedLog.error.errors.map(e => e.message).join(', ') };
  }

  try {
    const aiResponse = await analyzeSecurityLog({ logContent: parsedLog.data.logContent });
    return { success: true, analysis: aiResponse };
  } catch (error) {
    console.error("Error calling analyzeSecurityLog flow:", error);
    return { success: false, error: "Sorry, I encountered an issue analyzing the logs. Please try again." };
  }
}


export async function handleFetchThreatIntel(): Promise<{ success: true; data: FetchThreatIntelOutput } | { success: false; error: string }> {
  try {
    const intelData = await fetchThreatIntel({}); // Empty input for now
    return { success: true, data: intelData };
  } catch (error) {
    console.error("Error calling fetchThreatIntel flow:", error);
    return { success: false, error: "Sorry, I encountered an issue fetching threat intelligence. Please try again." };
  }
}

export async function handleWifiAnalysis(
  networks: WifiNetworkInput[]
): Promise<{ success: true; analysis: AnalyzeWifiOutput } | { success: false; error: string }> {
  const parsedInput = AnalyzeWifiInputSchema.safeParse({ networks });

  if (!parsedInput.success) {
    return { success: false, error: parsedInput.error.errors.map(e => e.message).join(', ') };
  }

  try {
    const aiResponse = await analyzeWifiNetworks(parsedInput.data);
    return { success: true, analysis: aiResponse };
  } catch (error) {
    console.error("Error calling analyzeWifiNetworks flow:", error);
    return { success: false, error: "Sorry, I encountered an issue analyzing the Wi-Fi networks. Please try again." };
  }
}

export async function handleScreenshotAnalysis(
  prompt: string,
  screenshotDataUri: string
): Promise<{ success: true; analysis: AnalyzeScreenshotOutput } | { success: false; error: string }> {
  const parsedInput = AnalyzeScreenshotInputSchema.safeParse({ prompt, screenshotDataUri });

  if (!parsedInput.success) {
    return { success: false, error: parsedInput.error.errors.map(e => e.message).join(', ') };
  }

  try {
    const aiResponse = await analyzeScreenshot(parsedInput.data);
    return { success: true, analysis: aiResponse };
  } catch (error) {
    console.error("Error calling analyzeScreenshot flow:", error);
    return { success: false, error: "Sorry, I encountered an issue analyzing the screenshot. Please try again." };
  }
}


const emailSchema = z.string().email();

export async function checkDataBreach(email: string): Promise<{ success: true, data: CheckDataBreachOutput } | { success: false, error: string }> {
    const parsedEmail = emailSchema.safeParse(email);
    if(!parsedEmail.success) {
        return { success: false, error: "Invalid email address provided." };
    }

    try {
        const result = await checkDataBreachFlow({ email: parsedEmail.data });
        return { success: true, data: result };
    } catch (error) {
        console.error("Error calling checkDataBreach flow: ", error);
        return { success: false, error: "Sorry, an unexpected error occurred while checking for breaches." };
    }
}
