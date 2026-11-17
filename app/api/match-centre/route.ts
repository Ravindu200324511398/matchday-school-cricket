import { listFanMatches, safely } from '@/lib/cricket/api';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
 return safely(()=>listFanMatches(new URL(request.url).searchParams.get('competition')));
}
