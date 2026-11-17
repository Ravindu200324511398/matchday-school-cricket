// Exercise the built worker against isolated D1 and simulated gateway identities.
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { Miniflare } from 'miniflare';

const files = await readdir('dist/server',{recursive:true});
const worker = new Miniflare({
 modules: ['index.js',...files.filter(f=>f!=='index.js' && /\.m?js$/.test(f))].map(f=>({type:'ESModule',path:'dist/server/'+f})),
 modulesRoot: 'dist/server',
 compatibilityDate: '2026-05-15',
 compatibilityFlags: ['nodejs_compat'],
 d1Databases: ['DB'],
 bindings: { MATCHDAY_ADMIN_EMAIL:'owner@example.test' },
});
try {
 const db = await worker.getD1Database('DB');
 for (const filename of ['0000_youthful_toro.sql','0001_certain_leopardon.sql','0002_grey_ultragirl.sql','0003_outgoing_roland_deschain.sql']) {
  const sql = await readFile(new URL('../drizzle/' + filename, import.meta.url),'utf8');
  await db.batch(sql.split('--> statement-breakpoint').map(statement => db.prepare(statement.trim())));
 }
 const id = crypto.randomUUID(), matchPath = '/api/matches/' + id;
 const owner = ['owner','owner@example.test'];
 const scorer = ['scorer','Scorer@example.test'];
 const stranger = ['stranger','stranger@example.test'];
 async function request(identity,path,status,method='GET',body){
  const headers = {'content-type':'application/json','x-matchday-action':'1'};
  if(identity){
   headers['oai-authenticated-user-id']=identity[0];
   headers['oai-authenticated-user-email']=identity[1];
  }
  const response=await worker.dispatchFetch('http://localhost'+path,{headers,method,body:JSON.stringify(body)});
  const result=await response.json();
  assert.equal(response.status,status,`${method} ${path}: ${JSON.stringify(result)}`);
  return result;
 }
 const tablePath='/api/standings?competition=TEST';
 const fanPath='/api/match-centre/'+id;
 const config={teamA:'Home',teamB:'Away',venue:'Ground',competition:'Test',date:'2026-11-16',overs:1,firstBat:'A',freeHit:false,playersA:['A','B'],playersB:['C','D']};
 await request(stranger,'/api/matches',403,'POST',{id,config});
 const squad={id:crypto.randomUUID(),school:'Home school',team:'Home',players:['A','B'],revision:null};
 await request(owner,'/api/squads',200,'POST',squad);
 await request(scorer,'/api/squads',403);
 assert.equal((await request(owner,'/api/squads',200)).squads[0].school,'Home school');
 await request(owner,'/api/squads',200,'POST',{...squad,revision:0,players:['A','B updated']});
 await request(owner,'/api/squads',409,'POST',{...squad,revision:0});
 await request(owner,'/api/matches',201,'POST',{id,config});
 await request(scorer,matchPath,404);
 await request(owner,matchPath,409,'PATCH',{action:'approve',revision:0});
 await request(owner,matchPath,200,'PATCH',{action:'assign',email:'  SCORER@example.test ',revision:0});
 assert.equal((await request(scorer,'/api/matches',200)).matches[0].role,'scorer');
 await request(null,fanPath,404);
 assert.deepEqual((await request(null,'/api/competitions',200)).competitions,[]);
 assert.deepEqual((await request(null,'/api/match-centre',200)).matches,[]);
 await request(scorer,matchPath,404,'PATCH',{action:'publish',revision:1});
 await request(owner,matchPath,200,'PATCH',{action:'publish',revision:1});
 await request(null,fanPath,404);
 await request(owner,fanPath,200);
 await request(owner,matchPath,200,'PATCH',{action:'enable-public',revision:2});
 const rules={wins:3,ties:1,losses:0,draws:1,tieBreak:'wins'};
 await request(scorer,'/api/standings',403,'POST',{competition:'test',rules,revision:null});
 await request(owner,'/api/standings',200,'POST',{competition:'test',rules,revision:null});
 assert.deepEqual((await request(null,tablePath,200)).rules,rules);
 const mixedCase = crypto.randomUUID();
 await request(owner,'/api/matches',201,'POST',{id:mixedCase,config:{...config,competition:'TEST'}});
 await request(owner,'/api/matches/'+mixedCase,200,'PATCH',{action:'publish',revision:0});
 const competitions = (await request(owner,'/api/competitions',200)).competitions;
 assert.equal(competitions.length,1);
 assert.equal(competitions[0].key,'test');
 assert.equal(competitions[0].matches,2);
 assert.equal((await request(owner,'/api/match-centre?competition=TeSt',200)).matches.length,2);
 assert.deepEqual((await request(null,'/api/match-centre?competition=Other',200)).matches,[]);
 await request(owner,'/api/matches/'+mixedCase,200,'PATCH',{action:'unpublish',revision:1});
 assert.equal((await request(null,'/api/competitions',200)).competitions[0].matches,1);
 const listed=await request(null,fanPath,200);
 assert.deepEqual(Object.keys(listed.match.config).sort(),['competition','date','format','overs','teamA','teamB','venue']);
 for(const key of ['history','ownerId','scorerEmail','role']) assert.equal(listed.match[key],undefined);
 assert.equal((await request(null,fanPath+'?revision=3',200)).unchanged,true);
 assert.equal((await request(null,'/api/match-centre',200)).matches[0].id,id);
 assert.equal((await request(scorer,matchPath+'/live',200)).match.scorerEmail,undefined);
 await request(stranger,matchPath+'/live',404);
 await request(null,matchPath+'/live',401);
 await request(scorer,matchPath,404,'PATCH',{action:'assign',email:'',revision:1});
 let revision=3;
 const start={type:'start',striker:0,nonStriker:1,bowler:0};
 const end={type:'end',reason:'innings closed'};
 const write=async (identity,command,status=200)=>{
  const result=await request(identity,matchPath,status,'POST',{revision,eventId:crypto.randomUUID(),command});
  if(status===200)revision=result.match.revision;
  return result;
 };
 for(const command of [start,end,start,end]) await write(scorer,command);
 const pending=(await request(null,fanPath,200)).match;
 assert.equal(pending.state.status,'review');
 assert.equal(pending.state.result,null);
 assert.deepEqual((await request(null,tablePath,200)).teams,[]);
 assert.deepEqual(Object.keys(pending.state.innings[0]).sort(),['balls','closed','team','total','wickets']);
 await request(scorer,matchPath,404,'PATCH',{action:'approve',revision});
 await request(owner,matchPath,409,'PATCH',{action:'approve',revision:revision-1});
 const approved=await request(owner,matchPath,200,'PATCH',{action:'approve',revision});
 revision=approved.match.revision;
 assert.ok(approved.match.approvedAt);
 assert.equal((await request(null,fanPath,200)).match.state.result.kind,'tie');
 const standings=await request(null,tablePath,200);
 assert.equal(standings.matches,1);
 assert.deepEqual(standings.teams,[
  {team:'Away',played:1,wins:0,ties:1,draws:0,losses:0},
  {team:'Home',played:1,wins:0,ties:1,draws:0,losses:0},
 ]);
 assert.equal((await request(owner,'/api/player-stats',200)).players.length,4);
 await request(null,'/api/player-stats',401);
 await write(scorer,{type:'undo'},409);
 await write(owner,{type:'undo'},409);
 revision=(await request(owner,matchPath,200,'PATCH',{action:'reopen',revision})).match.revision;
 assert.equal((await request(null,fanPath,200)).match.state.status,'review');
 assert.equal((await request(null,tablePath,200)).matches,0);
 assert.equal((await write(scorer,{type:'undo'})).match.state.status,'live');
 revision=(await request(owner,matchPath,200,'PATCH',{action:'assign',email:'',revision})).match.revision;
 await request(owner,matchPath,200,'PATCH',{action:'unpublish',revision});
 await request(null,fanPath+'?revision='+revision,404);
 assert.equal((await request(null,tablePath,200)).rules,null);
 assert.deepEqual((await request(null,'/api/match-centre',200)).matches,[]);
 await request(scorer,matchPath,404);
 await request(scorer,matchPath+'/live?revision=5',404);
 assert.deepEqual((await request(scorer,'/api/matches',200)).matches,[]);
 assert.deepEqual((await request(null,'/api/competitions',200)).competitions,[]);
 const fixtureId=crypto.randomUUID(), fixturePath='/api/matches/'+fixtureId;
 const fixtureFanPath='/api/match-centre/'+fixtureId;
 await request(owner,'/api/matches',201,'POST',{id:fixtureId,config});
 await request(owner,fixturePath,200,'PATCH',{action:'assign',email:scorer[1],revision:0});
 await request(owner,fixturePath,200,'PATCH',{action:'publish',revision:1});
 await request(owner,fixturePath,200,'PATCH',{action:'enable-public',revision:2});
 const edit={action:'edit-fixture',revision:3,fixture:{
  date:'2026-11-21',venue:'New Ground',playersA:['New batter','New partner'],playersB:['C','D'],
 }};
 await request(scorer,fixturePath,404,'PATCH',edit);
 await request(owner,fixturePath,400,'PATCH',{...edit,fixture:{...edit.fixture,playersA:['Duplicate','duplicate']}});
 const changed=(await request(owner,fixturePath,200,'PATCH',edit)).match;
 assert.equal(changed.canEditFixture,true);
 assert.equal(changed.config.teamA,config.teamA);
 assert.equal(changed.scorerEmail,scorer[1].toLowerCase());
 assert.deepEqual(changed.config.playersA,['New batter','New partner']);
 const fan=(await request(null,fixtureFanPath+'?revision=3',200)).match;
 assert.equal(fan.config.date,'2026-11-21');
 assert.equal(fan.config.venue,'New Ground');
 assert.equal(fan.config.playersA,undefined);
 await request(owner,fixturePath,409,'PATCH',edit);
 const started=(await request(scorer,fixturePath,200,'POST',{
  revision:changed.revision,eventId:crypto.randomUUID(),command:start,
 })).match;
 assert.equal(started.state.innings[0].batting[0].name,'New batter');
 await request(owner,fixturePath,409,'PATCH',{...edit,revision:started.revision});
 const undone=(await request(scorer,fixturePath,200,'POST',{
  revision:started.revision,eventId:crypto.randomUUID(),command:{type:'undo'},
 })).match;
 assert.equal((await request(owner,fixturePath,200)).match.canEditFixture,false);
 await request(owner,fixturePath,409,'PATCH',{...edit,revision:undone.revision});
 console.log('PASS: assignment, role isolation, approval, scoring lock, reopening, revocation, explicit listing and spectator data limits, competition filters, and standings approval, reopening, and fixture editing before scoring.');
} finally {
 await worker.dispose();
}
