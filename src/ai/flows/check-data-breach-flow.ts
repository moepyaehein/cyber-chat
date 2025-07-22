
'use server';
/**
 * @fileOverview A Genkit flow to check if an email has been part of a data breach.
 * THIS IS A MOCK IMPLEMENTATION FOR PROTOTYPING.
 *
 * - checkDataBreach - A function that checks a given email against a mock database.
 */

import {ai} from '@/ai/genkit';
import { type CheckDataBreachInput, CheckDataBreachInputSchema, type CheckDataBreachOutput, CheckDataBreachOutputSchema, type BreachDetail } from '@/ai/schemas/data-breach-schemas';

export async function checkDataBreach(input: CheckDataBreachInput): Promise<CheckDataBreachOutput> {
  return checkDataBreachFlow(input);
}


// Mock database of breached emails
const mockBreachDatabase: { [email: string]: BreachDetail[] } = {
  "test@example.com": [
    {
      name: "SocialConnect Platform",
      date: "2023-01-15",
      description: "A large-scale data breach exposed user profiles, including usernames, email addresses, and hashed passwords.",
      dataClasses: ["Email addresses", "Usernames", "Passwords"],
    },
    {
      name: "E-Shop Central",
      date: "2022-07-20",
      description: "Customer database was compromised, exposing names, email addresses, and purchase histories.",
      dataClasses: ["Email addresses", "Names", "Purchase history"],
    },
  ],
  "user@example.com": [
      {
          name: "Online Gaming Forum",
          date: "2021-11-01",
          description: "A forum database was breached, leaking usernames and email addresses.",
          dataClasses: ["Usernames", "Email addresses"],
      }
  ],
  "safe@example.com": [], // An email that is in the system but has no breaches
};


const checkDataBreachFlow = ai.defineFlow(
  {
    name: 'checkDataBreachFlow',
    inputSchema: CheckDataBreachInputSchema,
    outputSchema: CheckDataBreachOutputSchema,
  },
  async ({ email }) => {
    // In a real scenario, this would call an external API like Have I Been Pwned.
    // For this mock, we check against our hardcoded object.

    if (mockBreachDatabase.hasOwnProperty(email)) {
      const breaches = mockBreachDatabase[email];
      if (breaches.length > 0) {
        return {
          found: true,
          breaches: breaches,
          message: `This email was found in ${breaches.length} known data breach(es). It is recommended to change your password for the affected services.`
        };
      } else {
        return {
          found: true,
          breaches: [],
          message: "Good news! This email was checked and no breaches were found."
        };
      }
    } else {
      // Email does not exist in our mock database
      return {
        found: false,
        breaches: [],
        message: "This email address was not found in our records. This does not guarantee it has never been breached, but it is not present in our current dataset."
      };
    }
  }
);
