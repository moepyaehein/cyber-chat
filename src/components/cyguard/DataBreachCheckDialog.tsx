
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { handleDataBreachCheck } from '@/app/actions';
import type { DataBreachCheckOutput } from '@/ai/flows/check-data-breach-flow';
import LoadingDots from './LoadingDots';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, ShieldCheck, ShieldHalf, Calendar, KeyRound, User, Mail, Phone, List, ShieldQuestion } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const breachCheckSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type BreachCheckFormValues = z.infer<typeof breachCheckSchema>;

interface DataBreachCheckDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const DataBreachCheckDialog: FC<DataBreachCheckDialogProps> = ({ isOpen, onOpenChange }) => {
  const { toast } = useToast();
  const [view, setView] = useState<'form' | 'result'>('form');
  const [analysisResult, setAnalysisResult] = useState<DataBreachCheckOutput | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const form = useForm<BreachCheckFormValues>({
    resolver: zodResolver(breachCheckSchema),
    defaultValues: {
      email: '',
    },
  });

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

  const onSubmit: SubmitHandler<BreachCheckFormValues> = async (data) => {
    setIsChecking(true);
    setAnalysisResult(null);

    const result = await handleDataBreachCheck(data.email);
    setIsChecking(false);

    if (result.success) {
      setAnalysisResult(result.result);
      setView('result');
    } else {
      toast({
        title: 'Check Error',
        description: result.error,
        variant: 'destructive',
      });
      setView('form');
    }
  };

  const renderResultCard = (result: DataBreachCheckOutput) => {
    if (!result.emailExists) {
        return (
             <Card className="border-yellow-500/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShieldQuestion className="h-6 w-6 text-yellow-500" /> Email Not in Database
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">{result.recommendation}</p>
                </CardContent>
            </Card>
        )
    }
    if (result.isBreached) {
        return (
            <Card className="border-destructive/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-6 w-6 text-destructive" /> Found in {result.breaches.length} Breach(es)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">{result.recommendation}</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border-green-500/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-6 w-6 text-green-500" /> No Breaches Found!
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{result.recommendation}</p>
            </CardContent>
        </Card>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogContent className={view === 'form'
        ? "sm:max-w-md"
        : "sm:max-w-2xl md:max-w-3xl max-h-[90vh] flex flex-col"
      }>
        {view === 'form' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShieldHalf className="h-5 w-5 text-primary" />
                Data Breach Check
              </DialogTitle>
              <DialogDescription>
                Enter an email address to see if it has appeared in any known (mocked) data breaches.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="email-check">Email Address</Label>
                      <FormControl>
                        <Input
                          id="email-check"
                          placeholder="you@example.com"
                          type="email"
                          disabled={isChecking}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline" disabled={isChecking}>
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isChecking}>
                    {isChecking ? (
                      <>
                        <LoadingDots /> Checking...
                      </>
                    ) : "Check for Breaches"}
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
                <ShieldHalf className="h-5 w-5 text-primary" />
                Breach Report for <span className="font-mono text-primary/90">{form.getValues('email')}</span>
              </DialogTitle>
              <DialogDescription>
                Review the findings from our (mocked) data breach database below.
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full pr-4">
                <div className="space-y-4 py-2">
                  {renderResultCard(analysisResult)}

                  {analysisResult.breaches.map((breach, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <CardTitle className="text-lg">{breach.name}</CardTitle>
                            <CardDescription className="flex items-center gap-1.5 pt-1">
                                <Calendar className="h-4 w-4" />
                                Breached on: {new Date(breach.date).toLocaleDateString()}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-sm text-muted-foreground">{breach.summary}</p>
                            <div>
                                <h4 className="font-semibold flex items-center gap-1.5"><List className="h-4 w-4" /> Compromised Data:</h4>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {breach.compromisedData.map((item, idx) => (
                                        <Badge key={idx} variant="secondary" className="font-normal">{item}</Badge>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <DialogFooter className="mt-auto pt-4 border-t">
              <Button type="button" variant="outline" onClick={resetDialogState}>
                Check Another Email
              </Button>
              <DialogClose asChild>
                <Button type="button">Close</Button>
              </DialogClose>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DataBreachCheckDialog;
