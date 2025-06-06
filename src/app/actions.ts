'use server';

import { assessThreat, type AssessThreatOutput } from '@/ai/flows/assess-threat';
import { z } from 'zod';

const userInputSchema = z.object({
  message: z.string().min(1, "Message cannot be empty.").max(2000, "Message too long."),
});

export interface ClientMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  threatAssessment?: AssessThreatOutput;
  isLoading?: boolean;
}

export async function handleUserMessage(
  messageId: string,
  userInput: string
): Promise<ClientMessage | { error: string }> {
  const parsedInput = userInputSchema.safeParse({ message: userInput });

  if (!parsedInput.success) {
    return { error: parsedInput.error.errors.map(e => e.message).join(', ') };
  }

  try {
    const aiResponse = await assessThreat({ user_input: parsedInput.data.message });
    
    // The AI response includes the main text, threat level, and action steps.
    // We use aiResponse.response as the main chat text from the AI.
    return {
      id: messageId, // Use the client-generated ID for the AI response message
      sender: 'ai',
      text: aiResponse.response,
      threatAssessment: aiResponse,
      isLoading: false,
    };
  } catch (error) {
    console.error("Error calling assessThreat flow:", error);
    return { error: "Sorry, I encountered an issue processing your request. Please try again." };
  }
}
