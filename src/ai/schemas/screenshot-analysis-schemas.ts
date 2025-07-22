
import {z} from 'genkit';

export const AnalyzeScreenshotInputSchema = z.object({
  prompt: z.string().optional().describe("The user's question or context about the screenshot."),
  screenshotDataUri: z
    .string()
    .describe(
      "A screenshot image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeScreenshotInput = z.infer<typeof AnalyzeScreenshotInputSchema>;

export const AnalyzeScreenshotOutputSchema = z.object({
  summary: z.string().describe("A concise summary of the findings from the screenshot analysis. State clearly whether it's likely a threat or safe."),
  riskScore: z.number().min(0).max(10).describe("A risk score from 0 (very safe) to 10 (extremely dangerous)."),
  redFlags: z.array(z.string()).describe("A list of specific red flags identified in the screenshot (e.g., 'Suspicious URL visible', 'Logo appears pixelated or fake', 'Urgent and threatening language used')."),
  recommendation: z.string().describe("Clear, actionable advice for the user (e.g., 'Delete this email immediately', 'Do not click any links', 'This appears to be a legitimate notification')."),
});
export type AnalyzeScreenshotOutput = z.infer<typeof AnalyzeScreenshotOutputSchema>;
