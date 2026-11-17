// Pure replayable scorer. No database or UI dependencies.
export class ScoreError extends Error {}
const requireValue = (ok, message) => { if (!ok) throw new ScoreError(message); };
const number = (n, min, max) => Number.isInteger(n) && n >= min && n <= max;
const clean = (s, max=100) => typeof s==='string' && s.trim().length>0 && s.trim().length<=max;
export function validateConfig(input) {
 requireValue(input && typeof input==='object', 'Invalid match configuration.');
 for (const f of ['teamA','teamB','venue','competition']) requireValue(clean(input[f]), `${f} is required (maximum 100 characters).`);
 requireValue(input.teamA.trim().toLowerCase()!==input.teamB.trim().toLowerCase(),'Teams must have different names.');
 const format=input.format??'limited';
 requireValue(['limited','two-day'].includes(format),'Choose a valid match format.');
 requireValue(format==='two-day' || number(input.overs,1,50),'Choose between 1 and 50 overs.');

 requireValue(['A','B'].includes(input.firstBat),'Choose the team batting first.');
 requireValue(typeof input.freeHit==='boolean','Choose the free-hit rule.');
 requireValue(typeof input.date==='string' && /^\d{4}-\d{2}-\d{2}$/.test(input.date) && !Number.isNaN(Date.parse(input.date)) && new Date(input.date).toISOString().slice(0,10)===input.date,'Enter a valid match date.');
 for (const f of ['playersA','playersB']) {
  requireValue(Array.isArray(input[f]) && input[f].length>=2 && input[f].length<=11,'Each team needs 2–11 players.');
  requireValue(input[f].every(n=>clean(n,70)),'Player names are required (maximum 70 characters).');
  requireValue(new Set(input[f].map(n=>n.trim().toLowerCase())).size===input[f].length,'Player names must be unique within a team.');
 }
 requireValue(input.playersA.length===input.playersB.length,'Both teams must have the same number of players.');
 const config = Object.fromEntries(['teamA','teamB','venue','competition','date','overs','firstBat','freeHit','playersA','playersB'].map(k=>[k,Array.isArray(input[k])?input[k].map(v=>v.trim()):typeof input[k]==='string'?input[k].trim():input[k]]));
 return {...config,format,overs:format==='two-day'?null:config.overs};
}
const opposite = t=>t==='A'?'B':'A';
const roster = (c,t)=>c[t==='A'?'playersA':'playersB'];
export const oversText = balls=>`${Math.floor(balls/6)}.${balls%6}`;
function blankInnings(c, team) {
 return {team,total:0,wickets:0,balls:0,striker:null,nonStriker:null,bowler:null,previousBowler:null,freeHit:false,closed:false,reason:null,
 extras:{wide:0,noBall:0,bye:0,legBye:0},batting:roster(c,team).map(name=>({name,runs:0,balls:0,fours:0,sixes:0,out:false,dismissal:'',entered:false})),
 bowling:roster(c,opposite(team)).map(name=>({name,balls:0,runs:0,wickets:0})),deliveries:[]};
}
export function activeCommands(journal) {
 const active=[];
 for(const item of journal) {
  requireValue(item && item.command,'Invalid event history.');
  if(item.command.type==='undo'){requireValue(active.length>0,'Nothing to undo.');active.pop();}
  else active.push(item.command);
 }
 return active;
}
export function replay(config, journal=[]) {
 const c=validateConfig(config);
 const state={status:'scheduled',innings:[],result:null,activeCount:0};
 const commands=activeCommands(journal); state.activeCount=commands.length;
 for(const e of commands) apply(state,c,e);
 return state;
}
const aggregate = (state, team) => state.innings.filter(inn=>inn.team===team).reduce((n,inn)=>n+inn.total,0);
export const nextBattingTeam = (config, inningsCount) => inningsCount%2===0?config.firstBat:opposite(config.firstBat);
export function chaseTarget(state,config){
 const innings=state.innings;
 const finalInnings=config.format==='two-day'?4:2;
 if(innings.length!==finalInnings)return null;
 const team=innings.at(-1).team;
 return aggregate(state,opposite(team))+1-(aggregate(state,team)-innings.at(-1).total);
}
function apply(s,c,e) {
 requireValue(e && typeof e.type==='string','Invalid scoring action.');
 requireValue(s.status!=='completed','Match completed. Undo the last action before making a correction.');
 let inn=s.innings.at(-1);
 if(e.type==='draw') {
  requireValue(c.format==='two-day'&&inn,'Only a started two-day match can end in a draw.');
  if(!inn.closed){inn.closed=true;inn.reason='time expired';}
  s.status='completed';s.result={kind:'draw',winner:null,margin:0};return;
 }
 if(e.type==='start') {
  requireValue(!inn || (inn.closed && s.innings.length<(c.format==='two-day'?4:2)),'An innings is already in progress.');
  const team=nextBattingTeam(c,s.innings.length);
  const next=blankInnings(c,team);
  requireValue(number(e.striker,0,next.batting.length-1)&&number(e.nonStriker,0,next.batting.length-1)&&e.striker!==e.nonStriker,'Choose two different opening batters.');
  requireValue(number(e.bowler,0,next.bowling.length-1),'Choose the opening bowler.');
  next.striker=e.striker;next.nonStriker=e.nonStriker;next.bowler=e.bowler;
  next.batting[e.striker].entered=true;next.batting[e.nonStriker].entered=true;
  s.innings.push(next);s.status='live';return;
 }
 requireValue(inn&&!inn.closed,'Start the next innings before scoring.');
 if(e.type==='batter') {
  requireValue(inn.striker===null||inn.nonStriker===null,'Both batters are already selected.');
  requireValue(number(e.player,0,inn.batting.length-1)&&!inn.batting[e.player].entered,'Choose a batter who has not batted.');
  inn.batting[e.player].entered=true;
  if(inn.striker===null)inn.striker=e.player;else inn.nonStriker=e.player;return;
 }
 if(e.type==='bowler') {
  requireValue(inn.bowler===null,'Change bowlers only at the end of an over.');
  requireValue(number(e.player,0,inn.bowling.length-1)&&e.player!==inn.previousBowler,'Choose a different bowler for the new over.');
  inn.bowler=e.player;return;
 }
 if(e.type==='swap') {
  requireValue(inn.striker!==null&&inn.nonStriker!==null,'Select both batters first.');
  [inn.striker,inn.nonStriker]=[inn.nonStriker,inn.striker];return;
 }
 if(e.type==='end') {
  requireValue(['innings closed','retired all out'].includes(e.reason),'Choose a valid innings closure reason.');
  inn.closed=true;inn.reason=e.reason;finish(s,c);return;
 }
 requireValue(e.type==='ball','Unknown scoring action.');
 requireValue(inn.striker!==null&&inn.nonStriker!==null&&inn.bowler!==null,'Select the next batter and bowler before scoring.');
 const kinds=['none','wide','no-ball','bye','leg-bye','nb-bye','nb-leg-bye'];
 requireValue(kinds.includes(e.extra),'Invalid extra type.');
 requireValue(number(e.runs,0,6),'Runs must be between 0 and 6.');
 requireValue(typeof e.boundary==='boolean','Specify whether the runs are a boundary.');
 requireValue(!e.boundary||[4,6].includes(e.runs),'Boundary must be 4 or 6 runs.');
 requireValue(!(e.boundary&&e.runs===6&&!['none','no-ball'].includes(e.extra)),'Extras boundaries are four runs.');
 const nb=['no-ball','nb-bye','nb-leg-bye'].includes(e.extra),wide=e.extra==='wide',legal=!nb&&!wide;
 const dismissals=['bowled','caught','lbw','stumped','hit-wicket','run-out'];
 requireValue(e.wicket===null||dismissals.includes(e.wicket),'Invalid dismissal.');
 if(e.wicket){
  requireValue(['striker','nonStriker'].includes(e.out),'Choose the dismissed batter.');
  requireValue(!e.boundary,'Cannot record a boundary and wicket together.');
  requireValue(e.wicket==='run-out'||e.out==='striker','Only run-out supports a non-striker dismissal here.');
  requireValue(!(nb||inn.freeHit)||e.wicket==='run-out','Only run-out is supported on a no-ball or free hit.');
  requireValue(!wide||['stumped','hit-wicket','run-out'].includes(e.wicket),'Invalid dismissal on a wide.');
  requireValue(e.wicket==='run-out'||(e.runs===0 && ['none','wide'].includes(e.extra)),'Use zero runs for this dismissal.');
 }
 const striker=inn.striker, nonStriker=inn.nonStriker, bowler=inn.bowler;
 const bat=inn.batting[striker], bowl=inn.bowling[bowler];
 const batRuns=['none','no-ball'].includes(e.extra)?e.runs:0;
 const byes=['bye','nb-bye'].includes(e.extra)?e.runs:0;
 const legByes=['leg-bye','nb-leg-bye'].includes(e.extra)?e.runs:0;
 const wideRuns=wide?1+e.runs:0,nbRuns=nb?1:0;
 const total=batRuns+byes+legByes+wideRuns+nbRuns;
 const target=chaseTarget(s,c);
 if(target!==null){
  const needed=target-inn.total;
  requireValue(!((nb||wide)&&needed===1&&e.runs>0),'The penalty reaches the target. Record only the wide or no-ball penalty.');
  requireValue(e.boundary||total<=needed,'The winning run ends the match. Record only the runs needed, unless a boundary was scored.');
  requireValue(!(total>=needed&&e.wicket),'The target was reached before this dismissal. Record the winning runs without a wicket.');
 }
 const label=`${Math.floor(inn.balls/6)}.${inn.balls%6+1}`;
 inn.total+=total;inn.extras.wide+=wideRuns;inn.extras.noBall+=nbRuns;inn.extras.bye+=byes;inn.extras.legBye+=legByes;
 bat.runs+=batRuns;if(!wide)bat.balls++;
 if(e.boundary&&batRuns===4)bat.fours++;if(e.boundary&&batRuns===6)bat.sixes++;
 bowl.runs+=batRuns+wideRuns+nbRuns;
 if(legal){inn.balls++;bowl.balls++;}
 const dismissed=e.wicket?(e.out==='striker'?striker:nonStriker):null;
 if(dismissed!==null){inn.wickets++;inn.batting[dismissed].out=true;inn.batting[dismissed].dismissal=e.wicket;if(e.wicket!=='run-out')bowl.wickets++;}
 // Completed runs change ends. Boundary allowances and penalty runs do not.
 if(!e.boundary&&e.runs%2===1)[inn.striker,inn.nonStriker]=[inn.nonStriker,inn.striker];
 if(dismissed!==null){if(inn.striker===dismissed)inn.striker=null;else inn.nonStriker=null;}
 inn.freeHit=c.freeHit&&(nb||(inn.freeHit&&!legal));
 inn.deliveries.push({label,total,extra:e.extra,runs:e.runs,boundary:e.boundary,wicket:e.wicket,out:dismissed,striker,bowler,freeHit:inn.freeHit});
 if(legal&&inn.balls%6===0){[inn.striker,inn.nonStriker]=[inn.nonStriker,inn.striker];inn.previousBowler=bowler;inn.bowler=null;}
 if(inn.wickets>=inn.batting.length-1){inn.closed=true;inn.reason='all out';}
 else if(c.overs!==null&&inn.balls>=c.overs*6){inn.closed=true;inn.reason='overs completed';}
 if(target!==null&&inn.total>=target){inn.closed=true;inn.reason='target reached';}
 finish(s,c);
}
function finish(s,c){
 const inn=s.innings.at(-1);
 if(!inn.closed)return;
 const twoDay=c.format==='two-day';
 const opponent=opposite(inn.team);
 const total=aggregate(s,inn.team), other=aggregate(s,opponent);
 if(twoDay&&s.innings.length===3&&total<other){
  s.status='completed';s.result={kind:'innings',winner:opponent,margin:other-total};return;
 }
 if(s.innings.length<(twoDay?4:2)){s.status='interval';return;}
 s.status='completed';
 if(total>other)s.result={kind:'wickets',winner:inn.team,margin:inn.batting.length-1-inn.wickets};
 else if(total<other)s.result={kind:'runs',winner:opponent,margin:other-total};
 else s.result={kind:'tie',winner:null,margin:0};
}
export function appendCommand(config,journal,command,meta) {
 requireValue(journal.length<5000,'This match has reached its event limit.');
 requireValue(command && typeof command==='object','Invalid scoring action.');
 const allowed={start:['type','striker','nonStriker','bowler'],ball:['type','runs','extra','boundary','wicket','out'],batter:['type','player'],bowler:['type','player'],swap:['type'],end:['type','reason'],draw:['type'],undo:['type']};
 requireValue(Object.hasOwn(allowed,command.type),'Unknown scoring action.');
 const cleanCommand=Object.fromEntries(allowed[command.type].map(k=>[k,command[k]]));
 const next=[...journal,{id:meta.id,at:meta.at,actor:meta.actor,command:cleanCommand}];
 return {journal:next,state:replay(config,next)};
}
