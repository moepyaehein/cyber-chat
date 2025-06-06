import { Shield } from 'lucide-react';
import type { FC } from 'react';

interface PageHeaderProps {}

const PageHeader: FC<PageHeaderProps> = () => {
  return (
    <header className="bg-primary text-primary-foreground py-4 px-6 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center gap-3">
        <Shield className="h-8 w-8" />
        <h1 className="text-2xl font-headline font-semibold">CyGuard</h1>
        <span className="text-sm opacity-90 font-body hidden sm:inline">- Your Cyber Guardian</span>
      </div>
    </header>
  );
};

export default PageHeader;
