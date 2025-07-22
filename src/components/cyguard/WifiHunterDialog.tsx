
import type { FC } from 'react';
import { useState } from 'react';
import { useFieldArray, useForm, type SubmitHandler } from 'react-hook-form';
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
import { handleWifiAnalysis } from '@/app/actions';
import type { AnalyzeWifiOutput } from '@/ai/schemas/wifi-analysis-schemas';
import LoadingDots from './LoadingDots';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Wifi, PlusCircle, Trash2, ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

const wifiNetworkSchema = z.object({
  ssid: z.string().min(1, { message: "SSID cannot be empty." }).max(32, { message: "SSID is too long." }),
  isOpen: z.boolean(),
});

const wifiHunterFormSchema = z.object({
  networks: z.array(wifiNetworkSchema).min(1, "Please add at least one Wi-Fi network."),
});

type WifiHunterFormValues = z.infer<typeof wifiHunterFormSchema>;

interface WifiHunterDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const WifiHunterDialog: FC<WifiHunterDialogProps> = ({ isOpen, onOpenChange }) => {
  const { toast } = useToast();
  const [view, setView] = useState<'form' | 'result'>('form');
  const [analysisResult, setAnalysisResult] = useState<AnalyzeWifiOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const form = useForm<WifiHunterFormValues>({
    resolver: zodResolver(wifiHunterFormSchema),
    defaultValues: {
      networks: [{ ssid: '', isOpen: true }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "networks",
  });

  const resetDialogState = () => {
    form.reset({ networks: [{ ssid: '', isOpen: true }] });
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

  const onSubmit: SubmitHandler<WifiHunterFormValues> = async (data) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    const result = await handleWifiAnalysis(data.networks);
    setIsAnalyzing(false);

    if (result.success) {
      toast({
        title: 'Wi-Fi Analysis Complete',
        description: 'Review the results below.',
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

  const getRiskIcon = (score: number) => {
    if (score > 7) return <ShieldAlert className="h-4 w-4 text-destructive" />;
    if (score > 3) return <ShieldQuestion className="h-4 w-4 text-yellow-500" />;
    return <ShieldCheck className="h-4 w-4 text-green-500" />;
  };

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
                <Wifi className="h-5 w-5 text-primary" />
                Wi-Fi Evil Twin Hunter
              </DialogTitle>
              <DialogDescription>
                Enter the names (SSIDs) of nearby Wi-Fi networks to check for potential threats.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
                <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2 p-2 border rounded-md">
                      <div className="flex-grow space-y-2">
                        <FormField
                          control={form.control}
                          name={`networks.${index}.ssid`}
                          render={({ field }) => (
                            <FormItem>
                              <Label htmlFor={`ssid-${index}`} className="sr-only">SSID</Label>
                              <FormControl>
                                <Input id={`ssid-${index}`} placeholder="e.g., Free_Airport_WiFi" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`networks.${index}.isOpen`}
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-2 space-y-0">
                              <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} id={`isOpen-${index}`} />
                              </FormControl>
                              <Label htmlFor={`isOpen-${index}`} className="text-xs text-muted-foreground font-normal">
                                Open (No Password)
                              </Label>
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive shrink-0"
                        onClick={() => remove(index)}
                        disabled={fields.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button type="button" variant="outline" size="sm" onClick={() => append({ ssid: '', isOpen: true })} className="w-full">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add another network
                </Button>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline" disabled={isAnalyzing}>Cancel</Button>
                  </DialogClose>
                  <Button type="submit" disabled={isAnalyzing}>
                    {isAnalyzing ? <><LoadingDots /> Analyzing...</> : "Analyze Networks"}
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
                <Wifi className="h-5 w-5 text-primary" />
                Wi-Fi Analysis Report
              </DialogTitle>
              <DialogDescription>
                {analysisResult.overallSummary}
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full pr-4">
                  <div className="space-y-3 py-2">
                    {analysisResult.results.map((result, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span className="font-semibold">{result.ssid}</span>
                             <Badge variant={result.riskScore > 7 ? 'destructive' : result.riskScore > 3 ? 'secondary' : 'default'} className="flex items-center gap-1.5">
                                {getRiskIcon(result.riskScore)}
                                Risk: {result.riskScore}/10
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                           <div>
                                <h4 className="font-medium text-foreground/90">Analysis</h4>
                                <p className="text-muted-foreground">{result.analysis}</p>
                           </div>
                            <div>
                                <h4 className="font-medium text-foreground/90">Recommendation</h4>
                                <p className="text-muted-foreground">{result.recommendation}</p>
                           </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
            </div>
            <DialogFooter className="mt-auto pt-4 border-t">
              <Button type="button" onClick={resetDialogState}>Analyze Again</Button>
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

export default WifiHunterDialog;
