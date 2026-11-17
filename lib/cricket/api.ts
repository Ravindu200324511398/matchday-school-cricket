import { getChatGPTUser, type ChatGPTUser } from '@/app/chatgpt-auth';
import { env } from 'cloudflare:workers';
import { getDb } from '@/db';
import { cricketMatches, cricketPoints, cricketSquads } from '@/db/schema';
import { and, desc, eq, or, isNotNull, sql } from 'drizzle-orm';
import { countStandings } from './standings';
import { summarizeMatch } from './summary.mjs';
import { validateConfig, replay, appendCommand, ScoreError, chaseTarget } from './engine.mjs';
export const json = (data: unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export class ApiError extends Error { constructor(message:string,public status=400){super(message);} }
export async function user(){const u=await getChatGPTUser();if(!u)throw new ApiError('Sign in to manage your matches.',401);return u;}
export async function body(request:Request){
 const origin=request.headers.get('origin');
 if(origin && origin!==new URL(request.url).origin)throw new ApiError('Cross-origin write rejected.',403);
 if(request.headers.get('x-matchday-action')!=='1'||!request.headers.get('content-type')?.includes('application/json'))throw new ApiError('Use the match scoring form.',403);
 if(Number(request.headers.get('content-length')||0)>25000)throw new ApiError('Request is too large.',413);
 const text=await request.text();if(text.length>25000)throw new ApiError('Request is too large.',413);
 try{return JSON.parse(text);}catch{throw new ApiError('Invalid JSON.');}
}
export async function safely(action:()=>Promise<Response>){try{return await action();}catch(error){if(error instanceof ApiError)return json({error:error.message},error.status);if(error instanceof ScoreError)return json({error:error.message},400);console.error('Match API failed',error);return json({error:'Unable to save or load this match. Please retry. Your last saved score is unchanged.'},500);}}
type MatchRow = typeof cricketMatches.$inferSelect;
const emailFor = (u: ChatGPTUser) => u.email.trim().toLowerCase();
export function canCreate(u:ChatGPTUser){
 return !!env.MATCHDAY_ADMIN_EMAIL && emailFor(u)===env.MATCHDAY_ADMIN_EMAIL.trim().toLowerCase();
}
export async function requireAdministrator(){
 const u=await user();
 if(!canCreate(u))throw new ApiError('Only the Site administrator can create matches or manage squads.',403);
 return u;
}
const accessFor = (u: ChatGPTUser) => or(eq(cricketMatches.ownerId,u.userId),eq(cricketMatches.scorerEmail,emailFor(u)));
function present(row:MatchRow,u:ChatGPTUser,detail=false){const config=JSON.parse(row.config);const journal=JSON.parse(row.journal);const isOwner=row.ownerId===u.userId;return {id:row.id,role:isOwner?'admin':'scorer',approvedAt:row.approvedAt,publicScore:!!row.publicScore,publishedAt:row.publishedAt,...(isOwner?{scorerEmail:row.scorerEmail,canEditFixture:!row.approvedAt&&journal.length===0}:{}),config,revision:row.revision,createdAt:row.createdAt,updatedAt:row.updatedAt,state:replay(config,journal),...(detail?{history:journal.map((e:any)=>({id:e.id,at:e.at,command:e.command}))}:{})};}
export async function listMatches(){const u=await user();const rows=await getDb().select().from(cricketMatches).where(accessFor(u)).orderBy(desc(cricketMatches.updatedAt)).limit(100);return json({matches:rows.map(r=>present(r,u)),limit:100});}
export async function createMatch(request:Request){const u=await requireAdministrator();const data=await body(request);const config=validateConfig(data.config);if(typeof data.id!=='string'||!/^[a-zA-Z0-9_-]{10,80}$/.test(data.id))throw new ApiError('Invalid request ID.');const db=getDb();const now=new Date().toISOString();await db.insert(cricketMatches).values({id:data.id,ownerId:u.userId,config:JSON.stringify(config),journal:'[]',revision:0,createdAt:now,updatedAt:now}).onConflictDoNothing();const [row]=await db.select().from(cricketMatches).where(and(eq(cricketMatches.id,data.id),eq(cricketMatches.ownerId,u.userId)));if(!row)throw new ApiError('Could not create match.',409);return json({match:present(row,u,true)},201);}
export async function getMatch(id:string){const u=await user();const [row]=await getDb().select().from(cricketMatches).where(and(eq(cricketMatches.id,id),accessFor(u)));if(!row)throw new ApiError('Match not found.',404);return json({match:present(row,u,true)});}
export async function changeMatch(request:Request,id:string){const u=await user();const input=await body(request);const db=getDb();const [row]=await db.select().from(cricketMatches).where(and(eq(cricketMatches.id,id),accessFor(u)));if(!row)throw new ApiError('Match not found.',404);
 if(!Number.isInteger(input.revision)||input.revision<0)throw new ApiError('Invalid score revision.');
 if(typeof input.eventId!=='string'||!/^[a-zA-Z0-9_-]{10,80}$/.test(input.eventId))throw new ApiError('Invalid event ID.');
 const config=JSON.parse(row.config),journal=JSON.parse(row.journal);
 if(journal.some((e:any)=>e.id===input.eventId))return json({match:present(row,u,true),duplicate:true});
 if(row.approvedAt)throw new ApiError('This result is approved. Ask the match admin to reopen it for corrections.',409);
 if(row.revision!==input.revision)return json({error:'This match changed in another tab. Review the latest score before scoring again.',match:present(row,u,true)},409);
 const now=new Date().toISOString();const next=appendCommand(config,journal,input.command,{id:input.eventId,at:now,actor:u.userId});
 const [updated]=await db.update(cricketMatches).set({journal:JSON.stringify(next.journal),revision:row.revision+1,updatedAt:now}).where(and(eq(cricketMatches.id,id),accessFor(u),eq(cricketMatches.revision,input.revision))).returning();
 if(!updated)throw new ApiError('Another scorer updated this match. Refresh before continuing.',409);
 return json({match:present(updated,u,true)});
}

export async function getLiveMatch(id:string,revision:string|null){
 const u=await user();
 const [row]=await getDb().select().from(cricketMatches).where(and(eq(cricketMatches.id,id),accessFor(u)));
 if(!row)throw new ApiError('Match not found.',404);
 if(revision!==null&&revision===String(row.revision))return json({unchanged:true,revision:row.revision,checkedAt:new Date().toISOString()});
 const match=present(row,u);return json({match:{...match,analysis:summarizeMatch(match.state)},checkedAt:new Date().toISOString()});
}


export async function manageMatch(request:Request,id:string){
 const u=await user();
 const input=await body(request);
 const db=getDb();
 const ownMatch=and(eq(cricketMatches.id,id),eq(cricketMatches.ownerId,u.userId));
 const [row]=await db.select().from(cricketMatches).where(ownMatch);
 if(!row)throw new ApiError('Match not found.',404);
 if(input?.revision!==row.revision)
  return json({error:'This match changed in another tab. Review the latest score before scoring again.',match:present(row,u,true)},409);
 const changes:Partial<Pick<MatchRow,'scorerEmail'|'approvedAt'|'publishedAt'|'publicScore'|'config'>>={};
 const now=new Date().toISOString();
 switch(input.action){
  case 'edit-fixture': {
   if(row.approvedAt || JSON.parse(row.journal).length)
    throw new ApiError('Fixture details are locked after scoring starts.',409);
   const {date,venue,playersA,playersB}=input.fixture||{};
   const config=validateConfig({...JSON.parse(row.config),date,venue,playersA,playersB});
   changes.config=JSON.stringify(config);
   break;
  }
  case 'assign': {
   const email=typeof input.email==='string'?input.email.trim().toLowerCase():null;
   if(email===null || (email && (email.length>254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))))
    throw new ApiError('Enter the scorer’s ChatGPT email address.');
   if(email===emailFor(u))throw new ApiError('You already manage this match.');
   changes.scorerEmail=email||null;
   break;
  }
  case 'publish':
   if(row.publishedAt)throw new ApiError('Match is already listed in Match Centre.',409);
   changes.publishedAt=now;
   break;
  case 'enable-public':
   if(!row.publishedAt)throw new ApiError('List this match in Match Centre first.',409);
   if(!canCreate(u))throw new ApiError('Only the Site administrator can share scores publicly.',403);
   changes.publicScore=1;
   break;
  case 'disable-public':
   changes.publicScore=0;
   break;
  case 'unpublish':
   if(!row.publishedAt)throw new ApiError('Match is already hidden.',409);
   changes.publishedAt=null;
   changes.publicScore=0;
   break;
  case 'approve':
   if(row.approvedAt || replay(JSON.parse(row.config),JSON.parse(row.journal)).status!=='completed')
    throw new ApiError('Only completed results awaiting review can be approved.',409);
   changes.approvedAt=now;
   break;
  case 'reopen':
   if(!row.approvedAt)throw new ApiError('This result is already open for corrections.',409);
   changes.approvedAt=null;
   break;
  default: throw new ApiError('Unknown match management action.');
 }
 const [updated]=await db.update(cricketMatches)
  .set({...changes,revision:row.revision+1,updatedAt:now})
  .where(and(ownMatch,eq(cricketMatches.revision,row.revision))).returning();
 if(!updated)throw new ApiError('Another scorer updated this match. Refresh before continuing.',409);
 return json({match:present(updated,u,true)});
}


