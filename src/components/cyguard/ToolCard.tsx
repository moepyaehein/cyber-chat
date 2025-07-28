
"use client";

import type { FC, ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ToolCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  action: () => void;
}

const ToolCard: FC<ToolCardProps> = ({ icon, title, description, action }) => {
  return (
    <Card className="flex flex-col h-full overflow-hidden group transition-all shadow-md hover:shadow-primary/20 hover:shadow-lg hover:border-primary/80">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
        <div className="p-3 bg-primary/10 rounded-full text-primary">
          {icon}
        </div>
        <CardTitle className="text-lg leading-tight">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {description}
        </p>
      </CardContent>
      <div className="p-6 pt-0">
         <Button variant="ghost" onClick={action} className="w-full justify-start p-0 h-auto text-primary">
            Launch Tool <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default ToolCard;
