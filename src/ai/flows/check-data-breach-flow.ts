
'use server';
/**
 * @fileOverview A Genkit flow to check if an email has been involved in a known data breach using the 'Have I Been Pwned?' API.
 *
 * - checkDataBreach - A function that checks a given email against the HIBP breach database.
 * - DataBreachCheckInput - The input type for the checkDataBreach function.
 * - DataBreachCheckOutput - The return type for the checkDataBreach function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Schemas
const BreachDetailSchema = z.object({
  name: z.string().describe("The name of the breached service or company. (From HIBP: Name)"),
  date: z.string().describe("The date the breach occurred or was discovered. (From HIBP: BreachDate)"),
  compromisedData: z.array(z.string()).describe("A list of data types that were compromised in the breach (e.g., 'Email addresses', 'Passwords', 'Usernames'). (From HIBP: DataClasses)"),
  summary: z.string().describe("A brief summary of the breach event. (From HIBP: Description)"),
});
export type BreachDetail = z.infer<typeof BreachDetailSchema>;

const DataBreachCheckInputSchema = z.object({
  email: z.string().email().describe("The email address to check for breaches."),
});
export type DataBreachCheckInput = z.infer<typeof DataBreachCheckInputSchema>;

const DataBreachCheckOutputSchema = z.object({
  isBreached: z.boolean().describe("Whether the email was found in any breaches."),
  breaches: z.array(BreachDetailSchema).describe("A list of breach details if the email was found. Empty if not breached."),
  recommendation: z.string().describe("A summary recommendation for the user based on the findings."),
  emailExists: z.boolean().describe("This field is now an indicator of whether the HIBP API found any results for the email."),
});
export type DataBreachCheckOutput = z.infer<typeof DataBreachCheckOutputSchema>;


// Exported Function to call the flow
export async function checkDataBreach(input: DataBreachCheckInput): Promise<DataBreachCheckOutput> {
  return checkDataBreachFlow(input);
}

// The Genkit Flow
const checkDataBreachFlow = ai.defineFlow(
  {
    name: 'checkDataBreachFlow',
    inputSchema: DataBreachCheckInputSchema,
    outputSchema: DataBreachCheckOutputSchema,
  },
  async ({ email }) => {
    const apiKey = process.env.HIBP_API_KEY;

    if (!apiKey) {
        throw new Error("HIBP_API_KEY is not configured. Please set it in your environment variables.");
    }
    
    const hibpApiUrl = `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}`;

    try {
        const response = await fetch(hibpApiUrl, {
            headers: {
                'hibp-api-key': apiKey,
                'user-agent': 'CyGuard-App-Prototype'
            }
        });

        if (response.status === 404) {
            // 404 means the email was not found in any breaches, which is a good thing.
            return {
                isBreached: false,
                breaches: [],
                recommendation: `Good news! The email address ${email} was not found in any of the data breaches indexed by 'Have I Been Pwned?'. Continue to practice good security hygiene.`,
                emailExists: true, // The API call was successful, and we have a definitive "not found" answer.
            };
        }

        if (!response.ok) {
            // Handle other non-successful responses (e.g., 400, 401, 403, 500)
            const errorText = await response.text();
            throw new Error(`HIBP API request failed with status ${response.status}: ${errorText}`);
        }

        const breachData = await response.json();
        
        if (!Array.isArray(breachData) || breachData.length === 0) {
            return {
                isBreached: false,
                breaches: [],
                recommendation: `The email address ${email} was not found in any known breaches.`,
                emailExists: true,
            };
        }
        
        const breaches: BreachDetail[] = breachData.map((item: any) => ({
            name: item.Name,
            date: item.BreachDate,
            compromisedData: item.DataClasses,
            summary: item.Description.replace(/<a[^>]*>|<\/a>/g, ''), // Strip HTML tags from summary
        }));

        return {
            isBreached: true,
            breaches,
            recommendation: `The email address ${email} was found in ${breaches.length} known breach(es). It is highly recommended to change the passwords for any accounts associated with this email, especially on the services listed. Enable Two-Factor Authentication (2FA) wherever possible.`,
            emailExists: true,
        };

    } catch (error: any) {
        console.error("Error calling HIBP API:", error);
        // We can't definitively say if the email exists or not, so we should reflect that.
        return {
            isBreached: false,
            breaches: [],
            recommendation: `Could not check email due to an error: ${error.message}. This could be due to a network issue or an invalid API key.`,
            emailExists: false, 
        };
    }
  }
);