function fanMatch(row: MatchRow, includeOvers = false) {
 const config = validateConfig(JSON.parse(row.config));
 const state = replay(config, JSON.parse(row.journal));
 const {teamA,teamB,venue,competition,date,overs,format}=config;
 const status = state.status === 'completed' && !row.approvedAt ? 'review' : state.status;
 return {
  id:row.id,revision:row.revision,updatedAt:row.updatedAt,
  config:{teamA,teamB,venue,competition,date,overs,format},
  state:{
   status,target:chaseTarget(state,config),
   result:row.approvedAt && state.result ? {kind:state.result.kind,winner:state.result.winner,margin:state.result.margin} : null,
   innings:state.innings.map((inning: any)=>({team:inning.team,total:inning.total,wickets:inning.wickets,balls:inning.balls,closed:inning.closed})),
  },
  ...(includeOvers ? {overs:summarizeMatch(state).map(analysis=>analysis.overs)} : {}),
 };
}
// Use the same key for the directory and for its fixtures. SQLite lower()
// folds ASCII case and preserves Sinhala text.
const competitionName = sql<string>`trim(json_extract(${cricketMatches.config}, '$.competition'))`;
const competitionKey = sql<string>`lower(${competitionName})`;

async function spectatorVisibility(){
 const viewer=await getChatGPTUser();
 return and(isNotNull(cricketMatches.publishedAt),
  viewer ? or(eq(cricketMatches.publicScore,1),accessFor(viewer)) : eq(cricketMatches.publicScore,1));
}


