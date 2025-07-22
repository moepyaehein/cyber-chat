
import {z} from 'genkit';

// Define the schema for a single breach detail
export const BreachDetailSchema = z.object({
  name: z.string().describe("The name of the breached service or website."),
  date: z.string().describe("The date the breach occurred (YYYY-MM-DD)."),
  description: z.string().describe("A summary of the breach and the data that was exposed."),
  dataClasses: z.array(z.string()).describe("A list of data types that were compromised (e.g., 'Email addresses', 'Passwords', 'Usernames')."),
});
export type BreachDetail = z.infer<typeof BreachDetailSchema>;

// Define the input schema for the flow
export const CheckDataBreachInputSchema = z.object({
  email: z.string().email().describe('The email address to check for breaches.'),
});
export type CheckDataBreachInput = z.infer<typeof CheckDataBreachInputSchema>;

// Define the output schema for the flow
export const CheckDataBreachOutputSchema = z.object({
  found: z.boolean().describe("Whether the email was found in the database."),
  breaches: z.array(BreachDetailSchema).describe('A list of breach details associated with the email. Empty if no breaches were found.'),
  message: z.string().describe("A summary message for the user."),
});
export type CheckDataBreachOutput = z.infer<typeof CheckDataBreachOutputSchema>;
