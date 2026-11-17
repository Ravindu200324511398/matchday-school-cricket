import { safely,listMatches,createMatch } from '@/lib/cricket/api';
export const dynamic='force-dynamic';
export async function GET(){return safely(listMatches);}
export async function POST(request:Request){return safely(()=>createMatch(request));}
