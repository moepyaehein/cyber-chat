
"use client";

import type { FC } from "react";
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
import { Shield, FileWarning, ScanLine, BrainCircuit, LogOut } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useToast } from "@/hooks/use-toast"; // Import useToast

interface SidebarProps {}

const Sidebar: FC<SidebarProps> = () => {
  const { toast } = useToast(); // Initialize useToast

  const handleQuickAction = (action: string) => {
    // console.log(`Quick action: ${action}`); // Keep console log for debugging if needed
    toast({
      title: "Action Triggered",
      description: `${action} action has been initiated.`,
    });
    // In a real application, you would call a function or navigate here
    // For example:
    // if (action === "Report Phishing") {
    //   // openReportPhishingDialog();
    // } else if (action === "Scan Logs") {
    //   // navigateToScanLogsPage();
    // }
  };

  return (
    <ShadSidebar collapsible="icon" variant="sidebar" side="left">
      <SidebarHeader className="items-center justify-center p-4">
        <Shield className="h-8 w-8 text-primary group-data-[collapsible=icon]:h-7 group-data-[collapsible=icon]:w-7" />
        <h1 className="text-xl font-semibold text-primary group-data-[collapsible=icon]:hidden">
          CyGuard
        </h1>
      </SidebarHeader>
      <SidebarContent className="p-2">
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
      </SidebarContent>
      <SidebarFooter className="p-2 items-center flex-row justify-between group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-2">
         <ThemeToggle />
         <Button variant="ghost" size="icon" className="group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8"
            onClick={() => {
              toast({ title: "Logout Requested", description: "Logout functionality to be implemented."});
              console.log("Logout clicked");
            }}
            aria-label="Logout"
          >
            <LogOut className="h-5 w-5" />
          </Button>
      </SidebarFooter>
    </ShadSidebar>
  );
};

export default Sidebar;
