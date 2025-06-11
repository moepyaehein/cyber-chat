
import type { FC } from 'react';
import { useState, useEffect } from 'react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChartBig, AlertTriangle, ShieldCheck, Info, CalendarDays, Tag, ExternalLink } from 'lucide-react';
import { handleFetchThreatIntel } from '@/app/actions';
import type { ThreatIntelAlert } from '@/ai/flows/fetch-threat-intel-flow';
import LoadingDots from './LoadingDots';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow, parseISO } from 'date-fns';

interface ThreatIntelDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const ThreatIntelDialog: FC<ThreatIntelDialogProps> = ({ isOpen, onOpenChange }) => {
  const [alerts, setAlerts] = useState<ThreatIntelAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchIntel();
    } else {
      // Reset state when dialog is closed
      setAlerts([]);
      setError(null);
      setIsLoading(false);
    }
  }, [isOpen]);

  const fetchIntel = async () => {
    setIsLoading(true);
    setError(null);
    const result = await handleFetchThreatIntel();
    setIsLoading(false);

    if (result.success) {
      setAlerts(result.data.alerts);
    } else {
      setError(result.error);
      toast({
        title: "Error Fetching Intel",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const getSeverityIcon = (severity: ThreatIntelAlert['severity']) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium':
        return <Info className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <ShieldCheck className="h-4 w-4 text-sky-500" />;
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getSeverityBadgeVariant = (severity: ThreatIntelAlert['severity']) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive'; // Consider a custom orange variant
      case 'medium': return 'secondary';
      case 'low': return 'default';
      default: return 'outline';
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChartBig className="h-5 w-5 text-primary" />
            Threat Intelligence Overview
          </DialogTitle>
          <DialogDescription>
            Latest cybersecurity alerts and advisories.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-grow overflow-hidden">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full">
              <LoadingDots />
              <p className="mt-2 text-sm text-muted-foreground">Fetching latest intelligence...</p>
            </div>
          )}
          {error && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center">
              <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
              <p className="text-lg font-semibold text-destructive">Failed to Load Threat Intel</p>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <Button onClick={fetchIntel} variant="outline">Try Again</Button>
            </div>
          )}
          {!isLoading && !error && alerts.length === 0 && (
             <div className="flex flex-col items-center justify-center h-full p-4 text-center">
              <Info className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-semibold">No Threat Intelligence Data</p>
              <p className="text-sm text-muted-foreground">There are currently no alerts to display or they could not be fetched.</p>
            </div>
          )}
          {!isLoading && !error && alerts.length > 0 && (
            <ScrollArea className="h-full pr-2">
              <div className="space-y-3 py-1">
                {alerts.map((alert) => (
                  <Card key={alert.id} className="shadow-md hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start gap-2">
                        <CardTitle className="text-base leading-tight">{alert.title}</CardTitle>
                        <Badge variant={getSeverityBadgeVariant(alert.severity)} className="text-xs capitalize shrink-0">
                          {getSeverityIcon(alert.severity)}
                          <span className="ml-1">{alert.severity}</span>
                        </Badge>
                      </div>
                      <CardDescription className="text-xs pt-1 flex items-center gap-1.5">
                        <CalendarDays className="h-3 w-3" />
                        {formatDistanceToNow(parseISO(alert.date), { addSuffix: true })}
                        {alert.source && (
                          <>
                            <span className="mx-1">·</span>
                            <span>Source: {alert.source}</span>
                          </>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3 pt-0">
                      <p className="text-sm text-muted-foreground">{alert.summary}</p>
                    </CardContent>
                    {(alert.tags && alert.tags.length > 0 || alert.link) && (
                       <CardFooter className="text-xs pt-0 pb-3 flex justify-between items-center">
                        <div className="flex flex-wrap gap-1">
                          {alert.tags?.map(tag => (
                            <Badge key={tag} variant="outline" className="px-1.5 py-0.5 text-xs font-normal">
                              <Tag className="h-2.5 w-2.5 mr-1"/>{tag}
                            </Badge>
                          ))}
                        </div>
                        {alert.link && (
                          <Button variant="link" size="sm" asChild className="h-auto p-0 text-xs">
                            <a href={alert.link} target="_blank" rel="noopener noreferrer">
                              Read More <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </Button>
                        )}
                      </CardFooter>
                    )}
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        <DialogFooter className="mt-auto pt-4 border-t">
          <Button type="button" variant="outline" onClick={fetchIntel} disabled={isLoading}>
            {isLoading ? <><LoadingDots /> Refreshing...</> : "Refresh Intel"}
          </Button>
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

