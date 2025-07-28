
"use client";

import type { FC } from "react";
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
import { Shield, LogOut, LogIn, GraduationCap, Home, Wrench } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";


interface SidebarProps {}

const Sidebar: FC<SidebarProps> = () => {
  const { toast } = useToast();
  const { user, signOut, loading } = useAuth();
  const pathname = usePathname();
  
  const handleLogout = async () => {
    await signOut();
    toast({ title: "Logged Out", description: "You have been successfully logged out."});
  }

  return (
    <>
      <ShadSidebar collapsible="icon" variant="sidebar" side="left">
        <SidebarHeader className="items-center justify-center p-4">
            <Link href="/" className="flex items-center justify-center gap-2">
                <Shield className="h-8 w-8 text-primary group-data-[collapsible=icon]:h-7 group-data-[collapsible=icon]:w-7" />
                <h1 className="text-xl font-semibold text-primary group-data-[collapsible=icon]:hidden">
                    CyGuard
                </h1>
            </Link>
        </SidebarHeader>
        <SidebarContent className="p-2">
          {user && !loading && (
            <SidebarMenu>
                <SidebarMenuItem>
                    <Link href="/home" legacyBehavior passHref>
                        <SidebarMenuButton
                        isActive={pathname === '/home'}
                        tooltip={{children: "Chat", side: "right", align:"center"}}
                        >
                        <Home />
                        <span>Chat</span>
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <Link href="/tools" legacyBehavior passHref>
                        <SidebarMenuButton
                        isActive={pathname.startsWith('/tools')}
                        tooltip={{children: "Tools", side: "right", align:"center"}}
                        >
                        <Wrench />
                        <span>Tools</span>
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <Link href="/knowledge" legacyBehavior passHref>
                        <SidebarMenuButton
                        isActive={pathname.startsWith('/knowledge')}
                        tooltip={{children: "Knowledge Base", side: "right", align:"center"}}
                        >
                        <GraduationCap />
                        <span>Knowledge Base</span>
                        </SidebarMenuButton>
                    </Link>
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
    </>
  );
};

export default Sidebar;
