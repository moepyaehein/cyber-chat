
"use client";

import type { FC } from "react";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShieldCheck, ShieldAlert, BadgeCheck, FileText, BadgeInfo, ChevronsRight, ShieldQuestion, ThumbsUp, ThumbsDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AnalyzePolicyOutput } from "@/ai/schemas/policy-analysis-schemas";
import { handlePolicyAnalysis } from "@/app/actions";
import LoadingDots from "./LoadingDots";
import { Progress } from "../ui/progress";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  policyText: z.string().optional(),
  policyUrl: z.string().optional(),
  activeTab: z.enum(["paste", "url"]),
}).superRefine((data, ctx) => {
    if (data.activeTab === 'paste') {
        if (!data.policyText || data.policyText.length < 100) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['policyText'],
                message: `Policy text must be at least 100 characters.`,
            });
        }
    }
    if (data.activeTab === 'url') {
        if (!data.policyUrl || !z.string().url().safeParse(data.policyUrl).success) {
             ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['policyUrl'],
                message: `Please enter a valid URL.`,
            });
        }
    }
});


type AnalyzePolicyFormValues = z.infer<typeof formSchema>;

interface AnalyzePolicyDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const AnalyzePolicyDialog: FC<AnalyzePolicyDialogProps> = ({ isOpen, onOpenChange }) => {
  const { toast } = useToast();
  const [view, setView] = useState<'form' | 'result'>('form');
  const [analysisResult, setAnalysisResult] = useState<AnalyzePolicyOutput | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  
  const form = useForm<AnalyzePolicyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      policyUrl: '',
      policyText: '',
      activeTab: 'paste',
    },
  });
  
  const { setValue, trigger, handleSubmit } = form;

  const resetDialogState = () => {
    form.reset();
    setAnalysisResult(null);
    setView('form');
    setIsChecking(false);
  };

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      resetDialogState();
    }
    onOpenChange(open);
  };

  const onTabChange = (value: "paste" | "url") => {
    setValue('activeTab', value, { shouldValidate: true });
    // Clear the other tab's value and errors
    if(value === 'paste') {
        setValue('policyUrl', '');
    } else {
        setValue('policyText', '');
    }
    trigger();
  }

  const onSubmit: SubmitHandler<AnalyzePolicyFormValues> = async (data) => {
    setIsChecking(true);
    setAnalysisResult(null);
    
    // Note: The flow currently doesn't support fetching from URL. 
    // This is handled in the action, which will return an error.
    if(data.activeTab === "url" && data.policyUrl) {
         toast({
            title: 'Feature Not Implemented',
            description: "Fetching from URL is for demonstration purposes. Please paste the policy text.",
            variant: 'destructive',
        });
        setIsChecking(false);
        return;
    }

    const result = await handlePolicyAnalysis(data.policyText, data.policyUrl);
    setIsChecking(false);

    if (result.success) {
      toast({
        title: 'Analysis Complete',
        description: `This policy scored ${result.analysis.overallScore}/10 for privacy.`,
      });
      setAnalysisResult(result.analysis);
      setView('result');
    } else {
      toast({
        title: 'Analysis Failed',
        description: result.error,
        variant: 'destructive',
      });
      setView('form');
    }
  };
  
  const getRiskColor = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-red-500';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogContent className={view === 'form'
        ? "sm:max-w-xl"
        : "sm:max-w-2xl md:max-w-3xl max-h-[90vh] flex flex-col"
      }>
        {view === 'form' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Privacy Policy Analyzer
              </DialogTitle>
              <DialogDescription>
                Paste policy text to get a simple breakdown of what it means for your privacy. URL analysis is not yet implemented.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
                <Tabs 
                    value={form.watch('activeTab')} 
                    onValueChange={(value) => onTabChange(value as "paste" | "url")} 
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="paste">Paste Text</TabsTrigger>
                        <TabsTrigger value="url">From URL</TabsTrigger>
                    </TabsList>
                    <TabsContent value="paste" className="mt-4">
                        <FormField
                            control={form.control}
                            name="policyText"
                            render={({ field }) => (
                                <FormItem>
                                <Label htmlFor="policy-text" className="sr-only">Policy Text</Label>
                                <FormControl>
                                    <Textarea id="policy-text" placeholder="Paste the full privacy policy text here..." {...field} className="min-h-64 max-h-[50vh]"/>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </TabsContent>
                    <TabsContent value="url" className="mt-4">
                        <FormField
                            control={form.control}
                            name="policyUrl"
                            render={({ field }) => (
                                <FormItem>
                                <Label htmlFor="policy-url">Policy URL</Label>
                                <FormControl>
                                    <Input id="policy-url" placeholder="https://example.com/privacy" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <p className="text-xs text-amber-500 mt-2 p-2 bg-amber-500/10 rounded-md">Note: Fetching content from a URL is not implemented in this prototype. This tab is for demonstration purposes only. Please use the 'Paste Text' tab.</p>
                    </TabsContent>
                </Tabs>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline" disabled={isChecking}>Cancel</Button>
                  </DialogClose>
                  <Button type="submit" disabled={isChecking}>
                    {isChecking ? <><LoadingDots /> Analyzing...</> : "Analyze Policy"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}

        {view === 'result' && analysisResult && (
          <>
            <DialogHeader className="text-center items-center pb-4 border-b">
                <div className="w-full">
                    <div className="flex justify-between items-center mb-1">
                        <DialogTitle className="text-xl">
                            Policy Analysis Report
                        </DialogTitle>
                        <Badge className="text-lg">
                           {analysisResult.overallScore} / 10
                        </Badge>
                    </div>
                     <Progress value={analysisResult.overallScore * 10} className="h-2" indicatorClassName={
                         analysisResult.overallScore > 7 ? "bg-green-500" :
                         analysisResult.overallScore > 4 ? "bg-yellow-500" :
                         "bg-red-500"
                     } />
                </div>
              <DialogDescription className="max-w-2xl mx-auto pt-2">
                {analysisResult.overallSummary}
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full pr-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                    <Card className="bg-green-500/10 border-green-500/20">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2 text-green-800 dark:text-green-300"><ThumbsUp /> Positive Points</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc list-inside space-y-1 text-sm text-green-700 dark:text-green-400/90">
                          {analysisResult.positivePoints.length > 0 ? analysisResult.positivePoints.map((point, i) => <li key={i}>{point}</li>) : <li>No significant positive points found.</li>}
                        </ul>
                      </CardContent>
                    </Card>
                     <Card className="bg-red-500/10 border-red-500/20">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2 text-red-800 dark:text-red-300"><ThumbsDown /> Red Flags</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc list-inside space-y-1 text-sm text-red-700 dark:text-red-400/90">
                           {analysisResult.redFlags.length > 0 ? analysisResult.redFlags.map((flag, i) => <li key={i}>{flag}</li>) : <li>No specific red flags identified.</li>}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Key Findings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {analysisResult.keyFindings.map((finding, index) => (
                           <div key={index} className="p-3 border rounded-md bg-muted/30">
                            <div className="flex justify-between items-center mb-1">
                              <h4 className="font-semibold text-sm capitalize flex items-center gap-1.5">{finding.findingType.replace(/([A-Z])/g, ' $1').trim()}</h4>
                              <Badge variant={finding.riskLevel === 'high' ? 'destructive' : finding.riskLevel === 'medium' ? 'secondary' : 'default'} className="text-xs capitalize">
                                <span className={cn('mr-1.5', getRiskColor(finding.riskLevel))}>●</span>
                                {finding.riskLevel} Risk
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground break-words">
                              {finding.description}
                            </p>
                          </div>
                        ))}
                    </CardContent>
                  </Card>
                </ScrollArea>
            </div>
            <DialogFooter className="mt-auto pt-4 border-t">
              <Button type="button" onClick={resetDialogState}>Analyze Another</Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AnalyzePolicyDialog;