export async function listCompetitions(){
 const matchDate = sql<string>`json_extract(${cricketMatches.config}, '$.date')`;
 const latest = sql<string>`max(${matchDate})`;
 const competitions = await getDb().select({
  key:competitionKey,
  name:sql<string>`min(${competitionName})`,
  matches:sql<number>`count(*)`,
  latest,
 }).from(cricketMatches).where(await spectatorVisibility())
  .groupBy(competitionKey).orderBy(desc(latest),competitionKey).limit(100);
 return json({competitions});
}

export async function listFanMatches(competition: string | null = null){
 if(competition!==null && (!competition.trim() || competition.length>100))throw new ApiError('Invalid tournament.');
 const filter = competition===null ? undefined : sql`${competitionKey} = lower(trim(${competition}))`;
 const rows=await getDb().select().from(cricketMatches)
  .where(and(await spectatorVisibility(),filter))
  .orderBy(desc(cricketMatches.updatedAt),desc(cricketMatches.id)).limit(100);
 return json({matches:rows.map(row=>fanMatch(row))});
}
export async function getFanMatch(id:string,revision:string|null){
 const [row]=await getDb().select().from(cricketMatches)
  .where(and(eq(cricketMatches.id,id),await spectatorVisibility()));
 if(!row)throw new ApiError('Match not found.',404);
 if(revision===String(row.revision))return json({unchanged:true,revision:row.revision});
 return json({match:fanMatch(row,true)});
}


export async function competitionStandings(competition:string|null){
 if(!competition?.trim() || competition.length>100)throw new ApiError('Invalid tournament.');
 const rows = await getDb().select({config:cricketMatches.config,journal:cricketMatches.journal})
  .from(cricketMatches).where(and(
   await spectatorVisibility(),
   isNotNull(cricketMatches.approvedAt),
   sql`${competitionKey} = lower(trim(${competition}))`,
  ));
 const key=sql`lower(trim(${competition}))`;
 const [visible]=await getDb().select({id:cricketMatches.id}).from(cricketMatches).where(and(await spectatorVisibility(),eq(competitionKey,key))).limit(1);
 const [savedRules]=visible?await getDb().select().from(cricketPoints).where(eq(cricketPoints.competition,key)):[];
 const viewer=await getChatGPTUser();
 const [owned]=viewer&&canCreate(viewer)?await getDb().select({id:cricketMatches.id}).from(cricketMatches).where(and(eq(cricketMatches.ownerId,viewer.userId),isNotNull(cricketMatches.publishedAt),eq(competitionKey,key))).limit(1):[];
 const results = rows.flatMap(row=>{
  const config = validateConfig(JSON.parse(row.config));
  const {result,status} = replay(config,JSON.parse(row.journal));
  return status==='completed' && result
   ? [{teamA:config.teamA,teamB:config.teamB,winner:result.winner as 'A'|'B'|null,draw:result.kind==='draw'}]
   : [];
 });
 return json({teams:countStandings(results),matches:results.length,
  rules:savedRules?JSON.parse(savedRules.rules):null,
  rulesRevision:savedRules?.revision??null,
  canEditRules:!!owned && !!viewer && (!savedRules||savedRules.ownerId===viewer.userId),
 });
}


