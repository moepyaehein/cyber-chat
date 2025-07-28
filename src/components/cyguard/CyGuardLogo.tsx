import type { SVGProps } from 'react';
import { cn } from '@/lib/utils';

const CyGuardLogo = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={cn('h-6 w-6', className)}
        {...props}
    >
        <title>CyGuard Logo</title>
        <path d="M12 2L3.86 5.54a2 2 0 00-1.36 1.86v6.23a9 9 0 004.5 7.86L12 22l6-1.5a9 9 0 004.5-7.86V7.4a2 2 0 00-1.36-1.86L12 2zm0 3.17L17.14 7.4v6.23a7 7 0 01-3.5 6.16l-1.64.93V12.5a2.5 2.5 0 00-5 0v8.22l-1.64-.93a7 7 0 01-3.5-6.16V7.4L12 5.17zm0 5.33a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
    </svg>
);

export default CyGuardLogo;
