
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
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, ShieldCheck, ShieldAlert, BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { CheckDataBreachOutput } from "@/ai/schemas/data-breach-schemas";
import { checkDataBreach } from "@/app/actions";
import LoadingDots from "./LoadingDots";


const checkBreachSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type CheckBreachFormValues = z.infer<typeof checkBreachSchema>;

interface DataBreachCheckDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const DataBreachCheckDialog: FC<DataBreachCheckDialogProps> = ({ isOpen, onOpenChange }) => {
  const { toast } = useToast();
  const [view, setView] = useState<'form' | 'result'>('form');
  const [analysisResult, setAnalysisResult] = useState<CheckDataBreachOutput | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const form = useForm<CheckBreachFormValues>({
    resolver: zodResolver(checkBreachSchema),
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

  const onSubmit: SubmitHandler<CheckBreachFormValues> = async (data) => {
    setIsChecking(true);
    setAnalysisResult(null);

    const result = await checkDataBreach(data.email);
    setIsChecking(false);

    if (result.success) {
      toast({
        title: 'Check Complete',
        description: result.data.message,
      });
      setAnalysisResult(result.data);
      setView('result');
    } else {
      toast({
        title: 'Check Failed',
        description: result.error,
        variant: 'destructive',
      });
      setView('form');
    }
  };

  const getResultIcon = () => {
    if (!analysisResult) return null;
    if (analysisResult.breaches.length > 0) {
      return <ShieldAlert className="h-16 w-16 text-destructive" />;
    }
    if (analysisResult.found) {
        return <ShieldCheck className="h-16 w-16 text-green-500" />;
    }
    return <BadgeCheck className="h-16 w-16 text-primary" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogContent className={view === 'form'
        ? "sm:max-w-md"
        : "sm:max-w-2xl max-h-[90vh] flex flex-col"
      }>
        {view === 'form' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Data Breach Check
              </DialogTitle>
              <DialogDescription>
                Enter an email address to see if it has appeared in known data breaches. This is a mock service for demonstration.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="email-check" className="sr-only">Email Address</Label>
                      <FormControl>
                        <Input id="email-check" placeholder="e.g., test@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline" disabled={isChecking}>Cancel</Button>
                  </DialogClose>
                  <Button type="submit" disabled={isChecking}>
                    {isChecking ? <><LoadingDots /> Checking...</> : "Check Email"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}

        {view === 'result' && analysisResult && (
          <>
            <DialogHeader className="text-center items-center pb-4">
               {getResultIcon()}
              <DialogTitle className="text-xl">
                Analysis for: <span className="font-mono text-primary">{form.getValues('email')}</span>
              </DialogTitle>
              <DialogDescription className="max-w-md mx-auto">
                {analysisResult.message}
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full pr-4">
                  {analysisResult.breaches.length > 0 ? (
                      <div className="space-y-3 py-2">
                      {analysisResult.breaches.map((breach, index) => (
                        <Card key={index} className="bg-muted/30">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                               <AlertTriangle className="h-4 w-4 text-destructive" /> {breach.name}
                            </CardTitle>
                             <p className="text-xs text-muted-foreground pt-1">Breach Date: {breach.date}</p>
                          </CardHeader>
                          <CardContent className="space-y-2 text-sm">
                            <p className="text-muted-foreground">{breach.description}</p>
                            <div>
                                <h4 className="font-medium text-foreground/90 mb-1">Compromised Data:</h4>
                                <div className="flex flex-wrap gap-1">
                                    {breach.dataClasses.map(dc => (
                                        <Badge key={dc} variant="secondary">{dc}</Badge>
                                    ))}
                                </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-muted/30 rounded-lg">
                        <BadgeCheck className="h-12 w-12 text-green-500 mb-4" />
                        <h3 className="text-lg font-semibold">No Breaches Found</h3>
                        <p className="text-muted-foreground">This email address was not found in any of the data breaches in our current dataset.</p>
                    </div>
                  )}
                </ScrollArea>
            </div>
            <DialogFooter className="mt-auto pt-4 border-t">
              <Button type="button" onClick={resetDialogState}>Check Another</Button>
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

export default DataBreachCheckDialog;