export async function saveCompetitionRules(request:Request){
 const owner=await requireAdministrator();
 const input=await body(request);
 const {competition,rules,revision}=input||{};
 if(typeof competition!=='string'||!competition.trim()||competition.length>100 ||
    !rules || !['wins','ties','losses','draws'].every(k=>Number.isInteger(rules[k])&&Math.abs(rules[k])<=100) ||
    !['shared','wins'].includes(rules.tieBreak))
  throw new ApiError('Enter valid points and a tie-break rule.');
 const key=sql`lower(trim(${competition}))`;
 const db=getDb();
 const [match]=await db.select({id:cricketMatches.id}).from(cricketMatches)
  .where(and(eq(cricketMatches.ownerId,owner.userId),isNotNull(cricketMatches.publishedAt),eq(competitionKey,key))).limit(1);
 if(!match)throw new ApiError('List a match you own in this tournament first.',403);
 const value=JSON.stringify({wins:rules.wins,ties:rules.ties,losses:rules.losses,draws:rules.draws,tieBreak:rules.tieBreak});
 const updated=revision===null
  ? await db.insert(cricketPoints).values({competition:key,ownerId:owner.userId,rules:value}).onConflictDoNothing().returning()
  : await db.update(cricketPoints).set({rules:value,revision:sql`${cricketPoints.revision}+1`})
   .where(and(eq(cricketPoints.competition,key),eq(cricketPoints.ownerId,owner.userId),eq(cricketPoints.revision,revision))).returning();
 if(!updated.length)throw new ApiError('Rules changed. Refresh and try again.',409);
 return json({rules:JSON.parse(updated[0].rules),revision:updated[0].revision});
}

export async function listSquads(){
 const owner=await requireAdministrator();
 const rows=await getDb().select().from(cricketSquads).where(eq(cricketSquads.ownerId,owner.userId)).orderBy(cricketSquads.school,cricketSquads.team);
 return json({squads:rows.map(({id,school,team,players,revision})=>({id,school,team,players:JSON.parse(players),revision}))});
}

export async function saveSquad(request:Request){
 const owner=await requireAdministrator();
 const input=await body(request);
 const {id,revision,school,team,players}=input||{};
 if(typeof id!=='string'||!/^[a-zA-Z0-9_-]{10,80}$/.test(id) ||
   ![school,team].every(s=>typeof s==='string'&&s.trim()&&s.trim().length<=100) ||
   !Array.isArray(players)||players.length<2||players.length>11 ||
   !players.every(p=>typeof p==='string'&&p.trim()&&p.trim().length<=70))
  throw new ApiError('Enter a school, team, and 2 to 11 player names.');
 const names=players.map(p=>p.trim());
 if(new Set(names.map(p=>p.toLowerCase())).size!==names.length)throw new ApiError('Player names must be unique within a team.');
 const values={school:school.trim(),team:team.trim(),players:JSON.stringify(names)};
 const db=getDb();
 const updated=revision===null
  ? await db.insert(cricketSquads).values({...values,id,ownerId:owner.userId}).onConflictDoNothing().returning()
  : await db.update(cricketSquads).set({...values,revision:sql`${cricketSquads.revision}+1`})
   .where(and(eq(cricketSquads.id,id),eq(cricketSquads.ownerId,owner.userId),eq(cricketSquads.revision,revision))).returning();
 if(!updated.length)throw new ApiError('Squad could not be saved. Refresh and try again.',409);
 return json({id});
}

export async function privatePlayerStats(){
 const owner=await requireAdministrator();
 const matches=await getDb().select({config:cricketMatches.config,journal:cricketMatches.journal})
  .from(cricketMatches).where(and(eq(cricketMatches.ownerId,owner.userId),isNotNull(cricketMatches.approvedAt)));
 const players=new Map<string,{name:string;team:string;competition:string;runs:number;wickets:number}>();
 for(const row of matches){
  const config=validateConfig(JSON.parse(row.config));
  const {innings}=replay(config,JSON.parse(row.journal));
  function entry(team:string,name:string){
   const key=JSON.stringify([config.competition,team,name].map(s=>s.trim().toLowerCase()));
   let stats=players.get(key);
   if(!stats){stats={name,team,competition:config.competition,runs:0,wickets:0};players.set(key,stats);}
   return stats;
  }
  for(const inn of innings){
   const batting=inn.team==='A'?config.teamA:config.teamB;
   const bowling=inn.team==='A'?config.teamB:config.teamA;
   for(const p of inn.batting)if(p.entered)entry(batting,p.name).runs+=p.runs;
   for(const p of inn.bowling)if(p.balls||p.runs||p.wickets)entry(bowling,p.name).wickets+=p.wickets;
  }
 }
 return json({players:[...players.values()]});
}
