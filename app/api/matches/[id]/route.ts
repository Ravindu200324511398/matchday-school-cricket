import { safely,getMatch,changeMatch,manageMatch } from '@/lib/cricket/api';
export const dynamic='force-dynamic';
type Context={params:Promise<{id:string}>};
export async function GET(_request:Request,ctx:Context){return safely(async()=>getMatch((await ctx.params).id));}
export async function POST(request:Request,ctx:Context){return safely(async()=>changeMatch(request,(await ctx.params).id));}
export async function PATCH(request:Request,ctx:Context){return safely(async()=>manageMatch(request,(await ctx.params).id));}
