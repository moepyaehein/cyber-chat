
'use server';

/**
 * @fileOverview A flow to index the knowledge base articles into the vector store.
 * This should be run once, or whenever the knowledge base articles are updated.
 */

import {ai} from '@/ai/genkit';
import {knowledgeBase} from '@/lib/knowledge-base';
import {Document} from 'genkit/document';
import {z} from 'zod';

const IndexKnowledgeBaseOutputSchema = z.object({
  indexedDocuments: z.number(),
  docIds: z.array(z.string()),
});
type IndexKnowledgeBaseOutput = z.infer<typeof IndexKnowledgeBaseOutputSchema>;

export async function indexKnowledgeBase(): Promise<IndexKnowledgeBaseOutput> {
  return indexKnowledgeBaseFlow();
}

const indexKnowledgeBaseFlow = ai.defineFlow(
  {
    name: 'indexKnowledgeBaseFlow',
    outputSchema: IndexKnowledgeBaseOutputSchema,
  },
  async () => {
    const documents = knowledgeBase.map(article => {
      return Document.fromText(article.content, {
        title: article.title,
        difficulty: article.difficulty,
        slug: article.slug,
        tags: article.tags.join(', '),
      });
    });

    await ai.retriever.index(documents);

    return {
      indexedDocuments: documents.length,
      docIds: documents.map(d => d.id),
    };
  }
);
