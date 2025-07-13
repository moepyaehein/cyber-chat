
import AppLayout from "@/components/cyguard/AppLayout";
import { KnowledgeArticleTabs } from "@/components/cyguard/KnowledgeArticleTabs";
import { knowledgeBase } from "@/lib/knowledge-base";
import { GraduationCap } from "lucide-react";

export default function KnowledgeBasePage() {
  const beginnerArticles = knowledgeBase.filter(article => article.difficulty === 'Beginner');
  const intermediateArticles = knowledgeBase.filter(article => article.difficulty === 'Intermediate');
  const advancedArticles = knowledgeBase.filter(article => article.difficulty === 'Advanced');

  return (
    <AppLayout>
      <div className="container mx-auto max-w-5xl py-8 px-4">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Cybersecurity Knowledge Base
            </h1>
          </div>
          <p className="text-muted-foreground">
            Empower yourself with knowledge. Browse articles from beginner to advanced topics in cybersecurity.
          </p>
        </header>

        <KnowledgeArticleTabs 
            beginnerArticles={beginnerArticles}
            intermediateArticles={intermediateArticles}
            advancedArticles={advancedArticles}
        />
      </div>
    </AppLayout>
  );
}
