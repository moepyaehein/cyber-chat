
"use client";

import type { FC } from "react";
import { useState } from "react";
import Link from 'next/link';
import {
  Sidebar as ShadSidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Shield, FileWarning, ScanLine, BrainCircuit, LogOut, LogIn } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useToast } from "@/hooks/use-toast";
import ReportPhishingDialog from "./ReportPhishingDialog";
import ScanLogsDialog from "./ScanLogsDialog";
import ThreatIntelDialog from "./ThreatIntelDialog";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {}

const Sidebar: FC<SidebarProps> = () => {
  const { toast } = useToast();
  const { user, signOut, loading } = useAuth();
  const [isReportPhishingOpen, setIsReportPhishingOpen] = useState(false);
  const [isScanLogsOpen, setIsScanLogsOpen] = useState(false);
  const [isThreatIntelOpen, setIsThreatIntelOpen] = useState(false);

  const handleQuickAction = (action: string) => {
    if (!user) {
        toast({ title: "Authentication Required", description: "Please log in to use this feature.", variant: "destructive" });
        return;
    }
    if (action === "Report Phishing") {
      setIsReportPhishingOpen(true);
    } else if (action === "Scan Logs") {
      setIsScanLogsOpen(true);
    } else if (action === "Threat Intel") {
      setIsThreatIntelOpen(true);
    } else {
      toast({
        title: "Action Triggered",
        description: `${action} action has been initiated.`,
      });
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast({ title: "Logged Out", description: "You have been successfully logged out."});
  }

  return (
    <>
      <ShadSidebar collapsible="icon" variant="sidebar" side="left">
        <SidebarHeader className="items-center justify-center p-4">
          <Shield className="h-8 w-8 text-primary group-data-[collapsible=icon]:h-7 group-data-[collapsible=icon]:w-7" />
          <h1 className="text-xl font-semibold text-primary group-data-[collapsible=icon]:hidden">
            CyGuard
          </h1>
        </SidebarHeader>
        <SidebarContent className="p-2">
          {user && !loading && (
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleQuickAction("Report Phishing")}
                  tooltip={{children: "Report Phishing", side: "right", align:"center"}}
                >
                  <FileWarning />
                  <span>Report Phishing</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleQuickAction("Scan Logs")}
                  tooltip={{children: "Scan Logs", side: "right", align:"center"}}
                >
                  <ScanLine />
                  <span>Scan Logs</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleQuickAction("Threat Intel")}
                  tooltip={{children: "Threat Intel", side: "right", align:"center"}}
                >
                  <BrainCircuit />
                  <span>Threat Intel</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          )}
          {!user && !loading && (
             <SidebarMenu>
                <SidebarMenuItem>
                    <Button variant="outline" className="w-full justify-start group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8" asChild>
                        <Link href="/signin">
                            <LogIn className="group-data-[collapsible=icon]:h-4 group-data-[collapsible=icon]:w-4" />
                            <span className="group-data-[collapsible=icon]:hidden">Login</span>
                        </Link>
                    </Button>
                </SidebarMenuItem>
            </SidebarMenu>
          )}
           {loading && (
            <div className="p-2 space-y-2">
              <div className="h-8 bg-muted rounded animate-pulse group-data-[collapsible=icon]:w-8"></div>
              <div className="h-8 bg-muted rounded animate-pulse group-data-[collapsible=icon]:w-8"></div>
              <div className="h-8 bg-muted rounded animate-pulse group-data-[collapsible=icon]:w-8"></div>
            </div>
          )}
        </SidebarContent>
        <SidebarFooter className="p-2 items-center flex-row justify-between group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-2">
           <ThemeToggle />
           {user && !loading && (
             <Button variant="ghost" size="icon" className="group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8"
                onClick={handleLogout}
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
           )}
        </SidebarFooter>
      </ShadSidebar>

      <ReportPhishingDialog
        isOpen={isReportPhishingOpen}
        onOpenChange={setIsReportPhishingOpen}
      />
      <ScanLogsDialog
        isOpen={isScanLogsOpen}
        onOpenChange={setIsScanLogsOpen}
      />
      <ThreatIntelDialog
        isOpen={isThreatIntelOpen}
        onOpenChange={setIsThreatIntelOpen}
      />
    </>
  );
};

export default Sidebar;
