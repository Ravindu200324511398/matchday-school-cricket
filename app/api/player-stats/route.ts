import { privatePlayerStats,safely } from '@/lib/cricket/api';
export const dynamic='force-dynamic';
export const GET=()=>safely(privatePlayerStats);
