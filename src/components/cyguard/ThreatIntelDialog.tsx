
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
import { BarChartBig } from 'lucide-react';

interface ThreatIntelDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const ThreatIntelDialog: FC<ThreatIntelDialogProps> = ({ isOpen, onOpenChange }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChartBig className="h-5 w-5 text-primary" />
            Threat Intelligence Overview
            </DialogTitle>
          <DialogDescription>
            Access curated threat intelligence information.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-3">
          <h3 className="font-semibold text-sm text-foreground">Current Global Threat Landscape (Placeholder)</h3>
          <p className="text-xs text-muted-foreground">
            - Increased phishing campaigns targeting financial institutions observed in the last 24 hours.
          </p>
          <p className="text-xs text-muted-foreground">
            - A new critical vulnerability (CVE-202X-XXXXX) has been reported for Apache Struts. Patching is highly recommended.
          </p>
          <p className="text-xs text-muted-foreground">
            - Ransomware groups are actively exploiting unpatched VPN servers. Ensure all VPNs are updated.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            This section will soon feature dynamic, real-time threat intelligence feeds and reports tailored to your organization's profile.
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

export default ThreatIntelDialog;
