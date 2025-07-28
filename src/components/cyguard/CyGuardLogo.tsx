import type { SVGProps } from 'react';
import { cn } from '@/lib/utils';

const CyGuardLogo = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 162 233"
        fill="none"
        className={cn('h-6 w-6', className)}
        {...props}
    >
        <title>CyGuard Logo</title>
        <path
            fill="url(#paint0_linear_53_2)"
            d="M9.829 45.424 81 0l71.171 45.424v123.59L81 214.438l-71.171-45.424V45.424Z"
        />
        <path
            fill="#fff"
            d="m81 19.333 59.309 37.854v103.04L81 198.08l-59.309-37.854V57.187L81 19.333Zm0 137.94v-51.38c0-10.276-8.327-18.6-18.6-18.6s-18.6 8.324-18.6 18.6v59.888l18.6 11.859 18.6-11.86v-8.507Zm0-61.656c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9 4.03-9 9-9Z"
        />
        <path
            fill="url(#paint1_linear_53_2)"
            d="M9.829 45.424 81 0l71.171 45.424-35.586 22.712-35.585-23.4L9.829 45.424Z"
        />
        <path
            fill="url(#paint2_linear_53_2)"
            d="m81 233 71.171-54.847v-38.304L81 185.273V233Z"
        />
        <path
            fill="url(#paint3_linear_53_2)"
            d="m9.829 178.153 71.171 54.847V185.273L9.829 139.849v38.304Z"
        />
        <path fill="#FFC24A" d="M9.829 45.424 45.414 68.136 81 44.735 9.829 45.424Z" />
        <path
            fill="url(#paint4_linear_53_2)"
            d="M45.414 68.136 9.829 45.424v94.425l35.585 22.712V68.136Z"
ci        />
        <path
            fillOpacity={0.2}
            d="M81 185.273V233l-71.171-54.847v-38.304L81 185.273Z"
        />
        <defs>
            <linearGradient
                id="paint0_linear_53_2"
                x1={81}
                y1={0}
                x2={81}
                y2={233}
                gradientUnits="userSpaceOnUse"
            >
                <stop stopColor="#4A90E2" />
                <stop offset={1} stopColor="#4A90E2" />
            </linearGradient>
            <linearGradient
                id="paint1_linear_53_2"
                x1={81}
                y1={0}
                x2={81}
                y2={68.136}
                gradientUnits="userSpaceOnUse"
            >
                <stop stopColor="#F5A623" />
                <stop offset={1} stopColor="#F8E71C" />
            </linearGradient>
            <linearGradient
                id="paint2_linear_53_2"
                x1={81}
                y1={139.849}
                x2={81}
                y2={233}
                gradientUnits="userSpaceOnUse"
            >
                <stop stopColor="#4A90E2" />
                <stop offset={1} stopColor="#4A90E2" />
            </linearGradient>
            <linearGradient
                id="paint3_linear_53_2"
                x1={81}
                y1={139.849}
                x2={81}
                y2={233}
                gradientUnits="userSpaceOnUse"
            >
                <stop stopColor="#4A90E2" />
                <stop offset={1} stopColor="#4A90E2" />
            </linearGradient>
            <linearGradient
                id="paint4_linear_53_2"
                x1={27.622}
                y1={45.424}
                x2={27.622}
                y2={162.561}
                gradientUnits="userSpaceOnUse"
            >
                <stop stopColor="#F5A623" />
                <stop offset={1} stopColor="#F8E71C" />
            </linearGradient>
        </defs>
    </svg>
);

export default CyGuardLogo;
