type TeamRecord = {team:string; played:number; wins:number; ties:number; draws:number; losses:number};

export function countStandings(matches: Array<{teamA:string; teamB:string; winner:'A'|'B'|null; draw?:boolean}>){
 const teams = new Map<string,TeamRecord>();
 function teamRecord(name:string){
  const key = name.trim().toLowerCase();
  const saved = teams.get(key);
  if(saved)return saved;
  const team = {team:name,played:0,wins:0,ties:0,draws:0,losses:0};
  teams.set(key,team);
  return team;
 }
 for(const match of matches){
  const home = teamRecord(match.teamA);
  const away = teamRecord(match.teamB);
  home.played++;
  away.played++;
  if(match.draw){
   home.draws++;
   away.draws++;
  }else if(match.winner === null){
   home.ties++;
   away.ties++;
  }else{
   const [winner,loser] = match.winner === 'A' ? [home,away] : [away,home];
   winner.wins++;
   loser.losses++;
  }
 }
 return [...teams.values()].sort((a,b)=>a.team.localeCompare(b.team));
}
