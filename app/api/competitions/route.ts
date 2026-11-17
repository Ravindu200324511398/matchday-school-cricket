import { listCompetitions, safely } from '@/lib/cricket/api';
export const dynamic = 'force-dynamic';
export async function GET() {
 return safely(listCompetitions);
}
