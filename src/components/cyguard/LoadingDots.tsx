import type { FC } from 'react';

const LoadingDots: FC = () => {
  return (
    <div className="flex items-center space-x-1 p-2">
      <div className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse-dot1"></div>
      <div className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse-dot2"></div>
      <div className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse-dot3"></div>
    </div>
  );
};

export default LoadingDots;
