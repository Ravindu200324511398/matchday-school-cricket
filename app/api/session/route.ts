import { getChatGPTUser } from '@/app/chatgpt-auth';
import { canCreate } from '@/lib/cricket/api';
export const dynamic='force-dynamic';
export async function GET(){const user=await getChatGPTUser();return Response.json({signedIn:!!user,admin:!!user&&canCreate(user),displayName:user?.displayName||null},{headers:{'Cache-Control':'no-store'}});}
