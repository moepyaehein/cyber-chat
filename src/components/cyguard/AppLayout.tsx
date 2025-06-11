"use client";

import type { FC, ReactNode } from "react";
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import PageHeader from "./PageHeader";
import Sidebar from "./Sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: FC<AppLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen bg-background text-foreground">
        <Sidebar />
        <SidebarInset className="flex flex-col flex-1 overflow-hidden">
          <PageHeader />
          <main className="flex-grow overflow-y-auto overflow-x-hidden">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
