import { safely,getLiveMatch } from '@/lib/cricket/api';
export const dynamic='force-dynamic';
export async function GET(request:Request,ctx:{params:Promise<{id:string}>}){return safely(async()=>getLiveMatch((await ctx.params).id,new URL(request.url).searchParams.get('revision')));}
