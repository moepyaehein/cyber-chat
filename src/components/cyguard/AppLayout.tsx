
"use client";

import type { FC, ReactNode } from "react";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import PageHeader from "./PageHeader";
import Sidebar from "./Sidebar";
import { Skeleton } from "@/components/ui/skeleton"; // For loading state

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: FC<AppLayoutProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="space-y-4 p-8 rounded-lg shadow-xl bg-card max-w-sm w-full">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-10 w-full mt-4" />
        </div>
      </div>
    );
  }

  if (!user) {
    // This case should ideally be handled by the redirect,
    // but it's a fallback or for the brief moment before redirect effect runs.
    return null; 
  }

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
