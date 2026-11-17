import { listSquads, saveSquad, safely } from '@/lib/cricket/api';
export const dynamic='force-dynamic';
export const GET=()=>safely(listSquads);
export const POST=(request:Request)=>safely(()=>saveSquad(request));
