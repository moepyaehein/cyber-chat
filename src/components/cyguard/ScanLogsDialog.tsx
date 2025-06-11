import type { FC } from 'react';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { handleLogAnalysis } from '@/app/actions';
import type { AnalyzeSecurityLogOutput } from '@/ai/flows/analyze-security-log-flow';
import LoadingDots from './LoadingDots';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, ListChecks, ShieldCheck, Activity, FileText, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const scanLogsSchema = z.object({
  logContent: z.string().min(10, { message: "Please provide at least 10 characters of log data." }).max(10000, { message: "Log content cannot exceed 10000 characters." }),
});

type ScanLogsFormValues = z.infer<typeof scanLogsSchema>;

interface ScanLogsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const ScanLogsDialog: FC<ScanLogsDialogProps> = ({ isOpen, onOpenChange }) => {
  const { toast } = useToast();
  const [view, setView] = useState<'form' | 'result'>('form');
  const [analysisResult, setAnalysisResult] = useState<AnalyzeSecurityLogOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const form = useForm<ScanLogsFormValues>({
    resolver: zodResolver(scanLogsSchema),
    defaultValues: {
      logContent: '',
    },
  });

  const resetDialogState = () => {
    form.reset();
    setAnalysisResult(null);
    setView('form');
    setIsAnalyzing(false);
  };

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      resetDialogState();
    }
    onOpenChange(open);
  };

  const onSubmit: SubmitHandler<ScanLogsFormValues> = async (data) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    const result = await handleLogAnalysis(data.logContent);
    setIsAnalyzing(false);

    if (result.success) {
      toast({
        title: 'Logs Analyzed',
        description: `AI analysis complete. Overall Risk: ${result.analysis.overallRiskLevel}.`,
      });
      setAnalysisResult(result.analysis);
      setView('result');
    } else {
      toast({
        title: 'Analysis Error',
        description: result.error,
        variant: 'destructive',
      });
      setView('form');
    }
  };

  const getRiskLevelVariant = (level: AnalyzeSecurityLogOutput['overallRiskLevel'] | PotentialThreatSchema['severity']) => {
    switch (level) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary'; 
      case 'low': return 'default';
      case 'informational': return 'outline';
      default: return 'outline';
    }
  };
  
  const getRiskLevelIcon = (level: AnalyzeSecurityLogOutput['overallRiskLevel'] | PotentialThreatSchema['severity']) => {
     switch (level) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-4 w-4 mr-1.5" />;
      case 'medium':
        return <Activity className="h-4 w-4 mr-1.5" />; 
      case 'low':
      case 'informational':
        return <CheckCircle className="h-4 w-4 mr-1.5" />;
      default:
        return <ShieldCheck className="h-4 w-4 mr-1.5" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogContent className={view === 'form'
        ? "sm:max-w-2xl md:max-w-3xl lg:max-w-4xl"
        : "sm:max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[90vh] flex flex-col"
      }>
        {view === 'form' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Analyze Security Logs
              </DialogTitle>
              <DialogDescription>
                Paste security log snippets below. CyGuard will analyze them for potential threats and anomalies.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
                <FormField
                  control={form.control}
                  name="logContent"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="log-content" className="sr-only">Log Content</Label>
                      <FormControl>
                        <Textarea
                          id="log-content"
                          placeholder="Paste log data here (e.g., firewall logs, server logs, application logs)..."
                          className="min-h-[250px] max-h-[50vh] resize-y font-mono text-xs"
                          disabled={isAnalyzing}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline" disabled={isAnalyzing}>
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isAnalyzing}>
                    {isAnalyzing ? (
                      <>
                        <LoadingDots /> Analyzing Logs...
                      </>
                    ) : "Analyze Logs"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}

        {view === 'result' && analysisResult && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Log Analysis Report
              </DialogTitle>
              <DialogDescription>
                CyGuard has analyzed the provided log data. Review the findings below.
              </DialogDescription>
            </DialogHeader>
            <div className="flex-grow flex flex-col">
              <ScrollArea className="h-full flex-1">
                <div className="space-y-5 py-3 pr-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        Overall Assessment
                        <Badge variant={getRiskLevelVariant(analysisResult.overallRiskLevel)} className="ml-auto text-xs px-2.5 py-1 capitalize">
                          {getRiskLevelIcon(analysisResult.overallRiskLevel)}
                          {analysisResult.overallRiskLevel}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">
                        {analysisResult.summary}
                      </p>
                    </CardContent>
                  </Card>

                  {analysisResult.potentialThreats && analysisResult.potentialThreats.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-destructive" />
                          Potential Threats Identified
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {analysisResult.potentialThreats.map((threat, index) => (
                          <div key={index} className="p-3 border rounded-md bg-muted/30">
                            <div className="flex justify-between items-center mb-1">
                              <h4 className="font-semibold text-sm">{threat.description}</h4>
                              <Badge variant={getRiskLevelVariant(threat.severity)} className="text-xs capitalize">
                                {getRiskLevelIcon(threat.severity)}
                                {threat.severity}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-1 break-words">
                              <span className="font-medium text-foreground/80">Recommendation:</span> {threat.recommendation}
                            </p>
                            {threat.evidence && threat.evidence.length > 0 && (
                              <div>
                                <p className="text-xs font-medium text-foreground/80 mb-0.5">Evidence:</p>
                                <ul className="space-y-0.5">
                                  {threat.evidence.map((ev, idx) => (
                                    <li key={idx} className="text-xs text-muted-foreground font-mono bg-background/50 px-1.5 py-0.5 rounded-sm break-words whitespace-pre-wrap">
                                      {ev}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {analysisResult.keyObservations && analysisResult.keyObservations.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Activity className="h-5 w-5 text-primary" />
                          Key Observations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          {analysisResult.keyObservations.map((obs, index) => (
                            <li key={index} className="break-words">{obs}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                  
                  {analysisResult.actionableRecommendations && analysisResult.actionableRecommendations.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <ListChecks className="h-5 w-5 text-green-500" />
                          Actionable Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          {analysisResult.actionableRecommendations.map((rec, index) => (
                            <li key={index} className="break-words">{rec}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </ScrollArea>
            </div>
            <DialogFooter className="mt-auto pt-4 border-t">
              <Button type="button" onClick={resetDialogState}>
                Analyze More Logs
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </>
        )}
        {view === 'result' && isAnalyzing && (
          <div className="flex-grow flex justify-center items-center py-10">
            <LoadingDots /> <span className="ml-2">Analyzing...</span>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

interface PotentialThreatSchema {
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  recommendation: string;
  evidence?: string[];
}

export default ScanLogsDialog;