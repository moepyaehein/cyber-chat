
'use server';
/**
 * @fileOverview A Genkit flow to check if an email has been involved in a known data breach (mocked data).
 *
 * - checkDataBreach - A function that checks a given email against a mock breach database.
 * - DataBreachCheckInput - The input type for the checkDataBreach function.
 * - DataBreachCheckOutput - The return type for the checkDataBreach function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Schemas
const BreachDetailSchema = z.object({
  name: z.string().describe("The name of the breached service or company."),
  date: z.string().describe("The date the breach occurred or was discovered."),
  compromisedData: z.array(z.string()).describe("A list of data types that were compromised in the breach (e.g., 'Email addresses', 'Passwords', 'Usernames')."),
  summary: z.string().describe("A brief summary of the breach event."),
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
  emailExists: z.boolean().describe("Whether the email exists in the mock database."),
});
export type DataBreachCheckOutput = z.infer<typeof DataBreachCheckOutputSchema>;

// Mock Data Store
// In a real application, this would be a secure API call to a service like Have I Been Pwned.
const mockBreachDatabase: { [email: string]: BreachDetail[] } = {
  "test@example.com": [
    {
      name: "SocialConnect Platform",
      date: "2023-01-15",
      compromisedData: ["Email addresses", "Passwords", "Usernames", "Phone numbers"],
      summary: "A massive data breach at SocialConnect exposed the personal information of over 200 million users due to a misconfigured database.",
    },
    {
      name: "E-Shop Mania",
      date: "2022-11-20",
      compromisedData: ["Email addresses", "Passwords", "Physical addresses"],
      summary: "E-Shop Mania suffered a sophisticated cyberattack where attackers gained access to customer account details.",
    },
  ],
  "user@example.com": [
     {
      name: "MegaCloud Storage",
      date: "2021-05-30",
      compromisedData: ["Email addresses", "Hashed passwords"],
      summary: "Attackers exploited a vulnerability in MegaCloud's API, leading to the exposure of user emails and hashed passwords.",
    },
  ],
  "safe@example.com": [],
};

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
    const lowercasedEmail = email.toLowerCase();
    const breaches = mockBreachDatabase[lowercasedEmail];
    const emailExists = breaches !== undefined;

    if (!emailExists) {
        return {
            isBreached: false,
            breaches: [],
            recommendation: `The email address ${email} does not exist in our mocked database. This does not mean the email is not real, only that we have no breach records for it.`,
            emailExists: false,
        };
    }

    const isBreached = breaches.length > 0;
    let recommendation = "";
    if (isBreached) {
        recommendation = `The email address ${email} was found in ${breaches.length} known breach(es). It is highly recommended to change the passwords for any accounts associated with this email, especially on the services listed. Enable Two-Factor Authentication (2FA) wherever possible.`;
    } else {
        recommendation = `The email address ${email} was found in our mocked database but had no associated breaches. Continue to practice good security hygiene by using strong, unique passwords and enabling 2FA.`;
    }

    // We don't need an LLM for this mock implementation, just returning structured data.
    return {
      isBreached,
      breaches,
      recommendation,
      emailExists: true,
    };
  }
);
