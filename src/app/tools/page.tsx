
"use client";

import { useState } from 'react';
import AppLayout from "@/components/cyguard/AppLayout";
import { Wrench, FileWarning, ScanLine, BrainCircuit, Wifi, ShieldCheck, FileText } from 'lucide-react';
import ToolCard from '@/components/cyguard/ToolCard';
import ReportPhishingDialog from '@/components/cyguard/ReportPhishingDialog';
import ScanLogsDialog from '@/components/cyguard/ScanLogsDialog';
import ThreatIntelDialog from '@/components/cyguard/ThreatIntelDialog';
import WifiHunterDialog from '@/components/cyguard/WifiHunterDialog';
import DataBreachCheckDialog from '@/components/cyguard/DataBreachCheckDialog';
import AnalyzePolicyDialog from '@/components/cyguard/AnalyzePolicyDialog';

export default function ToolsPage() {
    const [isReportPhishingOpen, setIsReportPhishingOpen] = useState(false);
    const [isScanLogsOpen, setIsScanLogsOpen] = useState(false);
    const [isThreatIntelOpen, setIsThreatIntelOpen] = useState(false);
    const [isWifiHunterOpen, setIsWifiHunterOpen] = useState(false);
    const [isDataBreachCheckOpen, setIsDataBreachCheckOpen] = useState(false);
    const [isAnalyzePolicyOpen, setIsAnalyzePolicyOpen] = useState(false);

  const tools = [
    {
      title: "Report Phishing",
      description: "Paste suspicious content or describe an attempt for an AI-driven threat assessment.",
      icon: <FileWarning />,
      action: () => setIsReportPhishingOpen(true),
    },
    {
      title: "Wi-Fi Hunter",
      description: "Analyze nearby Wi-Fi networks to detect potential 'Evil Twin' or malicious hotspots.",
      icon: <Wifi />,
      action: () => setIsWifiHunterOpen(true),
    },
    {
      title: "Data Breach Check",
      description: "Check if your email has appeared in any known public data breaches.",
      icon: <ShieldCheck />,
      action: () => setIsDataBreachCheckOpen(true),
    },
    {
      title: "Privacy Policy Analyzer",
      description: "Paste a privacy policy to get a simplified, AI-powered breakdown of what it means.",
      icon: <FileText />,
      action: () => setIsAnalyzePolicyOpen(true),
    },
    {
      title: "Scan Security Logs",
      description: "Analyze firewall, server, or application logs for anomalies and potential threats.",
      icon: <ScanLine />,
      action: () => setIsScanLogsOpen(true),
    },
    {
      title: "Threat Intel Feed",
      description: "View the latest cybersecurity alerts and advisories from our intelligence feed.",
      icon: <BrainCircuit />,
      action: () => setIsThreatIntelOpen(true),
    },
  ];

  return (
    <AppLayout>
      <div className="container mx-auto max-w-5xl py-8 px-4">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Wrench className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Security Toolkit
            </h1>
          </div>
          <p className="text-muted-foreground">
            A collection of proactive tools to help you analyze threats and protect your digital life.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <ToolCard 
              key={index}
              title={tool.title}
              description={tool.description}
              icon={tool.icon}
              action={tool.action}
            />
          ))}
        </div>
      </div>
      
      {/* Dialogs that are now controlled by this page */}
      <ReportPhishingDialog isOpen={isReportPhishingOpen} onOpenChange={setIsReportPhishingOpen} />
      <ScanLogsDialog isOpen={isScanLogsOpen} onOpenChange={setIsScanLogsOpen} />
      <ThreatIntelDialog isOpen={isThreatIntelOpen} onOpenChange={setIsThreatIntelOpen} />
      <WifiHunterDialog isOpen={isWifiHunterOpen} onOpenChange={setIsWifiHunterOpen} />
      <DataBreachCheckDialog isOpen={isDataBreachCheckOpen} onOpenChange={setIsDataBreachCheckOpen} />
      <AnalyzePolicyDialog isOpen={isAnalyzePolicyOpen} onOpenChange={setIsAnalyzePolicyOpen} />
    </AppLayout>
  );
}
