
import { config } from 'dotenv';
config();

import '@/ai/flows/assess-threat.ts';
import '@/ai/flows/recommend-security-steps.ts';
import '@/ai/flows/analyze-security-log-flow.ts';
import '@/ai/flows/fetch-threat-intel-flow.ts';
import '@/ai/flows/analyze-wifi-flow.ts';
import '@/ai/flows/analyze-screenshot-flow.ts';
import '@/ai/flows/check-data-breach-flow.ts';
import '@/ai/schemas/screenshot-analysis-schemas.ts';
