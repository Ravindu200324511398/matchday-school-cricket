import test from 'node:test';import assert from 'node:assert/strict';
import {replay} from '../lib/cricket/engine.mjs';import {summarizeMatch} from '../lib/cricket/summary.mjs';
const config={teamA:'A',teamB:'B',venue:'Ground',competition:'Friendly',date:'2026-11-15',overs:2,firstBat:'A',freeHit:false,playersA:['A1','A2','A3'],playersB:['B1','B2','B3']};
const start={type:'start',striker:0,nonStriker:1,bowler:0};
const ball=(runs=0,extra='none',wicket=null)=>({type:'ball',runs,extra,wicket,boundary:runs===4&&extra==='none',out:'striker'});
function summary(commands){return summarizeMatch(replay(config,commands.map(command=>({command}))));}
test('scheduled match has no innings projections',()=>assert.deepEqual(summary([]),[]));
test('zero legal balls has no finite run rate; wide runs remain in the over',()=>{const [s]=summary([start,ball(0,'wide')]);assert.equal(s.runRate,null);assert.equal(s.overs[0].runs,1);assert.equal(s.overs[0].balls,0)});
test('extras count in team totals and partnerships, but not legal ball count',()=>{const [s]=summary([start,ball(4),ball(0,'wide'),ball(2,'nb-bye'),ball(1)]);assert.equal(s.legalBalls,2);assert.equal(s.runRate,27);assert.deepEqual(s.partnership,{runs:9,balls:2});assert.equal(s.overs[0].runs,9)});
test('fall of wickets identifies the dismissed player and correct score/over',()=>{const [s]=summary([start,ball(4),ball(0,'none','bowled'),{type:'batter',player:2},ball(1)]);assert.deepEqual(s.fallOfWickets,[{wicket:1,total:4,over:'0.2',player:'A1'}]);assert.deepEqual(s.partnership,{runs:1,balls:1})});
test('illegal deliveries at sixth ball stay in same over',()=>{const commands=[start,...Array.from({length:5},()=>ball()),ball(0,'wide'),ball(),{type:'bowler',player:1},ball(2)];const [s]=summary(commands);assert.equal(s.overs.length,2);assert.equal(s.overs[0].deliveries.length,7);assert.equal(s.overs[0].runs,1);assert.equal(s.overs[0].balls,6);assert.equal(s.overs[1].runs,2)});
test('undo removes reversed delivery from commentary projections and fow',()=>{const [s]=summary([start,ball(4),ball(0,'none','bowled'),{type:'undo'}]);assert.equal(s.fallOfWickets.length,0);assert.equal(s.overs[0].deliveries.length,1);assert.equal(s.overs[0].runs,4)});
