import test from 'node:test';
import assert from 'node:assert/strict';
import { replay, chaseTarget } from '../lib/cricket/engine.mjs';
const config={teamA:'Home',teamB:'Away',venue:'Ground',competition:'Test',date:'2026-11-17',format:'two-day',overs:null,firstBat:'A',freeHit:false,playersA:['A','B'],playersB:['C','D']};
const open={type:'start',striker:0,nonStriker:1,bowler:0};
const close={type:'end',reason:'innings closed'};
const innings=runs=>[open,{type:'ball',runs,extra:'none',boundary:runs>=4,wicket:null,out:'striker'},close];
const play=commands=>replay(config,commands.map(command=>({command})));

test('two-day target uses aggregated runs and alternates four innings',()=>{
 const state=play([...innings(4),...innings(2),...innings(4),open]);
 assert.deepEqual(state.innings.map(i=>i.team),['A','B','A','B']);
 assert.equal(chaseTarget(state,config),7);
 assert.equal(play([...innings(4),...innings(2),...innings(4),...innings(6)]).result.kind,'tie');
});
test('an innings defeat ends after the third innings',()=>{
 assert.deepEqual(play([...innings(1),...innings(6),...innings(2)]).result,{kind:'innings',winner:'B',margin:3});
});
test('time-expired draws preserve the innings and can be undone',()=>{
 const played=[...innings(4),open,{type:'draw'}];
 assert.equal(play(played).result.kind,'draw');
 assert.equal(play([...played,{type:'undo'}]).status,'live');
});
