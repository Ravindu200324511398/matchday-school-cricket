export class ScoreError extends Error {}
export type MatchConfig={teamA:string;teamB:string;venue:string;competition:string;date:string;overs:number|null;format:'limited'|'two-day';firstBat:'A'|'B';freeHit:boolean;playersA:string[];playersB:string[]};
export function validateConfig(input:unknown):MatchConfig;
export function replay(config:MatchConfig,journal?:any[]):any;
export function appendCommand(config:MatchConfig,journal:any[],command:any,meta:{id:string;at:string;actor:string}):{journal:any[];state:any};
export function activeCommands(journal:any[]):any[];
export function oversText(balls:number):string;

export function chaseTarget(state:any,config:MatchConfig):number|null;
