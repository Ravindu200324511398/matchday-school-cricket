import { getFanMatch, safely } from '@/lib/cricket/api';
export const dynamic = 'force-dynamic';
export async function GET(request: Request, context: {params:Promise<{id:string}>}) {
 const {id}=await context.params;
 return safely(()=>getFanMatch(id,new URL(request.url).searchParams.get('revision')));
}
