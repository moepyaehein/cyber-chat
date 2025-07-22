
"use client";

import type { FC } from 'react';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { KnowledgeArticle } from '@/lib/knowledge-base';
import { BookOpen, Tag } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface ArticleListProps {
  articles: KnowledgeArticle[];
}

const ArticleList: FC<ArticleListProps> = ({ articles }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {articles.map((article) => (
      <Dialog key={article.slug}>
        <DialogTrigger asChild>
          <Card className="flex flex-col h-full overflow-hidden group hover:border-primary/80 transition-all cursor-pointer shadow-md hover:shadow-primary/20 hover:shadow-lg">
            <div className="relative aspect-video overflow-hidden" style={{ display: 'block', width: '100%', height: 'auto' }}>
                <Image 
                    src={article.image.url} 
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    data-ai-hint={article.image.hint}
                />
            </div>
            <CardHeader>
              <CardTitle className="text-lg leading-tight">{article.title}</CardTitle>
              <CardDescription className="pt-2 line-clamp-3">{article.summary}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto flex justify-between items-center text-xs">
              <Badge variant="outline" className={cn(
                article.difficulty === 'Beginner' && 'border-green-500/50 text-green-600',
                article.difficulty === 'Intermediate' && 'border-yellow-500/50 text-yellow-600',
                article.difficulty === 'Advanced' && 'border-red-500/50 text-red-600',
                'capitalize'
                )}>
                {article.difficulty}
              </Badge>
              <span className="flex items-center gap-1.5 text-muted-foreground group-hover:text-primary transition-colors">
                <BookOpen className="h-3.5 w-3.5" /> Read More
              </span>
            </CardFooter>
          </Card>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl">{article.title}</DialogTitle>
            <DialogDescription asChild>
              <div className="flex flex-col sm:flex-row gap-x-4 gap-y-1 text-xs items-start sm:items-center">
                <Badge variant="secondary" className="capitalize w-fit">{article.difficulty}</Badge>
                <div className="flex flex-wrap items-center gap-1.5 pt-1 sm:pt-0">
                  <Tag className="h-3 w-3" />
                  {article.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="px-1.5 py-0.5 font-normal">{tag}</Badge>
                  ))}
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full pr-4">
                <article className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap py-4">
                  {article.content}
                </article>
            </ScrollArea>
          </div>
          <DialogClose asChild className="mt-4">
            <Button type="button" variant="outline">Close</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    ))}
  </div>
);

interface KnowledgeArticleTabsProps {
  beginnerArticles: KnowledgeArticle[];
  intermediateArticles: KnowledgeArticle[];
  advancedArticles: KnowledgeArticle[];
}

export const KnowledgeArticleTabs: FC<KnowledgeArticleTabsProps> = ({
  beginnerArticles,
  intermediateArticles,
  advancedArticles,
}) => {
  return (
    <Tabs defaultValue="beginner" className="w-full">
      <TabsList className="grid w-full grid-cols-3 md:w-fit md:mx-auto">
        <TabsTrigger value="beginner">Beginner</TabsTrigger>
        <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
        <TabsTrigger value="advanced">Advanced</TabsTrigger>
      </TabsList>
      <TabsContent value="beginner" className="mt-6">
        <ArticleList articles={beginnerArticles} />
      </TabsContent>
      <TabsContent value="intermediate" className="mt-6">
        <ArticleList articles={intermediateArticles} />
      </TabsContent>
      <TabsContent value="advanced" className="mt-6">
        <ArticleList articles={advancedArticles} />
      </TabsContent>
    </Tabs>
  );
};
