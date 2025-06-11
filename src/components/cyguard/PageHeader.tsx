import type { FC } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface PageHeaderProps {}

const PageHeader: FC<PageHeaderProps> = () => {
  return (
    <header className="bg-background/80 backdrop-blur-sm border-b border-border py-3 px-4 md:px-6 sticky top-0 z-40">
      <div className="container mx-auto flex items-center gap-3 max-w-4xl">
        <SidebarTrigger className="md:hidden" />
        {/* Title can be here if needed, or kept in sidebar */}
        {/* <h1 className="text-xl font-semibold text-foreground">CyGuard Chat</h1> */}
        <div className="flex-grow" /> {/* Spacer */}
        {/* ThemeToggle is now in SidebarFooter, can be moved here if preferred */}
      </div>
    </header>
  );
};

export default PageHeader;
