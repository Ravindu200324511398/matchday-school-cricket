// Read-only scorecard projections, derived from the canonical replayed state.
const legal=e=>!['wide','no-ball','nb-bye','nb-leg-bye'].includes(e.extra);
const overs=n=>`${Math.floor(n/6)}.${n%6}`;
export function summarizeInnings(innings){
 let total=0,balls=0,wickets=0,partnership=0,partnershipBalls=0;
 const fallOfWickets=[],overMap=new Map();
 for(const [index,d] of innings.deliveries.entries()){
  const overNumber=Math.floor(balls/6)+1;
  if(!overMap.has(overNumber))overMap.set(overNumber,{number:overNumber,runs:0,wickets:0,balls:0,deliveries:[]});
  const over=overMap.get(overNumber);over.runs+=d.total;total+=d.total;partnership+=d.total;
  if(legal(d)){balls++;partnershipBalls++;over.balls++;}
  over.deliveries.push({index,label:d.label,runs:d.total,extra:d.extra,wicket:d.wicket,boundary:d.boundary});
  if(d.wicket){wickets++;over.wickets++;fallOfWickets.push({wicket:wickets,total,over:overs(balls),player:innings.batting[d.out]?.name||'—'});partnership=0;partnershipBalls=0;}
 }
 return {runRate:balls?Number((total*6/balls).toFixed(2)):null,partnership:{runs:partnership,balls:partnershipBalls},fallOfWickets,overs:[...overMap.values()],legalBalls:balls};
}
export function summarizeMatch(state){return state.innings.map(summarizeInnings);}
