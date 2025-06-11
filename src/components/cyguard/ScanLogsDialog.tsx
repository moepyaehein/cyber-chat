
import type { FC } from 'react';
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
import { AlertTriangle } from 'lucide-react';

interface ScanLogsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const ScanLogsDialog: FC<ScanLogsDialogProps> = ({ isOpen, onOpenChange }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            Scan Logs
            </DialogTitle>
          <DialogDescription>
            This feature will allow you to submit logs for analysis by our AI.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Currently, the "Scan Logs" functionality is under development.
            Soon, you'll be able to upload log files or paste log snippets here to
            identify potential security incidents, anomalies, or misconfigurations.
          </p>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScanLogsDialog;
