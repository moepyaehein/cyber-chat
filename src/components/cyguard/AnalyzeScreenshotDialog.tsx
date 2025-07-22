
import type { FC } from 'react';
import { useState, useRef } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
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
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { handleScreenshotAnalysis } from '@/app/actions';
import type { AnalyzeScreenshotOutput } from '@/ai/schemas/screenshot-analysis-schemas';
import LoadingDots from './LoadingDots';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, ScanSearch, CheckCircle, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const analyzeScreenshotSchema = z.object({
  prompt: z.string().max(1000, { message: "Prompt cannot exceed 1000 characters." }).optional(),
  screenshot: z
    .custom<FileList>()
    .refine((files) => files?.length > 0, "A screenshot is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 4MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ),
});

type AnalyzeScreenshotFormValues = z.infer<typeof analyzeScreenshotSchema>;

interface AnalyzeScreenshotDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const AnalyzeScreenshotDialog: FC<AnalyzeScreenshotDialogProps> = ({ isOpen, onOpenChange }) => {
  const { toast } = useToast();
  const [view, setView] = useState<'form' | 'result'>('form');
  const [analysisResult, setAnalysisResult] = useState<AnalyzeScreenshotOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<AnalyzeScreenshotFormValues>({
    resolver: zodResolver(analyzeScreenshotSchema),
    defaultValues: {
      prompt: "Analyze this screenshot for any signs of phishing, scams, or other security threats. Check logos, text, URLs, and the overall layout.",
      screenshot: undefined,
    },
  });

  const resetDialogState = () => {
    form.reset();
    setAnalysisResult(null);
    setView('form');
    setIsAnalyzing(false);
    setPreviewImage(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      resetDialogState();
    }
    onOpenChange(open);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue("screenshot", event.target.files as FileList);
    } else {
        setPreviewImage(null);
    }
  };
  
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const onSubmit: SubmitHandler<AnalyzeScreenshotFormValues> = async (data) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    
    if(!data.screenshot?.[0]) return;

    const imageAsDataUrl = await fileToBase64(data.screenshot[0]);

    const result = await handleScreenshotAnalysis(data.prompt ?? "", imageAsDataUrl);
    setIsAnalyzing(false);

    if (result.success) {
      toast({
        title: 'Screenshot Analyzed',
        description: `AI analysis complete. Threat Level: ${result.analysis.riskScore}/10.`,
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

  const getRiskLevelVariant = (level: number) => {
    if (level > 7) return 'destructive';
    if (level > 4) return 'secondary';
    return 'default';
  };
  
  const getRiskLevelIcon = (level: number) => {
     if (level > 7) return <AlertTriangle className="h-4 w-4 mr-1.5" />;
     if (level > 4) return <Info className="h-4 w-4 mr-1.5" />;
     return <CheckCircle className="h-4 w-4 mr-1.5" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogContent className={view === 'form'
        ? "sm:max-w-xl"
        : "sm:max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[90vh] flex flex-col"
      }>
        {view === 'form' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ScanSearch className="h-5 w-5 text-primary" />
                Analyze Screenshot
              </DialogTitle>
              <DialogDescription>
                Upload a screenshot of a suspicious email, website, or message. CyGuard will analyze it for threats.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
                <FormField
                  control={form.control}
                  name="screenshot"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="screenshot-file">Screenshot File</Label>
                       <FormControl>
                        <Input
                          id="screenshot-file"
                          type="file"
                          accept={ACCEPTED_IMAGE_TYPES.join(",")}
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          disabled={isAnalyzing}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {previewImage && (
                    <div className="border rounded-md p-2 bg-muted/50 max-h-48 overflow-hidden flex justify-center">
                        <Image src={previewImage} alt="Screenshot preview" width={300} height={200} className="object-contain rounded-sm" />
                    </div>
                )}

                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                       <Label htmlFor="prompt-text">Analysis Prompt (Optional)</Label>
                      <FormControl>
                        <Textarea
                          id="prompt-text"
                          placeholder="e.g., Is this email a phishing attempt?"
                          className="min-h-[80px] resize-y"
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
                  <Button type="submit" disabled={isAnalyzing || !previewImage}>
                    {isAnalyzing ? (
                      <>
                        <LoadingDots /> Analyzing...
                      </>
                    ) : "Analyze Screenshot"}
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
                <ScanSearch className="h-5 w-5 text-primary" />
                Screenshot Analysis Report
              </DialogTitle>
            </DialogHeader>
            <div className="flex-grow overflow-hidden">
              <ScrollArea className="h-full pr-4">
                <div className="space-y-4 py-3">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center">
                        Overall Assessment
                        <Badge variant={getRiskLevelVariant(analysisResult.riskScore)} className="ml-auto text-sm px-2.5 py-1 capitalize">
                          {getRiskLevelIcon(analysisResult.riskScore)}
                           Risk Score: {analysisResult.riskScore}/10
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">
                        {analysisResult.summary}
                      </p>
                    </CardContent>
                  </Card>

                  {analysisResult.redFlags && analysisResult.redFlags.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-destructive" />
                          Red Flags Identified
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          {analysisResult.redFlags.map((flag, index) => (
                            <li key={index} className="break-words">{flag}</li>
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
                Analyze Another
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

export default AnalyzeScreenshotDialog;
