import type { SVGProps } from 'react';
import { cn } from '@/lib/utils';

const CyGuardLogo = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn('h-6 w-6', className)}
        {...props}
    >
        <title>CyGuard Logo</title>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="hsl(var(--primary) / 0.2)" />
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <circle cx="12" cy="12" r="3" fill="hsl(var(--primary))" />
    </svg>
);

export default CyGuardLogo;
