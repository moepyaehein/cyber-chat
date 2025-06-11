
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
import { handlePhishingReport, type ClientMessage } from '@/app/actions'; // ClientMessage might not be directly needed, but AssessThreatOutput is.
import type { AssessThreatOutput } from '@/ai/flows/assess-threat';
import ThreatLevelIndicator from './ThreatLevelIndicator';
import ActionStepsList from './ActionStepsList';
import LoadingDots from './LoadingDots';
import { ScrollArea } from '@/components/ui/scroll-area';


const reportPhishingSchema = z.object({
  content: z.string().min(10, { message: "Please provide at least 10 characters." }).max(5000, { message: "Report content cannot exceed 5000 characters." }),
});

type ReportPhishingFormValues = z.infer<typeof reportPhishingSchema>;

interface ReportPhishingDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const ReportPhishingDialog: FC<ReportPhishingDialogProps> = ({ isOpen, onOpenChange }) => {
  const { toast } = useToast();
  const [view, setView] = useState<'form' | 'result'>('form');
  const [assessmentResult, setAssessmentResult] = useState<AssessThreatOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const form = useForm<ReportPhishingFormValues>({
    resolver: zodResolver(reportPhishingSchema),
    defaultValues: {
      content: '',
    },
  });

  const resetDialogState = () => {
    form.reset();
    setAssessmentResult(null);
    setView('form');
    setIsAnalyzing(false);
  };

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      resetDialogState();
    }
    onOpenChange(open);
  };

  const onSubmit: SubmitHandler<ReportPhishingFormValues> = async (data) => {
    setIsAnalyzing(true);
    setAssessmentResult(null); // Clear previous results

    const result = await handlePhishingReport(data.content);
    setIsAnalyzing(false);

    if (result.success) {
      toast({
        title: 'Report Analyzed',
        description: `AI assessment complete. Threat Level: ${result.assessment.threatLevel}/10.`,
      });
      setAssessmentResult(result.assessment);
      setView('result');
    } else {
      toast({
        title: 'Analysis Error',
        description: result.error,
        variant: 'destructive',
      });
      setView('form'); // Stay on form if error
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-lg">
        {view === 'form' && (
          <>
            <DialogHeader>
              <DialogTitle>Report Phishing Attempt</DialogTitle>
              <DialogDescription>
                Paste the suspicious email content, link, or describe the phishing attempt below.
                Your report will be analyzed by CyGuard.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="phishing-content" className="sr-only">Suspicious Content</Label>
                      <FormControl>
                        <Textarea
                          id="phishing-content"
                          placeholder="Paste suspicious email body, headers, URL, or describe the situation..."
                          className="min-h-[150px] resize-y"
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
                        <LoadingDots /> Analyzing...
                      </>
                    ) : "Submit & Analyze"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}

        {view === 'result' && assessmentResult && (
          <>
            <DialogHeader>
              <DialogTitle>Phishing Report Analysis</DialogTitle>
              <DialogDescription>
                CyGuard has analyzed the content you submitted.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-4 py-2">
                <ThreatLevelIndicator level={assessmentResult.threatLevel} />
                <div>
                  <h4 className="font-semibold text-sm mb-1">AI Response:</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted/50 p-3 rounded-md">
                    {assessmentResult.response}
                  </p>
                </div>
                <ActionStepsList steps={assessmentResult.actionSteps} />
              </div>
            </ScrollArea>
            <DialogFooter>
              <Button type="button" onClick={resetDialogState}>
                Report Another
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </>
        )}
         {view === 'result' && isAnalyzing && ( // Show loading dots if somehow in result view but still analyzing (should not happen)
            <div className="flex justify-center items-center py-10">
                <LoadingDots /> <span className="ml-2">Analyzing...</span>
            </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReportPhishingDialog;
