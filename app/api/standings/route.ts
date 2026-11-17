import { competitionStandings, saveCompetitionRules, safely } from '@/lib/cricket/api';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
 const competition = new URL(request.url).searchParams.get('competition');
 return safely(()=>competitionStandings(competition));
}
export const POST=(request:Request)=>safely(()=>saveCompetitionRules(request));
