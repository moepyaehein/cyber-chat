
import type { FC } from 'react';
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
  const form = useForm<ReportPhishingFormValues>({
    resolver: zodResolver(reportPhishingSchema),
    defaultValues: {
      content: '',
    },
  });

  const onSubmit: SubmitHandler<ReportPhishingFormValues> = (data) => {
    // In a real app, you'd send this data to a backend or an AI flow
    console.log('Phishing Report Submitted:', data.content);
    toast({
      title: 'Report Submitted',
      description: 'Thank you for helping keep our systems secure.',
    });
    form.reset();
    onOpenChange(false); // Close the dialog
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Report Phishing Attempt</DialogTitle>
          <DialogDescription>
            Paste the suspicious email content, link, or describe the phishing attempt below.
            Your report will be analyzed.
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
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Submit Report
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportPhishingDialog;
