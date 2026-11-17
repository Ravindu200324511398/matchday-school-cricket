const matches=[
{id:1,a:'Royal College',b:'S. Thomas’ College',ac:'RC',bc:'ST',sa:'186/4',sb:'214',oa:'38.2 overs',ob:'48.5 overs',status:'live',group:'Under 19',type:'50 overs',venue:'SSC Ground, Colombo',note:'Royal need 29 runs from 70 balls',time:'Innings 2',tournament:'Under 19 · Division I'},
{id:2,a:'Trinity College',b:'St. Anthony’s College',ac:'TC',bc:'SA',sa:'245/6',sb:'Yet to bat',oa:'72 overs',ob:'',status:'live',group:'Under 19',type:'2 day',venue:'Asgiriya, Kandy',note:'Trinity College elected to bat',time:'Day 1 · Tea',tournament:'Under 19 · Division I'},
{id:3,a:'Ananda College',b:'Nalanda College',ac:'AC',bc:'NC',sa:'198/7',sb:'194',oa:'46.1 overs',ob:'49.2 overs',status:'results',group:'Under 19',type:'50 overs',venue:'Ananda Mawatha, Colombo',note:'Ananda College won by 3 wickets',time:'Completed',tournament:'Under 19 · Division I'},
{id:4,a:'Richmond College',b:'Mahinda College',ac:'RC',bc:'MC',sa:'—',sb:'—',oa:'',ob:'',status:'fixtures',group:'Under 17',type:'50 overs',venue:'Galle International Stadium',note:'Monday, 16 Nov · 9:30 AM',time:'16 NOV',tournament:'Under 17 · Division I'},
{id:5,a:'Maliyadeva College',b:'St. Anne’s College',ac:'MC',bc:'SA',sa:'—',sb:'—',oa:'',ob:'',status:'fixtures',group:'Under 19',type:'2 day',venue:'Welagedara Stadium',note:'Tuesday, 17 Nov · 9:30 AM',time:'17 NOV',tournament:'Under 19 · Division I'},
{id:6,a:'D. S. Senanayake College',b:'Isipathana College',ac:'DS',bc:'IC',sa:'165',sb:'168/5',oa:'42.1 overs',ob:'38.4 overs',status:'results',group:'Under 17',type:'50 overs',venue:'Colombo',note:'Isipathana College won by 5 wickets',time:'Completed',tournament:'Under 17 · Division I'}];
const tournaments=[{id:'u19',name:'Under 19 Division I',sub:'Schools cricket championship',format:'2 day & 50 overs',teams:36},{id:'u17',name:'Under 17 Division I',sub:'The next generation takes the field',format:'50 overs',teams:32},{id:'u15',name:'Under 15 Division I',sub:'Where the journey begins',format:'Limited overs',teams:28}];
const players=[{name:'Demo Batter A',school:'Royal College',runs:486,wickets:3,avg:'60.75',matches:8},{name:'Demo Batter B',school:'Trinity College',runs:452,wickets:5,avg:'56.50',matches:8},{name:'Demo All-rounder C',school:'Ananda College',runs:418,wickets:16,avg:'52.25',matches:8},{name:'Demo Bowler D',school:'S. Thomas’ College',runs:132,wickets:28,avg:'16.50',matches:8},{name:'Demo Bowler E',school:'St. Anthony’s College',runs:95,wickets:24,avg:'11.88',matches:8}];
const points=[['Royal College',8,6,1,1,25],['Trinity College',8,5,1,2,22],['Ananda College',8,5,2,1,21],['S. Thomas’ College',8,4,3,1,17],['St. Anthony’s College',8,3,4,1,13]];
let matchFilter='all',search='',age='all',statType='batting',detailTab='scorecard';
const main=document.querySelector('#main');
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const heading=(label,title,sub)=>`<div class="heading"><div><div class="eyebrow">${label}</div><h1>${title}</h1><p class="subtitle">${sub}</p></div><span class="date">◷ &nbsp; Season 2026 / 27</span></div>`;
const card=m=>`<a class="match-card" href="#match/${m.id}" aria-label="View ${m.a} versus ${m.b}"><div class="card-body"><div class="statusline"><span class="pill ${m.status==='live'?'live':''}">${m.status==='live'?'LIVE · DEMO':m.status==='fixtures'?'UPCOMING':'RESULT'}</span><span class="muted" style="font-size:9px">${m.time}</span></div><div class="match-meta">${m.tournament} &nbsp;•&nbsp; ${m.type}</div>${team(m.a,m.ac,m.sa,m.oa)}${team(m.b,m.bc,m.sb,m.ob)}<div class="result">${m.note}</div></div><div class="card-footer"><span>⌖ ${m.venue}</span><span>View match ↗</span></div></a>`;
function team(name,initials,score,overs){return `<div class="team"><span class="crest">${initials}</span><span>${name}</span><span class="score" style="${score==='Yet to bat'?'font-size:12px':''}">${score}<small>${overs}</small></span></div>`}
const tournamentRow=t=>`<a href="#tournament/${t.id}" class="tournament"><span class="trophy">♜</span><div><h3>${t.name}</h3><p>${t.teams} schools &nbsp;·&nbsp; ${t.format}</p></div><span class="arrow">↗</span></a>`;
function table(rows,headers){return `<div class="table-wrap"><table><thead><tr>${headers.map(h=>`<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`}
function home(){return `${heading('Every school. Every innings.','The game starts here.','Your front-row seat to Sri Lankan school cricket.')}<section class="hero"><div class="hero-copy"><div class="eyebrow">THE 2026 / 27 SCHOOL CRICKET SEASON</div><h2>Small grounds.<br>Extraordinary beginnings.</h2><p>Follow the rivalries, the rising stars, and every moment that makes school cricket special.</p><a href="#matches">Explore the matches &nbsp; ↗</a></div><div class="pitch" aria-hidden="true"><div class="oval"></div><div class="strip"></div><div class="ball"></div></div></section><div class="section-head"><div class="section-title"><h2>Around the grounds</h2><span class="count">2 live demos</span></div><a href="#matches">All matches ↗</a></div><div class="cards">${matches.slice(0,3).map(card).join('')}</div><div class="lower-grid"><section><div class="section-head"><h2>In the tournament</h2><a href="#tournaments">Explore all ↗</a></div><div class="panel">${tournaments.map(tournamentRow).join('')}</div></section><section><div class="section-head"><h2>Leading the way</h2><a href="#stats">Full statistics ↗</a></div><div class="panel"><div class="eyebrow">MOST RUNS · SAMPLE PLAYERS</div>${table(players.slice(0,3).map((p,i)=>[i+1,`<a href="#player/${i}"><b>${p.name}</b><br><small class="muted">${p.school}</small></a>`,`<b>${p.runs}</b>`]),['#','PLAYER','RUNS'])}<p class="muted" style="font-size:10px;margin-bottom:0">Under 19 Division I · Illustrative statistics</p></div></section></div>`}
function matchesPage(){return `${heading('Match centre','Follow every innings.','Find a school, choose a competition, and get closer to the game.')}<div class="tabs" aria-label="Match status">${[['all','All matches'],['live','Live · 2'],['fixtures','Upcoming'],['results','Results']].map(([v,n])=>`<button data-filter="${v}" aria-pressed="${matchFilter===v}" class="${matchFilter===v?'selected':''}">${n}</button>`).join('')}</div><div class="filters"><input id="search" type="search" aria-label="Search school or ground" placeholder="Search a school or ground…" value="${escapeHTML(search)}"><select id="age" aria-label="Age group"><option value="all">All age groups</option>${['Under 19','Under 17'].map(v=>`<option ${age===v?'selected':''}>${v}</option>`).join('')}</select><button class="button" id="clear">Reset filters</button></div><p class="subtitle" id="result-count" role="status"></p><div id="match-list" class="cards" style="margin-top:16px"></div>`}
function updateMatches(){const list=matches.filter(m=>(matchFilter==='all'||m.status===matchFilter)&&(age==='all'||m.group===age)&&`${m.a} ${m.b} ${m.venue}`.toLowerCase().includes(search.toLowerCase()));document.querySelector('#result-count').textContent=`${list.length} matches · Demonstration data`;document.querySelector('#match-list').innerHTML=list.length?list.map(card).join(''):'<div class="empty"><h3>No matches found</h3><p class="muted">Try another school name or reset your filters.</p></div>'}
function tournamentPage(id){const t=tournaments.find(t=>t.id===id);if(!t)return `${heading('The competitions','Tournaments','Follow the season, from the opening ball to the final.')}<div class="panel">${tournaments.map(tournamentRow).join('')}</div><div class="info">Competition names and team counts in this preview are illustrative.</div>`;return `<a class="back" href="#tournaments">← All tournaments</a>${heading('Tournament overview',t.name,t.sub)}<div class="summary-grid"><div class="metric"><strong>${t.teams}</strong><span>Schools · demo</span></div><div class="metric"><strong>2026/27</strong><span>Season</span></div><div class="metric"><strong>${t.format}</strong><span>Match format</span></div></div><div class="tabs"><a class="button primary" href="#standings/${id}">Points table</a><a class="button" href="#stats/${id}">Player statistics</a></div><div class="section-head"><h2>Competition matches</h2></div><div class="cards">${matches.filter(m=>m.group===(id==='u17'?'Under 17':id==='u19'?'Under 19':'Under 15')).map(card).join('')||'<div class="empty">No demonstration matches in this competition yet.</div>'}</div>`}
function standings(id='u19'){const t=tournaments.find(t=>t.id===id)||tournaments[0];return `${heading('The standings','Points tables',t.name+' · Demonstration standings')}<div class="tabs">${tournaments.map(t=>`<a class="button ${t.id===id?'primary':''}" href="#standings/${t.id}">${t.name}</a>`).join('')}</div>${id==='u19'?`<div class="panel">${table(points.map((p,i)=>[i+1,...p]),['#','SCHOOL','P','W','L','D','PTS'])}</div><div class="info">Demo scoring: win 4 points, draw 1 point. Official competition rules will be configured during backend development.</div>`:'<div class="empty"><h3>Standings coming soon</h3><p class="muted">No sample standings have been added for this competition.</p></div>'}`}
function stats(id='u19'){return `${heading('The next generation','Player statistics','Illustrative player records · '+(tournaments.find(t=>t.id===id)||tournaments[0]).name)}<div class="tabs">${['batting','bowling'].map(v=>`<button data-stat="${v}" aria-pressed="${v===statType}" class="${v===statType?'selected':''}">${v==='batting'?'Top batters':'Top bowlers'}</button>`).join('')}</div>${id!=='u19'?'<div class="empty">No sample statistics for this competition yet.</div>':`<div class="panel">${table([...players].sort((a,b)=>statType==='batting'?b.runs-a.runs:b.wickets-a.wickets).map((p,i)=>[i+1,`<a href="#player/${players.indexOf(p)}"><b>${p.name} ↗</b></a>`,p.school,p.matches,statType==='batting'?p.runs:p.wickets]),['#','PLAYER','SCHOOL','MATCHES',statType==='batting'?'RUNS':'WICKETS'])}</div>`}<div class="info">Player names and statistics are fictional placeholders. Public player data will be integrated in a later stage.</div>`}
function player(id){const p=players[Number(id)];if(!p)return notFound();return `<a href="#stats" class="back">← Player statistics</a>${heading('Player profile',p.name,p.school+' · Fictional demo player')}<div class="summary-grid"><div class="metric"><strong>${p.matches}</strong><span>Matches</span></div><div class="metric"><strong>${p.runs}</strong><span>Runs</span></div><div class="metric"><strong>${p.wickets}</strong><span>Wickets</span></div></div><div class="panel"><h2>Season overview</h2><p class="muted">Under 19 Division I · 2026/27</p>${table([['Batting average',p.avg],['Matches',p.matches],['Runs',p.runs],['Wickets',p.wickets]],['STATISTIC','VALUE'])}</div>`}
function matchDetail(id){const m=matches.find(m=>m.id===Number(id));if(!m)return notFound();let content;if(m.status==='fixtures')content=`<div class="panel"><h2>Match information</h2><p>${m.note}</p><p class="muted">${m.venue} · ${m.type}</p><p>Teams and scorecard will appear when the match begins.</p></div>`;else if(id!=='1')content='<div class="panel"><h2>Match summary</h2><p>'+m.note+'</p><p class="muted">A detailed scorecard has not been added for this demo match. Open Royal College vs S. Thomas’ College to try the full scorecard and commentary preview.</p><a class="button" href="#match/1">Open sample scorecard ↗</a></div>';else content=`<div class="tabs">${['scorecard','commentary','info'].map(v=>`<button data-detail="${v}" class="${v===detailTab?'selected':''}" aria-pressed="${v===detailTab}">${v==='info'?'Match info':v[0].toUpperCase()+v.slice(1)}</button>`).join('')}</div><div class="panel">${detailTab==='scorecard'?`<h2>Royal College · 2nd innings</h2>${table([['Demo Opener A','c fielder b bowler',42,54,5,0],['Demo Opener B','b bowler',31,43,3,0],['Demo Batter C','c fielder b bowler',18,26,2,0],['Demo Batter D','run out',12,19,1,0],['Demo Batter E','not out',51,57,5,1],['Demo Batter F','not out',24,31,2,0]],['BATTER','DISMISSAL','R','B','4s','6s'])}<p class="muted">Extras 8 · Total 186/4 (38.2 overs)</p>${table([['Demo Bowler A',8,0,36,1],['Demo Bowler B',8,1,32,1],['Demo Bowler C',8,0,42,1],['Demo Bowler D',8,0,38,0],['Demo Bowler E','6.2',0,38,0]],['BOWLER','O','M','R','W'])}`:detailTab==='commentary'?`<h2>Ball by ball · sample commentary</h2><div class="comment"><b>38.2</b><div><h3>FOUR</h3><p>Driven through the covers. Royal move to 186/4.</p></div></div><div class="comment"><b>38.1</b><div><h3>No run</h3><p>Defended back to the bowler. 182/4.</p></div></div><div class="comment"><b>37.6</b><div><h3>1 run</h3><p>A single to deep square leg. 182/4.</p></div></div>`:table([['Competition',m.tournament],['Format',m.type],['Venue',m.venue],['Toss','S. Thomas’ College chose to bat'],['Data source','Illustrative demo; no live feed connected']],['MATCH','DETAIL'])}</div>`;return `<a class="back" href="#matches">← Match centre</a>${heading('Match centre',m.a+' vs '+m.b,m.tournament+' · '+m.venue)}<div class="panel match-overview"><span class="pill ${m.status==='live'?'live':''}">${m.status==='live'?'LIVE MATCH PREVIEW':'MATCH PREVIEW'} · DEMO</span>${team(m.a,m.ac,m.sa,m.oa)}${team(m.b,m.bc,m.sb,m.ob)}<p class="result">${m.note}</p></div>${content}`}
function resources(){return `${heading('Beyond the boundary','Resources & scoring','Official services, all in one place.')}<div class="panel resource"><h2>Competition downloads</h2><p>Find the current official documents on the original SLSCA website.</p><a href="https://matches.schoolscricket.lk/downloads" target="_blank" rel="noopener">Open official downloads ↗</a></div><div class="panel resource"><h2>Become a scorer</h2><p>Use the existing official registration service to apply. This preview does not collect personal information.</p><a href="https://matches.schoolscricket.lk/scorer-registration" target="_blank" rel="noopener">Open scorer registration ↗</a></div><div class="panel resource"><h2>Scorer portal</h2><p>Existing scorers can access the official scoring system.</p><a href="https://scorer.schoolscricket.lk" target="_blank" rel="noopener">Go to scorer portal ↗</a></div><div class="info">This is an independent UI concept, not an official SLSCA service. All displayed scores, fixtures, standings, and player records are demonstration data.</div>`}
function notFound(){return '<div class="empty"><h1>Page not found</h1><a class="button" href="#home">Back to overview</a></div>'}
function render(){const [route='home',id]=(location.hash.slice(1)||'home').split('/');const pages={home, matches:matchesPage,tournaments:()=>tournamentPage(),tournament:()=>tournamentPage(id),standings:()=>standings(id),stats:()=>stats(id),player:()=>player(id),match:()=>matchDetail(id),resources};main.innerHTML=(pages[route]||notFound)();document.querySelectorAll('[data-nav]').forEach(a=>{const active=a.dataset.nav===({match:'matches',tournament:'tournaments',player:'stats'}[route]||route);a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});if(route==='matches'){updateMatches();document.querySelector('#search').addEventListener('input',e=>{search=e.target.value;updateMatches()});document.querySelector('#age').addEventListener('change',e=>{age=e.target.value;updateMatches()});document.querySelector('#clear').onclick=()=>{search='';age='all';matchFilter='all';render()}}document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{matchFilter=b.dataset.filter;render()});document.querySelectorAll('[data-stat]').forEach(b=>b.onclick=()=>{statType=b.dataset.stat;render()});document.querySelectorAll('[data-detail]').forEach(b=>b.onclick=()=>{detailTab=b.dataset.detail;render()})}
document.querySelector('#theme').onclick=()=>{document.body.classList.toggle('dark');document.querySelector('#theme').setAttribute('aria-pressed',document.body.classList.contains('dark'))};window.addEventListener('hashchange',()=>{render();window.scrollTo(0,0);main.focus({preventScroll:true})});render();

// Authenticated scoring workspace. The server owns all score calculations.
let language='en';try{language=localStorage.getItem('matchday-language')||'en'}catch{}
const tr=(en,si)=>language==='si'?si:en;
const safe=escapeHTML;
let workspaceMatch=null,renderSequence=0,saving=false,newMatchId=null;
const api=async(path,options={})=>{let response;try{response=await fetch(path,{...options,headers:{'Content-Type':'application/json','X-Matchday-Action':'1',...options.headers},cache:'no-store'})}catch{throw {message:tr('Connection lost. The action may have been saved. Use Retry save to check safely.','සම්බන්ධතාව බිඳ වැටුණා. ක්‍රියාව සුරැකී තිබිය හැකියි. නැවත සුරැකීම ඔබා තහවුරු කරන්න.'),uncertain:true}}
 let data;try{data=await response.json()}catch{throw {message:'Unable to read server response.',uncertain:true}}if(!response.ok)throw {message:data.error||'Request failed.',status:response.status,data,uncertain:response.status>=500};return data;};
const nameOf=(c,t)=>c[t==='A'?'teamA':'teamB'];
const overString=n=>`${Math.floor(n/6)}.${n%6}`;
const inningsFormat=c=>c.format==='two-day'?tr('Two-day','දෙදින'):c.overs+' '+tr('overs','ඕවර');
const inningsLimit=c=>c.overs===null?'':' / '+c.overs;
function matchTarget(m){
 const innings=m.state.innings;
 if(innings.length!==(m.config.format==='two-day'?4:2))return null;
 const current=innings.at(-1);
 return 1+innings.slice(0,-1).reduce((target,inn)=>target+(inn.team===current.team?-inn.total:inn.total),0);
}
const resultOf=m=>{const r=m.state.result;if(!r)return '';if(r.kind==='draw')return tr('Match drawn','තරගය ජය පරාජයෙන් තොරව අවසන්');if(r.kind==='innings')return `${nameOf(m.config,r.winner)} · ${tr('won by an innings and','ඉනිමකින් සහ')} ${r.margin} ${tr('runs','ලකුණු')}`;if(r.kind==='tie')return tr('Match tied','තරගය සම විය');return language==='si'?`${nameOf(m.config,r.winner)} ${r.kind==='runs'?'ලකුණු':'කඩුලු'} ${r.margin} කින් ජයග්‍රහණය කළා`:`${nameOf(m.config,r.winner)} won by ${r.margin} ${r.kind}`};
const stateName=s=>({scheduled:tr('Upcoming','ඉදිරි තරගය'),live:tr('Live','සජීවී'),interval:tr('Innings break','ඉනිම් අතර විවේකය'),completed:tr('Completed','අවසන්')}[s]||s);
const workspaceHeading=(title,sub)=>heading(tr('YOUR PRIVATE SCORING WORKSPACE','ඔබගේ පෞද්ගලික ලකුණු පුවරුව'),title,sub);
const errorPanel=error=>`<div class="empty"><h2>${safe(error.status===401?tr('Sign in to continue','ඉදිරියට යාමට පිවිසෙන්න'):tr('Could not load matches','තරග ලබාගැනීමට නොහැකි විය'))}</h2><p class="muted">${safe(error.message)}</p>${error.status===401?`<a class="button primary" href="/signin-with-chatgpt?return_to=${encodeURIComponent('/'+location.hash)}" target="_top">${tr('Sign in with ChatGPT','ChatGPT සමඟ පිවිසෙන්න')}</a>`:`<button class="button" id="reload-workspace">${tr('Try again','නැවත උත්සාහ කරන්න')}</button>`}</div>`;
function showWorkspaceError(error){main.innerHTML=errorPanel(error);document.querySelector('#reload-workspace')?.addEventListener('click',render);}
function savedCard(m){const c=m.config;return `<a class="match-card" href="#score/${m.id}"><div class="card-body"><div class="statusline"><span class="pill ${m.state.status==='live'?'live':''}">${stateName(m.state.status)}</span><small class="muted">${safe(c.date)}</small></div><h3>${safe(c.teamA)} <span class="muted">vs</span> ${safe(c.teamB)}</h3><p class="subtitle">${safe(c.competition)} · ${inningsFormat(c)}</p>${m.state.innings.map(i=>`<div class="saved-score"><span>${safe(nameOf(c,i.team))}</span><strong>${i.total}/${i.wickets} <small>(${overString(i.balls)})</small></strong></div>`).join('')}<p class="result">${safe(resultOf(m)||c.venue)}</p></div><div class="card-footer"><span>${tr('Saved match','සුරැකි තරගය')}</span><span>${tr('Open scorer ↗','ලකුණු ඇතුළත් කරන්න ↗')}</span></div></a>`}
let savedMatches=[],savedSearch='',savedStatus='all';
function renderSavedMatches(){const results=savedMatches.filter(m=>(savedStatus==='all'||m.state.status===savedStatus)&&[m.config.teamA,m.config.teamB,m.config.competition,m.config.venue].join(' ').toLowerCase().includes(savedSearch.toLowerCase()));document.querySelector('#saved-count').textContent=`${results.length} ${tr('matches','තරග')}`;document.querySelector('#saved-list').innerHTML=results.length?results.map(savedCard).join(''):`<div class="empty"><h2>${tr('No matches found','තරග හමු නොවීය')}</h2><p>${tr('Try another school, competition or status.','වෙනත් පාසලක්, තරගාවලියක් හෝ තත්ත්වයක් තෝරන්න.')}</p></div>`;}
async function adminPage(seq){try{const [data,session]=await Promise.all([api('/api/matches'),api('/api/session')]);if(seq!==renderSequence)return;savedMatches=data.matches;main.innerHTML=`${workspaceHeading(tr('My matches','මගේ තරග'),tr('Create a match, score each ball, and return to your saved score anytime.','තරගයක් සාදා සෑම පන්දුවකටම ලකුණු ඇතුළත් කරන්න. සුරැකි තරගය ඕනෑම වේලාවක නැවත විවෘත කළ හැකියි.'))}<div class="workspace-toolbar">${session.admin ? `<a class="button primary" href="#new">＋ ${tr('Create match','තරගයක් සාදන්න')}</a><a class="button" href="#squads">${tr('Schools and squads','පාසල් සහ කණ්ඩායම්')}</a>` : ''}<button class="button" id="reload-workspace">↻ ${tr('Refresh','යාවත්කාලීන කරන්න')}</button></div><div class="info">${tr('Open a match you manage or score, then select Live scorecard to follow it in another tab.','ඔබ කළමනාකරණය කරන හෝ ඔබට පවරා ඇති තරගයක් විවෘත කර සජීවී ලකුණු පත්‍රය තෝරන්න.')}</div>${data.matches.length?`<div class="filters"><input id="saved-search" type="search" aria-label="${tr('Search saved matches','සුරැකි තරග සොයන්න')}" placeholder="${tr('Search teams, competition or ground…','කණ්ඩායම්, තරගාවලිය හෝ ක්‍රීඩාංගණය සොයන්න…')}" value="${safe(savedSearch)}"><select id="saved-status" aria-label="${tr('Match status','තරග තත්ත්වය')}"><option value="all">${tr('All statuses','සියලු තත්ත්ව')}</option>${['scheduled','live','interval','completed'].map(status=>`<option value="${status}" ${savedStatus===status?'selected':''}>${stateName(status)}</option>`).join('')}</select><button class="button" id="saved-reset">${tr('Reset filters','පෙරහන් ඉවත් කරන්න')}</button></div><p class="subtitle" id="saved-count" role="status"></p><div id="saved-list" class="cards" style="margin-top:18px"></div>`:`<div class="empty"><h2>${tr('Your first match starts here','ඔබගේ පළමු තරගය මෙතැනින් අරඹන්න')}</h2><p class="muted">${tr('No saved matches yet. Add the teams and playing players to get started.','තවම සුරැකි තරග නැහැ. කණ්ඩායම් සහ ක්‍රීඩකයින් ඇතුළත් කර ආරම්භ කරන්න.')}</p>${session.admin?`<a class="button primary" href="#new">${tr('Create your first match','පළමු තරගය සාදන්න')}</a>` : ''}</div>`}<p class="subtitle">${tr('Showing the 100 most recently updated matches.','මෑතකදී යාවත්කාලීන කළ තරග 100 දක්වා පෙන්වයි.')}</p>`;document.querySelector('#reload-workspace').onclick=render;if(data.matches.length){renderSavedMatches();document.querySelector('#saved-search').oninput=e=>{savedSearch=e.target.value;renderSavedMatches()};document.querySelector('#saved-status').onchange=e=>{savedStatus=e.target.value;renderSavedMatches()};document.querySelector('#saved-reset').onclick=()=>{savedSearch='';savedStatus='all';document.querySelector('#saved-search').value='';document.querySelector('#saved-status').value='all';renderSavedMatches()}}localize();}catch(e){if(seq===renderSequence)showWorkspaceError(e)}}
const field=(label,name,placeholder='',type='text',value='')=>`<label>${label}<input name="${name}" type="${type}" required maxlength="100" placeholder="${placeholder}" value="${safe(value)}"></label>`;
function newPage(){main.innerHTML=`<a href="#admin" class="back">← ${tr('My matches','මගේ තරග')}</a>${workspaceHeading(tr('Set up a match','තරගයක් සකස් කරන්න'),tr('Enter the playing teams. You can edit the date, ground and player lists before scoring starts.','ක්‍රීඩා කරන කණ්ඩායම් ඇතුළත් කරන්න. ලකුණු සටහන් කිරීම ඇරඹීමට පෙර දිනය, ක්‍රීඩාංගණය සහ ක්‍රීඩක ලැයිස්තු වෙනස් කළ හැකියි.'))}<form id="new-match" class="panel form-panel"><div class="form-grid">${field(tr('Team A','කණ්ඩායම A'),'teamA',tr('School or team name','පාසලේ හෝ කණ්ඩායමේ නම'))}${field(tr('Team B','කණ්ඩායම B'),'teamB',tr('School or team name','පාසලේ හෝ කණ්ඩායමේ නම'))}${field(tr('Competition','තරගාවලිය'),'competition',tr('e.g. Under 19 friendly','උදා. අවු. 19 න් පහළ සුහද තරගය'))}${field(tr('Ground','ක්‍රීඩාංගණය'),'venue')}${field(tr('Match date','තරග දිනය'),'date','','date',new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Colombo'}))}<label>${tr('Format','තරග වර්ගය')}<select name="format"><option value="limited">${tr('Limited overs','සීමිත ඕවර')}</option><option value="two-day">${tr('Two-day · two innings per team','දෙදින · කණ්ඩායමකට ඉනිම් දෙකක්')}</option></select></label><label>${tr('Overs per innings','ඉනිමකට ඕවර ගණන')}<input name="overs" type="number" min="1" max="50" value="20" required></label><label>${tr('Batting first (after toss)','පළමුව පන්දුවට පහර දෙන්නේ')}<select name="firstBat"><option value="A">${tr('Team A','කණ්ඩායම A')}</option><option value="B">${tr('Team B','කණ්ඩායම B')}</option></select></label><label>${tr('Free hit after a no-ball','නිපන්දුවකට පසු Free hit')}<select name="freeHit"><option value="false">${tr('Off — follow your competition rules','නැත — තරගාවලියේ නීති අනුව තෝරන්න')}</option><option value="true">${tr('On','ඇත')}</option></select></label><label>${tr('Team A players — one per line','කණ්ඩායම A ක්‍රීඩකයින් — එක් පේළියකට එක් නමක්')}<textarea name="playersA" rows="8" required maxlength="1000" placeholder="${tr('Player 1\nPlayer 2\nPlayer 3','ක්‍රීඩකයා 1\nක්‍රීඩකයා 2\nක්‍රීඩකයා 3')}"></textarea></label><label>${tr('Team B players — one per line','කණ්ඩායම B ක්‍රීඩකයින් — එක් පේළියකට එක් නමක්')}<textarea name="playersB" rows="8" required maxlength="1000" placeholder="${tr('Player 1\nPlayer 2\nPlayer 3','ක්‍රීඩකයා 1\nක්‍රීඩකයා 2\nක්‍රීඩකයා 3')}"></textarea></label></div><p class="subtitle">${tr('Use 2–11 unique names per team, with equal team sizes. Scoring ends when all but one player are out.','කණ්ඩායමකට වෙනස් නම් 2–11 ක් යොදන්න. කණ්ඩායම් දෙකේ ක්‍රීඩක ගණන සමාන විය යුතුයි.')}</p><p class="form-error" id="form-error" role="alert"></p><button class="button primary" type="submit">${tr('Create & save match','තරගය සාදා සුරකින්න')}</button><a class="button" href="#admin">${tr('Cancel','අවලංගු කරන්න')}</a></form>`;
 const newMatchForm=document.querySelector('#new-match');
 const toggleOvers=()=>{const unlimited=newMatchForm.elements.format.value==='two-day';newMatchForm.elements.overs.disabled=unlimited;newMatchForm.elements.overs.closest('label').hidden=unlimited;};
 newMatchForm.elements.format.onchange=toggleOvers;
 newMatchForm.addEventListener('match-format-restored',toggleOvers);
 bindSavedSquads(newMatchForm);
 document.querySelector('#new-match').onsubmit=async e=>{e.preventDefault();if(saving)return;const form=e.currentTarget;const f=new FormData(form);const config=Object.fromEntries(f);config.overs=Number(f.get('overs'));config.freeHit=f.get('freeHit')==='true';for(const k of ['playersA','playersB'])config[k]=String(f.get(k)).split('\n').map(v=>v.trim()).filter(Boolean);newMatchId??=crypto.randomUUID();saving=true;form.querySelector('button').disabled=true;document.querySelector('#form-error').textContent=tr('Saving…','සුරකිමින්…');try{const r=await api('/api/matches',{method:'POST',body:JSON.stringify({id:newMatchId,config})});newMatchId=null;location.hash=`score/${r.match.id}`}catch(error){document.querySelector('#form-error').textContent=translateError(error.message);if(!error.uncertain)newMatchId=null}finally{saving=false;form.querySelector('button').disabled=false}};
}
function options(names,selected,filter=()=>true){return names.map((p,i)=>filter(p,i)?`<option value="${i}" ${selected===i?'selected':''}>${safe(p.name||p)}</option>`:'').join('')}
function chooser(m){const inn=m.state.innings.at(-1),c=m.config;const nextTeam=m.state.innings.length%2===0?c.firstBat:c.firstBat==='A'?'B':'A';const bat=c[nextTeam==='A'?'playersA':'playersB'],bowl=c[nextTeam==='A'?'playersB':'playersA'];return `<form id="start-innings" class="panel form-panel"><h2>${tr('Start innings','ඉනිම අරඹන්න')} ${m.state.innings.length+1} · ${safe(nameOf(c,nextTeam))}</h2><div class="form-grid"><label>${tr('Striker','පන්දුවට මුහුණ දෙන පිතිකරු')}<select name="striker">${options(bat,0)}</select></label><label>${tr('Non-striker','අනෙක් අන්තයේ පිතිකරු')}<select name="nonStriker">${options(bat,1)}</select></label><label>${tr('Opening bowler','පළමු පන්දු යවන්නා')}<select name="bowler">${options(bowl,0)}</select></label></div><button type="submit" class="button primary">${tr('Start innings','ඉනිම අරඹන්න')}</button></form>`}
function scoreControls(m){if(m.approvedAt)return `<div class="info">${safe(resultOf(m))} · ${tr('Approved and locked for scoring','අනුමත කර ඇත. ලකුණු වෙනස් කිරීමට තරගය නැවත විවෘත කළ යුතුයි.')}</div>`;const inn=m.state.innings.at(-1);if(m.state.status==='completed')return `<div class="info"><strong>${safe(resultOf(m))}</strong><p>${tr('Match complete. Undo is available below for corrections.','තරගය අවසන්. නිවැරදි කිරීමක් සඳහා පහළ Undo භාවිත කරන්න.')}</p></div>`;if(!inn||inn.closed)return chooser(m);const needBatter=inn.striker===null||inn.nonStriker===null,needBowler=inn.bowler===null;
 if(needBatter||needBowler)return `<div class="panel"><h2>${tr('Ready for the next ball','ඊළඟ පන්දුව සඳහා සූදානම් වන්න')}</h2>${needBatter?`<form id="choose-batter" class="inline-form"><label>${tr('Next batter','ඊළඟ පිතිකරු')}<select name="player">${options(inn.batting,null,p=>!p.entered)}</select></label><button class="button primary">${tr('Set batter','පිතිකරු තෝරන්න')}</button></form>`:''}${needBowler?`<form id="choose-bowler" class="inline-form"><label>${tr('New over — choose bowler','නව ඕවරය — පන්දු යවන්නා තෝරන්න')}<select name="player">${options(inn.bowling,null,(_,i)=>i!==inn.previousBowler)}</select></label><button class="button primary">${tr('Set bowler','පන්දු යවන්නා තෝරන්න')}</button></form>`:''}</div>`;
 return `<section class="panel scorer-controls"><div class="section-head"><h2>${tr('Record the next ball','ඊළඟ පන්දුව ඇතුළත් කරන්න')}</h2>${inn.freeHit?'<span class="pill live">FREE HIT</span>':''}</div><p class="subtitle">${safe(inn.bowling[inn.bowler].name)} → ${safe(inn.batting[inn.striker].name)}</p><div class="run-buttons">${[0,1,2,3,4,6].map(n=>`<button data-runs="${n}" class="${n>=4?'boundary':''}" aria-label="${n} ${tr('runs','ලකුණු')}">${n}<small>${n===0?tr('DOT','නිලකුණු'):n===4?tr('FOUR','හතර'):n===6?tr('SIX','හය'):tr('RUNS','ලකුණු')}</small></button>`).join('')}</div><p class="subtitle">${tr('4 and 6 quick buttons record boundaries. Use the detailed form for all-run 4/6, extras or wickets.','4 සහ 6 බොත්තම් සීමා ලකුණු ලෙස සටහන් වේ. දිවීමෙන් ලැබූ 4/6, අතිරේක හෝ කඩුලු සඳහා පහළ form එක භාවිත කරන්න.')}</p><form id="delivery-form"><div class="form-grid"><label>${tr('Delivery type','පන්දු වර්ගය')}<select name="extra"><option value="none">${tr('Normal delivery','සාමාන්‍ය පන්දුව')}</option><option value="wide">${tr('Wide (+1 penalty)','වයිඩ් (+1 දඬුවම් ලකුණ)')}</option><option value="no-ball">${tr('No-ball (+1) + bat runs','නිපන්දුව (+1) සහ පිත්තෙන් ලකුණු')}</option><option value="bye">${tr('Byes','බයි ලකුණු')}</option><option value="leg-bye">${tr('Leg byes','ලෙග් බයි ලකුණු')}</option><option value="nb-bye">${tr('No-ball (+1) + byes','නිපන්දුව (+1) සහ බයි')}</option><option value="nb-leg-bye">${tr('No-ball (+1) + leg byes','නිපන්දුව (+1) සහ ලෙග් බයි')}</option></select></label><label>${tr('Runs excluding the +1 penalty','+1 දඬුවම් ලකුණ හැර ලකුණු')}<input name="runs" type="number" min="0" max="6" value="0" required></label><label>${tr('Run type','ලකුණු වර්ගය')}<select name="boundary"><option value="false">${tr('Completed runs / no run','දිවීමෙන් ලකුණු / නිලකුණු')}</option><option value="true">${tr('Boundary (4 or 6)','සීමා ලකුණු (4 හෝ 6)')}</option></select></label><label>${tr('Dismissal','දැවීයාම')}<select name="wicket"><option value="">${tr('No wicket','කඩුල්ලක් නැත')}</option>${[['bowled','Bowled','පන්දුව කඩුල්ලේ වැදීම'],['caught','Caught','උඩපන්දුව'],['lbw','LBW','කඩුල්ල මුවා කිරීම'],['stumped','Stumped','ස්ටම්ප් කිරීම'],['hit-wicket','Hit wicket','පිතිකරු කඩුල්ල බිඳීම'],['run-out','Run out','දුවද්දී දැවීයාම']].map(([v,en,si])=>`<option value="${v}">${tr(en,si)}</option>`).join('')}</select></label><label>${tr('Dismissed batter (run-out only for non-striker)','දැවුණු පිතිකරු (අනෙක් අන්තය සඳහා run-out පමණයි)')}<select name="out"><option value="striker">${safe(inn.batting[inn.striker].name)}</option><option value="nonStriker">${safe(inn.batting[inn.nonStriker].name)}</option></select></label></div><button class="button primary" type="submit">${tr('Save delivery','පන්දුව සුරකින්න')}</button></form><p class="subtitle">${tr('For a run-out, enter completed runs only. After selecting the next batter, use Swap ends if the umpire requires a different end.','Run-out සඳහා සම්පූර්ණ කළ ලකුණු පමණක් යොදන්න. ඊළඟ පිතිකරු තේරීමෙන් පසු විනිසුරු තීරණය අනුව අවශ්‍ය නම් අන්ත මාරු කරන්න.')}</p><button class="button" id="swap-ends">⇄ ${tr('Swap ends','අන්ත මාරු කරන්න')}</button></section>`;
}
function inningsTable(inn){return `<section class="panel"><h2>${tr('Scorecard','ලකුණු පත්‍රය')} · ${inn.total}/${inn.wickets}</h2>${table(inn.batting.filter(p=>p.entered).map(p=>[safe(p.name),p.out?safe(p.dismissal):tr('not out','නොදැවී'),p.runs,p.balls,p.fours,p.sixes]),[tr('BATTER','පිතිකරු'),tr('STATUS','තත්ත්වය'),'R','B','4s','6s'])}<p class="subtitle">${tr('Extras','අතිරේක')}: ${Object.values(inn.extras).reduce((a,b)=>a+b,0)} · Wd ${inn.extras.wide} / Nb ${inn.extras.noBall} / B ${inn.extras.bye} / Lb ${inn.extras.legBye}</p>${table(inn.bowling.filter(p=>p.balls||p.runs||p.wickets).map(p=>[safe(p.name),overString(p.balls),p.runs,p.wickets]),[tr('BOWLER','පන්දු යවන්නා'),'O','R','W'])}</section>`}
function drawScorer(m,error=''){workspaceMatch=m;const c=m.config,s=m.state,inn=s.innings.at(-1);main.innerHTML=`<a href="#admin" class="back">← ${tr('My matches','මගේ තරග')}</a>${workspaceHeading(`${safe(c.teamA)} vs ${safe(c.teamB)}`,`${safe(c.competition)} · ${safe(c.date)} · ${safe(c.venue)} · ${inningsFormat(c)}`)}<div class="workspace-toolbar"><span class="pill ${s.status==='live'?'live':''}">${stateName(s.status)}</span><span class="save-label">${offlineQueue.length?tr('Waiting to sync','Sync වීමට බලා සිටී'):tr('✓ Saved to your account','✓ ඔබගේ ගිණුමට සුරැකුණා')} · ${new Date(m.updatedAt).toLocaleTimeString(language==='si'?'si-LK':'en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'Asia/Colombo'})} SLST</span><button class="button" id="refresh-score">↻ ${tr('Refresh','යාවත්කාලීන කරන්න')}</button><a class="button primary" href="#watch/${m.id}">${tr('Live scorecard ↗','සජීවී ලකුණු පත්‍රය ↗')}</a><button class="button" id="download-score">↓ ${tr('Export scorecard','ලකුණු පත්‍රය ලබාගන්න')}</button></div><div class="panel live-board">${s.innings.length?s.innings.map(i=>`<div class="saved-score"><span>${safe(nameOf(c,i.team))}</span><strong>${i.total}/${i.wickets} <small>(${overString(i.balls)}${inningsLimit(c)})</small></strong></div>`).join(''):`<h2>${tr('Ready for the first ball','පළමු පන්දුවට සූදානම්')}</h2>`}${matchTarget(m)!==null&&!inn.closed?`<p>${tr('Target','ඉලක්කය')}: ${matchTarget(m)} · ${tr('Need','අවශ්‍යයි')} ${Math.max(0,matchTarget(m)-inn.total)}${c.overs===null?'':` ${tr('from','පන්දු')} ${Math.max(0,c.overs*6-inn.balls)}`}</p>`:''}${inn&&!inn.closed?`<div class="batters-line">${inn.striker!==null?`★ ${safe(inn.batting[inn.striker].name)} ${inn.batting[inn.striker].runs} (${inn.batting[inn.striker].balls})`:tr('Select next batter','ඊළඟ පිතිකරු තෝරන්න')} &nbsp; / &nbsp; ${inn.nonStriker!==null?safe(inn.batting[inn.nonStriker].name):'—'}</div>`:''}${inn?.deliveries.length?`<div class="ball-stream">${inn.deliveries.slice(-12).map(b=>`<span title="${b.label}: ${b.extra}" class="ball-chip ${b.wicket?'wicket':''}">${b.wicket?'W':b.extra==='none'?b.total:`${b.total}${b.extra==='wide'?'wd':b.extra.includes('nb')||b.extra==='no-ball'?'nb':b.extra==='bye'?'b':'lb'}`}</span>`).join('')}</div>`:''}</div><div class="form-error" id="score-error" role="alert">${safe(translateError(error))}</div>${offlinePanel(m)}${syncConflict?'' : scoreControls(m)}<div class="workspace-toolbar"><button class="button" id="undo-action" ${s.activeCount===0||syncConflict||m.approvedAt?'disabled':''}>↶ ${tr('Undo last action','අවසන් ක්‍රියාව ආපසු ගන්න')}</button>${inn&&!inn.closed&&!syncConflict?`<button class="button" id="end-innings">${tr('Close innings early','ඉනිම කලින් අවසන් කරන්න')}</button>`:''}</div> ${c.format==='two-day'&&inn&&s.status!=='completed'&&!syncConflict? `<button class="button" id="draw-match">${tr('Finish as a draw','ජය පරාජයෙන් තොරව අවසන් කරන්න')}</button>`:''}<div id="confirm-action"></div>${matchManagement(m)}<div class="score-columns">${s.innings.map(inningsTable).join('')}</div><details class="panel audit"><summary>${tr('Scoring history & corrections','ලකුණු ඇතුළත් කිරීම් සහ නිවැරදි කිරීම්')} (${m.history.length})</summary>${m.history.slice(-60).reverse().map(e=>`<div class="history-row"><small>${new Date(e.at).toLocaleTimeString('en-GB',{timeZone:'Asia/Colombo'})}</small><span>${safe(commandLabel(e.command))}</span></div>`).join('')||`<p>${tr('No scoring actions yet.','තවම ලකුණු ඇතුළත් කර නැහැ.')}</p>`}</details><div class="info">${tr('Limited overs and two-day scoring. Two-day matches alternate innings. Confirm competition rules before official use.','සීමිත ඕවර සහ දෙදින තරග සඳහා. දෙදින තරගවල කණ්ඩායම් මාරුවෙන් මාරුවට ඉනිම් ක්‍රීඩා කරයි. නිල භාවිතයට පෙර තරගාවලි නීති තහවුරු කරන්න.')}</div>`;
 bindScorer(m);bindQueueControls(m);document.querySelector('#draw-match')?.addEventListener('click',()=>confirmAction(tr('End this match as a draw?','තරගය ජය පරාජයෙන් තොරව අවසන් කරන්නද?'),{type:'draw'}));bindManagement(m);localize();}
function commandLabel(c){const types={start:tr('Innings started','ඉනිම ආරම්භ කළා'),batter:tr('Next batter selected','ඊළඟ පිතිකරු තෝරාගත්තා'),bowler:tr('New bowler selected','නව පන්දු යවන්නා තෝරාගත්තා'),swap:tr('Ends swapped','අන්ත මාරු කළා'),end:tr('Innings closed','ඉනිම අවසන් කළා'),draw:tr('Match drawn','තරගය ජය පරාජයෙන් තොරව අවසන්'),undo:tr('UNDO — previous action reversed','UNDO — පෙර ක්‍රියාව ආපසු ගත්තා')};return types[c.type]||`${tr('Ball','පන්දුව')}: ${c.runs} · ${c.extra}${c.wicket?' · '+c.wicket:''}${c.boundary?' · '+tr('boundary','සීමා ලකුණු'):''}`}
function confirmAction(label,command){const box=document.querySelector('#confirm-action');box.innerHTML=`<div class="info"><p>${label}</p><button id="confirm-yes" class="button primary">${tr('Confirm','තහවුරු කරන්න')}</button> <button id="confirm-no" class="button">${tr('Cancel','අවලංගු කරන්න')}</button></div>`;document.querySelector('#confirm-no').onclick=()=>box.innerHTML='';document.querySelector('#confirm-yes').onclick=()=>saveCommand(command)}
function bindScorer(m){document.querySelector('#refresh-score').onclick=render;document.querySelector('#retry-save')?.addEventListener('click',()=>saveCommand(null,true));document.querySelectorAll('[data-runs]').forEach(b=>b.onclick=()=>saveCommand({type:'ball',runs:Number(b.dataset.runs),extra:'none',boundary:Number(b.dataset.runs)>=4,wicket:null,out:'striker'}));document.querySelector('#start-innings')?.addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.currentTarget);saveCommand({type:'start',striker:Number(f.get('striker')),nonStriker:Number(f.get('nonStriker')),bowler:Number(f.get('bowler'))})});for(const kind of ['batter','bowler'])document.querySelector(`#choose-${kind}`)?.addEventListener('submit',e=>{e.preventDefault();saveCommand({type:kind,player:Number(new FormData(e.currentTarget).get('player'))})});document.querySelector('#delivery-form')?.addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.currentTarget);saveCommand({type:'ball',runs:Number(f.get('runs')),extra:f.get('extra'),boundary:f.get('boundary')==='true',wicket:f.get('wicket')||null,out:f.get('out')})});document.querySelector('#swap-ends')?.addEventListener('click',()=>confirmAction(tr('Swap the batters’ ends? This correction is recorded in history.','පිතිකරුවන්ගේ අන්ත මාරු කරන්නද? මෙම නිවැරදි කිරීම ඉතිහාසයේ සටහන් වේ.'),{type:'swap'}));document.querySelector('#undo-action').onclick=()=>confirmAction(tr('Reverse the last active action? The original action and correction remain in history.','අවසන් ක්‍රියාව ආපසු ගන්නද? මුල් ක්‍රියාව සහ නිවැරදි කිරීම ඉතිහාසයේ පවතී.'),{type:'undo'});document.querySelector('#end-innings')?.addEventListener('click',()=>confirmAction(tr('Close this innings now? This may determine the match result in the second innings.','මෙම ඉනිම දැන් අවසන් කරන්නද? දෙවන ඉනිම නම් තරග ප්‍රතිඵලය තීරණය විය හැකියි.'),{type:'end',reason:'innings closed'}));document.querySelector('#download-score').onclick=()=>{const blob=new Blob([JSON.stringify({config:m.config,state:m.state,history:m.history,updatedAt:m.updatedAt},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`matchday-${m.id}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}}

let scoringBase = null;
let offlineQueue = [];
let syncConflict = false;
let scoringEngine;

const queueKey = id => 'matchday-queue-v1:' + id;
function readOfflineQueue(id) {
 try { return JSON.parse(localStorage.getItem(queueKey(id))) || []; }
 catch { return []; }
}
function persistOfflineQueue(id,queue) {
 if(queue.length)localStorage.setItem(queueKey(id),JSON.stringify(queue));
 else localStorage.removeItem(queueKey(id));
 offlineQueue=queue;
}
function projectOfflineScore(base, queue) {
 const history = [...base.history];
 let state = base.state;
 for (const record of queue) {
  const result = scoringEngine.appendCommand(base.config,history,record.command,{id:record.eventId,at:record.at,actor:'local'});
  history.push(result.journal.at(-1));
  state = result.state;
 }
 return {...base,state,history,revision:base.revision+queue.length};
}
function offlinePanel(m) {
 if(!offlineQueue.length)return '';
 return `<div class="info">
  <p>${offlineQueue.length} ${tr('scoring actions waiting to sync from this browser.','ලකුණු සටහන් මෙම browser එකෙන් sync වීමට බලා සිටී.')}</p>
  ${syncConflict?`<p>${tr('The server score changed. Compare the saved score and download the queued actions before clearing them.','සේවාදායකයේ ලකුණු වෙනස් වී ඇත. සුරැකි ලකුණු පරීක්ෂා කර, ඉවත් කිරීමට පෙර මෙම සටහන් බාගන්න.')}</p>
   <button class="button" id="export-queue">${tr('Download queued actions','සුරැකි සටහන් බාගන්න')}</button>
   <button class="button" id="clear-queue">${tr('Clear queued actions','පොරොත්තු සටහන් ඉවත් කරන්න')}</button>`:''}
  <button class="button" id="retry-save">${tr('Sync now','දැන් sync කරන්න')}</button></div>`;
}
function withScoreLock(id,action){
 return navigator.locks ? navigator.locks.request(queueKey(id),action) : action();
}
async function saveCommand(command,retry=false) {
 if(saving||!scoringBase)return;
 const id=scoringBase.id;
 saving=true;
 main.querySelectorAll('button').forEach(button=>button.disabled=true);
 let message='';
 try {
  await withScoreLock(id,async()=>{
   const queued = readOfflineQueue(id);
   if(!retry) {
    if(syncConflict || queued.at(-1)?.eventId!==offlineQueue.at(-1)?.eventId){
     syncConflict=true;
     offlineQueue=queued;
     message=tr('This match changed in another tab. Sync or refresh before scoring.','තරගය වෙනත් tab එකක වෙනස් විය. ලකුණු ඇතුළත් කිරීමට පෙර sync කරන්න.');
     return;
    }
    const record={eventId:crypto.randomUUID(),revision:scoringBase.revision+queued.length,command,at:new Date().toISOString()};
    if(scoringEngine)projectOfflineScore(scoringBase,[...queued,record]);
    persistOfflineQueue(id,[...queued,record]);
   }else{
    offlineQueue=queued;
   }
   if(!navigator.onLine)return;
   while(offlineQueue.length){
    const [record,...remaining]=offlineQueue;
    try{
     const data=await api('/api/matches/'+encodeURIComponent(id),{method:'POST',signal:AbortSignal.timeout(10000),body:JSON.stringify(record)});
     scoringBase=data.match;
     persistOfflineQueue(id,remaining);
     syncConflict=remaining.length>0 && remaining[0].revision!==scoringBase.revision;
     if(syncConflict)break;
    }catch(error){
     if(error.uncertain)break;
     if(error.status===400 && offlineQueue.length===1 && !retry){
      persistOfflineQueue(id,[]);
     }else{
      syncConflict=true;
      if(error.data?.match)scoringBase=error.data.match;
     }
     message=error.message;
     break;
    }
   }
   if(!offlineQueue.length)syncConflict=false;
  });
 } catch(error) {
  message=error.message||tr('Could not store this action on this device.','මෙම සටහන මෙම උපාංගයේ සුරැකීමට නොහැකි විය.');
 } finally {
  saving=false;
  if(location.hash==='#score/'+id)renderPendingScore(message);
 }
}
function renderPendingScore(message=''){
 let display=scoringBase;
 if(scoringEngine&&!syncConflict&&offlineQueue.length){
  try{display=projectOfflineScore(scoringBase,offlineQueue);}
  catch{syncConflict=true;}
 }
 drawScorer(display,message);
}
async function scorerPage(id,seq) {
 if(saving){
  main.innerHTML=`<div class="info">${tr('Scoring is syncing. Open the match again in a moment.','ලකුණු sync වෙමින් පවතී. මඳකින් තරගය නැවත විවෘත කරන්න.')}</div><a class="button" href="#admin">${tr('My matches','මගේ තරග')}</a>`;
  return;
 }
 try {
  const {match}=await api('/api/matches/'+encodeURIComponent(id));
  if(seq!==renderSequence)return;
  scoringBase=match;
  offlineQueue=readOfflineQueue(id);
  syncConflict=false;
  try {scoringEngine=await import('/score-engine.mjs');}catch{scoringEngine=null;}
  if(seq!==renderSequence)return;
  renderPendingScore();
  if(offlineQueue.length && navigator.onLine)saveCommand(null,true);
 } catch(error) {
  if(seq!==renderSequence)return;
  if(error.uncertain && scoringBase?.id===id){renderPendingScore();return;}
  showWorkspaceError(error);
 }
}
function bindQueueControls(m) {
 document.querySelector('#export-queue')?.addEventListener('click',()=>{
  const link=document.createElement('a');
  const url=URL.createObjectURL(new Blob([JSON.stringify(offlineQueue,null,2)],{type:'application/json'}));
  link.href=url;
  link.download='matchday-unsynced-'+m.id+'.json';
  link.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
 });
 document.querySelector('#clear-queue')?.addEventListener('click',()=>{
  if(!confirm(tr('Clear the unsynced actions from this browser?','මෙම browser එකේ sync නොකළ සටහන් ඉවත් කරන්නද?')))return;
  withScoreLock(m.id,()=>persistOfflineQueue(m.id,[])).then(()=>{
   syncConflict=false;render();
  });
 });
}
window.addEventListener('online',()=>{
 if(!saving&&offlineQueue.length&&location.hash==='#score/'+scoringBase?.id)saveCommand(null,true);
});

async function openSquads(epoch, editingId) {
 main.innerHTML = heading(tr('Team management','කණ්ඩායම් කළමනාකරණය'),tr('Schools and squads','පාසල් සහ කණ්ඩායම්'),tr('Save a school, team and player list for future matches.','ඉදිරි තරග සඳහා පාසල, කණ්ඩායම සහ ක්‍රීඩක ලැයිස්තුව සුරකින්න.'));
 const content=document.createElement('div');
 main.append(content);
 content.textContent=tr('Loading squads…','කණ්ඩායම් ලබාගනිමින්…');
 try {
  const {squads}=await api('/api/squads');
  if(epoch!==watchEpoch)return;
  const squad=squads.find(candidate=>candidate.id===editingId);
  const id=squad?.id||crypto.randomUUID();
  content.innerHTML=`<form id="squad-form" class="panel">
   <h2>${squad?tr('Edit squad','කණ්ඩායම සංස්කරණය කරන්න'):tr('Add squad','කණ්ඩායමක් එක් කරන්න')}</h2>
   <div class="form-grid">
   ${field(tr('School','පාසල'),'school','','text',squad?.school||'')}
   ${field(tr('Team name','කණ්ඩායමේ නම'),'team','','text',squad?.team||'')}
   <label>${tr('Players, one per line','ක්‍රීඩකයින්, පේළියකට එක් අයෙක්')}<textarea rows="6" name="players" required maxlength="1000">${safe(squad?.players.join('\n')||'')}</textarea></label>
   </div><button class="button primary">${tr('Save squad','කණ්ඩායම සුරකින්න')}</button>
   ${squad?`<a class="button" href="#squads">${tr('Add another squad','තවත් කණ්ඩායමක් එක් කරන්න')}</a>`:''}
   <p class="subtitle" id="squad-status" role="status"></p>
   </form><div class="cards" style="margin-top:18px">${squads.map(record=>`<a class="match-card" href="#squads/${encodeURIComponent(record.id)}"><div class="card-body"><h3>${safe(record.team)}</h3><p>${safe(record.school)} · ${record.players.length} ${tr('players','ක්‍රීඩකයින්')}</p></div><div class="card-footer">${tr('Edit roster ↗','ලැයිස්තුව සංස්කරණය කරන්න ↗')}</div></a>`).join('')}</div>`;
  const form=document.querySelector('#squad-form');
  form.onsubmit=async event=>{
   event.preventDefault();
   const f=new FormData(form), status=document.querySelector('#squad-status');
   const button=form.querySelector('button');
   button.disabled=true;
   try{
    await api('/api/squads',{method:'POST',body:JSON.stringify({id,revision:squad?.revision??null,
     school:f.get('school'),team:f.get('team'),players:f.get('players').split('\n').map(s=>s.trim()).filter(Boolean)})});
    if(epoch!==watchEpoch)return;
    if(squad)render();else location.hash='squads/'+id;
   }catch(error){
    status.textContent=translateError(error.message);
   }finally{button.disabled=false;}
  };
 } catch (error) {
  if(epoch!==watchEpoch)return;
  if(error.status===401){showWorkspaceError(error);return;}
  content.innerHTML=`<p class="info">${safe(translateError(error.message))}</p>`;
 }
}

async function bindSavedSquads(form) {
 try {
  const {squads}=await api('/api/squads');
  if(!form.isConnected || !squads.length)return;
  for(const side of ['A','B']){
   const label=document.createElement('label');
   label.textContent=side==='A'?tr('Saved squad A','සුරැකි කණ්ඩායම A'):tr('Saved squad B','සුරැකි කණ්ඩායම B');
   const picker=document.createElement('select');
   picker.append(new Option(tr('Select a squad','කණ්ඩායමක් තෝරන්න'),''));
   for(const squad of squads)picker.append(new Option(squad.school+' · '+squad.team,squad.id));
   picker.onchange=()=>{
    const squad=squads.find(candidate=>candidate.id===picker.value);
    if(!squad)return;
    form.elements['team'+side].value=squad.team;
    form.elements['players'+side].value=squad.players.join('\n');
   };
   label.append(picker);
   form.querySelector('.form-grid').prepend(label);
  }
 }catch{}
}

async function openPlayerStats(epoch){
 main.innerHTML=heading(tr('Scoring workspace','ලකුණු කළමනාකරණය'),tr('Player statistics','ක්‍රීඩක සංඛ්‍යාලේඛන'),tr('Runs and wickets from approved matches you manage.','ඔබ කළමනාකරණය කරන අනුමත තරගවල ලකුණු සහ කඩුලු.'));
 const content=document.createElement('div');
 main.append(content);
 content.textContent=tr('Loading statistics…','සංඛ්‍යාලේඛන ලබාගනිමින්…');
 try{
  const {players}=await api('/api/player-stats');
  if(epoch!==watchEpoch)return;
  if(!players.length){
   content.innerHTML=`<div class="empty"><h2>${tr('No player statistics yet','තවම ක්‍රීඩක සංඛ්‍යාලේඛන නැහැ')}</h2></div>`;
   return;
  }
  const competitions=[...new Set(players.map(p=>p.competition))];
  content.innerHTML=`<div class="panel"><div class="filters">
   <label>${tr('Tournament','තරගාවලිය')}<select id="player-competition">${competitions.map(name=>`<option>${safe(name)}</option>`).join('')}</select></label>
   <label>${tr('Sort by','පිළිවෙළ')}<select id="player-order"><option value="runs">${tr('Runs','ලකුණු')}</option><option value="wickets">${tr('Wickets','කඩුලු')}</option></select></label>
   </div><div id="player-stats-table"></div></div>`;
  const competition=document.querySelector('#player-competition'), order=document.querySelector('#player-order');
  function draw(){
   const sorted=players.filter(p=>p.competition===competition.value).sort((a,b)=>b[order.value]-a[order.value]||a.name.localeCompare(b.name));
   document.querySelector('#player-stats-table').innerHTML=table(sorted.map(p=>[safe(p.name),safe(p.team),p.runs,p.wickets]),
    [tr('PLAYER','ක්‍රීඩකයා'),tr('TEAM','කණ්ඩායම'),tr('RUNS','ලකුණු'),tr('WICKETS','කඩුලු')]);
  }
  competition.onchange=order.onchange=draw;
  draw();
 }catch(error){
  if(epoch!==watchEpoch)return;
  if(error.status===401){showWorkspaceError(error);return;}
  content.innerHTML=`<p class="info">${safe(translateError(error.message))}</p>`;
 }
}

function fixtureEditor(match) {
 const config=match.config;
 return `<details class="centre-publication fixture-editor">
  <summary>${tr('Edit fixture details','තරග විස්තර සංස්කරණය කරන්න')}</summary>
  <form id="edit-fixture">
   <div class="form-grid">
    ${field(tr('Match date','තරග දිනය'),'date','','date',config.date)}
    ${field(tr('Ground','ක්‍රීඩාංගණය'),'venue','','text',config.venue)}
    ${[['playersA',config.teamA],['playersB',config.teamB]].map(([name,team])=>`<label>
     ${safe(team)} · ${tr('Players, one per line','ක්‍රීඩකයින්, පේළියකට එක් අයෙක්')}
     <textarea name="${name}" rows="6" required maxlength="1000">${safe(config[name].join('\n'))}</textarea>
    </label>`).join('')}
   </div>
   <p class="subtitle">${tr('Enter 2–11 unique players per team, with the same number on both sides.','කණ්ඩායමකට වෙනස් ක්‍රීඩකයින් 2–11 අතර ගණනක් ඇතුළත් කරන්න. දෙපිලේ ක්‍රීඩක ගණන සමාන විය යුතුයි.')}</p>
   <button class="button primary" type="submit">${tr('Save fixture changes','තරග වෙනස්කම් සුරකින්න')}</button>
   <p id="fixture-feedback" class="subtitle" role="status"></p>
  </form>
 </details>`;
}

function matchManagement(match) {
 const approved = match.approvedAt
  ? tr('Result approved','ප්‍රතිඵලය අනුමතයි')
  : match.state.status === 'completed'
   ? tr('Result awaiting approval','ප්‍රතිඵලය අනුමැතිය බලාපොරොත්තුවෙන්')
   : tr('Scoring in progress or scheduled','ලකුණු ඇතුළත් කරමින් පවතී හෝ සැලසුම් කර ඇත');
 const isAdmin = match.role === 'admin';
 return `<section class="panel match-management">
  <h2>${tr('Match management','තරග කළමනාකරණය')}</h2>
  <p>${isAdmin ? tr('You manage this match','ඔබ මෙම තරගය කළමනාකරණය කරයි') : tr('You are the assigned scorer','ඔබ මෙම තරගයට පවරා ඇති ලකුණු සටහන්කරුයි')} · <strong>${approved}</strong></p>
  ${match.canEditFixture&&!offlineQueue.length?fixtureEditor(match):''}
  ${isAdmin&&!match.canEditFixture?`<p class="subtitle">${tr('Fixture details are locked after scoring starts.','ලකුණු ඇතුළත් කිරීම ඇරඹුණු පසු තරග විස්තර වෙනස් කළ නොහැක.')}</p>`:''}
  ${isAdmin ? `<form id="scorer-assignment" class="inline-form">
   <label>${tr('Scorer’s ChatGPT email','ලකුණු සටහන්කරුගේ ChatGPT ඊමේල් ලිපිනය')}
    <input name="email" type="email" maxlength="254" value="${safe(match.scorerEmail || '')}">
   </label>
   <button class="button" type="submit">${tr('Save assignment','පැවරීම සුරකින්න')}</button>
   ${match.scorerEmail ? `<button class="button" type="button" id="remove-scorer">${tr('Remove scorer','ලකුණු සටහන්කරු ඉවත් කරන්න')}</button>` : ''}
  </form>
  <p class="subtitle">${tr('The scorer must sign in with this email.','ලකුණු සටහන්කරු මෙම ඊමේල් ලිපිනයෙන් පිවිසිය යුතුයි.')}</p>
  ${match.approvedAt ? `<button class="button" id="reopen-result">${tr('Reopen for corrections','නිවැරදි කිරීම් සඳහා නැවත විවෘත කරන්න')}</button>`
   : match.state.status === 'completed' ? `<button class="button primary" id="approve-result">${tr('Approve result','ප්‍රතිඵලය අනුමත කරන්න')}</button>` : ''}`
  : ''}
  ${isAdmin ? `<div class="centre-publication">
   <p class="subtitle">${match.publishedAt
    ? tr('Listed in Match Centre.','තරග මධ්‍යස්ථානයේ පළ කර ඇත.')
    : tr('Listing shows team names, fixture details and live team totals to Match Centre visitors.','පළ කළ විට කණ්ඩායම් නම්, තරග තොරතුරු සහ සජීවී කණ්ඩායම් ලකුණු පෙන්වයි.')}</p>
   <button class="button" id="toggle-listing">${match.publishedAt
    ? tr('Hide from Match Centre','තරග මධ්‍යස්ථානයෙන් සඟවන්න')
    : tr('List in Match Centre','තරග මධ්‍යස්ථානයේ පළ කරන්න')}</button>
   ${match.publishedAt ? `<a class="button" href="#spectate/${encodeURIComponent(match.id)}">${tr('Open spectator view ↗','ප්‍රේක්ෂක දසුන ↗')}</a>` : ''}
   ${match.publishedAt ? `<button class="button" id="toggle-public-score">${match.publicScore?tr('Stop public sharing','පොදු ප්‍රවේශය නවත්වන්න'):tr('Share team scores publicly','කණ්ඩායම් ලකුණු පොදුවේ පෙන්වන්න')}</button>` : ''}
  </div>` : ''}
  ${offlineQueue.length ? `<p class="subtitle">${tr('Sync scoring actions before changing match settings.','තරග සැකසුම් වෙනස් කිරීමට පෙර ලකුණු sync කරන්න.')}</p>` : ''}
  <p id="management-feedback"  class="subtitle" role="status"></p>
 </section>`;
}
function bindManagement(match) {
 async function update(action, fields = {}) {
  if (saving || offlineQueue.length) return;
  saving = true;
  const panel = document.querySelector('.match-management');
  const feedback = panel.querySelector(action==='edit-fixture'?'#fixture-feedback':'#management-feedback');
  const controls = [...main.querySelectorAll('button:not(:disabled), .match-management input, .match-management textarea')];
  controls.forEach(control => control.disabled = true);
  feedback.textContent = tr('Saving…','සුරකිමින්…');
  try {
   const data = await api(`/api/matches/${match.id}`, {
    method:'PATCH',
    body:JSON.stringify({action,...fields,revision:match.revision})
   });
   if (location.hash !== `#score/${match.id}`) return;
   scoringBase=data.match;
   drawScorer(data.match);
   document.querySelector('#management-feedback').textContent = action==='edit-fixture'
    ? tr('Fixture changes saved','තරග වෙනස්කම් සුරැකුණා')
    : tr('Saved','සුරැකුණා');
  } catch (error) {
   if (location.hash !== `#score/${match.id}`) return;
   if (error.data?.match) {
    scoringBase=error.data.match;
    drawScorer(error.data.match, error.message);
   } else {
    feedback.textContent = translateError(error.message);
    if (error.uncertain) feedback.textContent = tr('Could not confirm the save. Refresh the match before retrying.','සුරැකීම තහවුරු කළ නොහැක. නැවත උත්සාහ කිරීමට පෙර තරගය යාවත්කාලීන කරන්න.');
   }
  } finally {
   saving = false;
   controls.forEach(control => control.disabled = false);
  }
 }
 const fixture=document.querySelector('#edit-fixture');
 fixture?.addEventListener('submit', event=>{
  event.preventDefault();
  const values=new FormData(fixture);
  const players=side=>values.get('players'+side).split('\n').map(name=>name.trim()).filter(Boolean);
  update('edit-fixture',{fixture:{date:values.get('date'),venue:values.get('venue'),playersA:players('A'),playersB:players('B')}});
 });
 const assignment = document.querySelector('#scorer-assignment');
 assignment?.addEventListener('submit', event => {
  event.preventDefault();
  update('assign',{email:new FormData(assignment).get('email')});
 });
 document.querySelector('#remove-scorer')?.addEventListener('click', () => update('assign',{email:''}));
 document.querySelector('#toggle-public-score')?.addEventListener('click', () => update(match.publicScore ? 'disable-public' : 'enable-public'));
 document.querySelector('#toggle-listing')?.addEventListener('click', () => update(match.publishedAt ? 'unpublish' : 'publish'));
 document.querySelector('#approve-result')?.addEventListener('click', () => update('approve'));
 document.querySelector('#reopen-result')?.addEventListener('click', () => update('reopen'));
}

// Read-only live view. All requests use the existing owner-authorized API.
let watchTimer=null,watchAbort=null,watchEpoch=0,watchMatch=null,watchTab='scorecard',watchInnings=null,watchFailures=0,watchChecked=null,watchPaused=false;
function stopWatching(){watchEpoch++;clearTimeout(watchTimer);watchTimer=null;watchAbort?.abort();watchAbort=null;}
function watchStatus(message,kind=''){const el=document.querySelector('#watch-connection');if(el){el.textContent=message;el.className=`watch-connection ${kind}`;}}
const clockLabel=value=>new Date(value).toLocaleTimeString(language==='si'?'si-LK':'en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit',timeZone:'Asia/Colombo'});
function watchShell(){main.innerHTML=`<a class="back" href="#admin">← ${tr('My matches','මගේ තරග')}</a><div id="watch-title"></div><div class="workspace-toolbar"><span id="watch-connection" class="watch-connection">${tr('Connecting…','සම්බන්ධ වෙමින්…')}</span><button class="button" id="watch-refresh">↻ ${tr('Refresh now','දැන් යාවත්කාලීන කරන්න')}</button><button class="button" id="watch-pause">${tr('Pause updates','යාවත්කාලීන වීම නවත්වන්න')}</button><button class="button" id="watch-copy">${tr('Copy scorecard link','ලකුණු පත්‍රයේ සබැඳිය පිටපත් කරන්න')}</button><a class="button" id="watch-score">${tr('Open scorer','ලකුණු ඇතුළත් කරන්න')}</a></div><div id="watch-body"><div class="empty">${tr('Loading scorecard…','ලකුණු පත්‍රය ලබාගනිමින්…')}</div></div><p class="subtitle watch-privacy">${tr('Only the match admin and assigned scorer can open this scorecard. Updates pause while this tab is hidden.','මෙය බැලිය හැක්කේ තරග කළමනාකරුට සහ පවරා ඇති ලකුණු සටහන්කරුටයි. මෙම tab එක නොපෙනෙන විට යාවත්කාලීන වීම තාවකාලිකව නවතී.')}</p>`;}
function watchControls(id,epoch){document.querySelector('#watch-score').href=`#score/${encodeURIComponent(id)}`;document.querySelector('#watch-refresh').onclick=()=>{clearTimeout(watchTimer);if(!watchAbort)pollWatch(id,epoch)};
 document.querySelector('#watch-pause').onclick=()=>{watchPaused=!watchPaused;const b=document.querySelector('#watch-pause');b.textContent=watchPaused?tr('Resume updates','යාවත්කාලීන වීම අරඹන්න'):tr('Pause updates','යාවත්කාලීන වීම නවත්වන්න');if(watchPaused){clearTimeout(watchTimer);watchStatus(tr('Updates paused — showing last saved score','යාවත්කාලීන වීම නවතා ඇත — අවසන් ලකුණු පෙන්වයි'),'paused');}else if(!watchAbort)pollWatch(id,epoch);};
 document.querySelector('#watch-copy').onclick=async()=>{try{await navigator.clipboard.writeText(location.href);const b=document.querySelector('#watch-copy');b.textContent=tr('Link copied ✓','සබැඳිය පිටපත් කළා ✓');}catch{watchStatus(tr('Could not copy. Copy the URL from your address bar.','පිටපත් කළ නොහැකි විය. ලිපින තීරුවේ URL එක පිටපත් කරන්න.'),'paused');}};
}
async function startWatch(id){stopWatching();if(!/^[a-zA-Z0-9_-]{10,80}$/.test(id||'')){main.innerHTML=errorPanel({status:404,message:translateError('Match not found.')});return;}watchMatch=null;watchInnings=null;watchFailures=0;watchPaused=false;watchTab='scorecard';watchChecked=null;const epoch=watchEpoch;watchShell();watchControls(id,epoch);await pollWatch(id,epoch);}
async function pollWatch(id,epoch){if(epoch!==watchEpoch||watchAbort)return;if(document.hidden){watchStatus(tr('Updates paused while tab is hidden','Tab එක නොපෙනෙන නිසා යාවත්කාලීන වීම නවතා ඇත'),'paused');return;}
 const controller=new AbortController();watchAbort=controller;const timeout=setTimeout(()=>controller.abort(),12000);let terminal=false;
 try{const revision=watchMatch?.revision;const response=await fetch(`/api/matches/${encodeURIComponent(id)}/live${revision!==undefined?'?revision='+revision:''}`,{cache:'no-store',signal:controller.signal});const data=await response.json();if(epoch!==watchEpoch)return;
 if(!response.ok){if([401,403,404].includes(response.status)){terminal=true;document.querySelector('#watch-body').innerHTML=errorPanel({status:response.status,message:data.error});document.querySelector('#reload-workspace')?.addEventListener('click',render);watchStatus(tr('Live connection stopped','සජීවී සම්බන්ධතාව නවතා ඇත'),'offline');return;}throw new Error(data.error||'Connection failed');}
 watchFailures=0;watchChecked=data.checkedAt||new Date().toISOString();if(data.match){watchMatch=data.match;drawWatch();}
 watchStatus(watchPaused?tr('Updates paused','යාවත්කාලීන වීම නවතා ඇත'):`${tr('Connected · checked','සම්බන්ධයි · පරීක්ෂා කළේ')} ${clockLabel(watchChecked)} SLST${watchMatch?.state.status==='completed'?' · '+tr('Final result','අවසන් ප්‍රතිඵලය'):''}`);
 }catch(error){if(epoch!==watchEpoch)return;watchFailures++;watchStatus(tr('Connection interrupted — showing last saved score; retrying…','සම්බන්ධතාව බිඳ වැටුණා — අවසන් ලකුණු පෙන්වයි; නැවත උත්සාහ කරමින්…'),'offline');if(!watchMatch)document.querySelector('#watch-body').innerHTML=`<div class="empty"><h2>${tr('Waiting for a connection','සම්බන්ධතාව බලා සිටිමින්')}</h2><p>${tr('No score has been loaded yet. Reconnect or use Refresh now.','තවම ලකුණු ලබාගෙන නැත. සම්බන්ධතාව නැවත ලබාගන්න හෝ දැන් යාවත්කාලීන කරන්න ඔබන්න.')}</p></div>`;
 }finally{clearTimeout(timeout);if(watchAbort===controller)watchAbort=null;if(epoch===watchEpoch&&!terminal&&!watchPaused&&!document.hidden)watchTimer=setTimeout(()=>pollWatch(id,epoch),watchFailures?Math.min(30000,5000*2**watchFailures):5000);}
}
function drawWatch(){const m=watchMatch;if(!m)return;const {config:c,state:s}=m;const index=watchInnings===null?s.innings.length-1:Math.min(watchInnings,s.innings.length-1);const inn=s.innings[index],analysis=m.analysis[index];const latest=s.innings.at(-1);document.querySelector('#watch-title').innerHTML=workspaceHeading(tr('Live scorecard','සජීවී ලකුණු පත්‍රය'),`${safe(c.teamA)} vs ${safe(c.teamB)} · ${safe(c.competition)}`);
 const target=matchTarget(m);const remaining=latest&&c.overs!==null?Math.max(0,c.overs*6-latest.balls):0;
 const body=`<section class="live-board panel watch-board"><div class="statusline"><span class="pill ${s.status==='live'?'live':''}">${stateName(s.status)}</span><span>${safe(c.venue)} · ${safe(c.date)}</span></div>${s.innings.length?s.innings.map(i=>`<div class="saved-score"><span>${safe(nameOf(c,i.team))}</span><strong>${i.total}/${i.wickets}<small> ${tr('Overs','ඕවර')} ${overString(i.balls)}${inningsLimit(c)}</small></strong></div>`).join(''):`<h2>${safe(c.teamA)} vs ${safe(c.teamB)}</h2><p>${tr('The scorecard will appear when the innings starts.','ඉනිම ඇරඹුණු පසු ලකුණු පත්‍රය පෙන්වයි.')}</p>`}${s.result?`<p class="watch-result">${safe(resultOf(m))}</p>`:target?`<p class="watch-result">${safe(nameOf(c,latest.team))} · ${tr('Need','අවශ්‍ය ලකුණු')} ${Math.max(0,target-latest.total)}${c.overs===null?'':` · ${remaining} ${tr('balls remaining','පන්දු ඉතිරියි')}`}</p>`:''}<p class="watch-save-time">${tr('Score last saved','ලකුණු අවසන් වරට සුරැකුණේ')} ${clockLabel(m.updatedAt)} SLST</p></section>
 ${inn?`<div class="summary-grid watch-metrics"><div class="metric"><strong>${analysis.runRate===null?'—':analysis.runRate.toFixed(2)}</strong><span>${tr('Current run rate','වත්මන් ලකුණු වේගය')}</span></div><div class="metric"><strong>${analysis.partnership.runs} <small>(${analysis.partnership.balls})</small></strong><span>${tr('Current partnership · runs (balls)','වත්මන් සබඳතාව · ලකුණු (පන්දු)')}</span></div><div class="metric"><strong>${index===1&&remaining&&!latest.closed?((target-latest.total)*6/remaining).toFixed(2):'—'}</strong><span>${tr('Required run rate','අවශ්‍ය ලකුණු වේගය')}</span></div></div><div class="watch-navigation"><div class="tabs">${s.innings.map((i,j)=>`<button data-watch-innings="${j}" class="${watchInnings===j?'selected':''}" aria-pressed="${watchInnings===j}">${safe(nameOf(c,i.team))} · ${j+1}</button>`).join('')}<button data-watch-innings="latest" class="${watchInnings===null?'selected':''}" aria-pressed="${watchInnings===null}">${tr('Follow latest innings','නවතම ඉනිම බලන්න')}</button></div><div class="tabs" aria-label="${tr('Scorecard view','ලකුණු පත්‍රයේ කොටස')}">${[['scorecard','Scorecard','ලකුණු පත්‍රය'],['commentary','Ball by ball','පන්දුවෙන් පන්දුව'],['overs','Over summary','ඕවර සාරාංශය']].map(([v,en,si])=>`<button data-watch-tab="${v}" class="${watchTab===v?'selected':''}" aria-pressed="${watchTab===v}">${tr(en,si)}</button>`).join('')}</div></div><div id="watch-content">${watchTab==='scorecard'?`${inningsTable(inn)}<section class="panel watch-section"><h2>${tr('Fall of wickets','කඩුලු වැටීම')}</h2>${analysis.fallOfWickets.length?table(analysis.fallOfWickets.map(w=>[w.wicket,safe(w.player),`${w.total}/${w.wicket}`,w.over]),[tr('WICKET','කඩුල්ල'),tr('BATTER','පිතිකරු'),tr('SCORE','ලකුණු'),tr('OVERS','ඕවර')]):`<p class="muted">${tr('No wickets have fallen.','තවම කඩුලු වැටී නැත.')}</p>`}</section>`:watchTab==='commentary'?watchCommentary(inn):watchOvers(analysis)}</div>`:''}`;
 const focused=document.activeElement;
 const focusedTab=focused?.dataset.watchTab;
 const focusedInnings=focused?.dataset.watchInnings;
 document.querySelector('#watch-body').innerHTML=body;
 document.querySelectorAll('[data-watch-tab]').forEach(b=>b.onclick=()=>{watchTab=b.dataset.watchTab;drawWatch()});document.querySelectorAll('[data-watch-innings]').forEach(b=>b.onclick=()=>{watchInnings=b.dataset.watchInnings==='latest'?null:Number(b.dataset.watchInnings);drawWatch()});
 const controls=document.querySelectorAll('[data-watch-tab],[data-watch-innings]');
 for(const control of controls){
  if((focusedTab && control.dataset.watchTab===focusedTab)||(focusedInnings && control.dataset.watchInnings===focusedInnings)){
   control.focus({preventScroll:true});
   break;
  }
 }
}
function deliveryDescription(d,inn){const batter=inn.batting[d.striker]?.name||'—',bowler=inn.bowling[d.bowler]?.name||'—';const extras={'none':'','wide':tr('wide','වයිඩ්'),'no-ball':tr('no-ball','නිපන්දුව'),'bye':tr('byes','බයි'),'leg-bye':tr('leg byes','ලෙග් බයි'),'nb-bye':tr('no-ball + byes','නිපන්දුව සහ බයි'),'nb-leg-bye':tr('no-ball + leg byes','නිපන්දුව සහ ලෙග් බයි')};const dismissal={'bowled':tr('bowled','පන්දුව කඩුල්ලේ වැදී'),'caught':tr('caught','උඩපන්දුවක් දී'),'lbw':tr('lbw','කඩුල්ල මුවා කර'),'stumped':tr('stumped','ස්ටම්ප් කිරීමෙන්'),'hit-wicket':tr('hit wicket','කඩුල්ල බිඳී'),'run-out':tr('run out','දුවද්දී')};return {title:d.wicket?`${tr('WICKET','කඩුල්ල')} · ${inn.batting[d.out]?.name||batter} · ${dismissal[d.wicket]}`:d.boundary?`${d.runs===6?tr('SIX','හයේ පහර'):tr('FOUR','හතරේ පහර')}${extras[d.extra]?' · '+extras[d.extra]:''}`:d.total?`${d.total} ${tr('runs','ලකුණු')}${extras[d.extra]?' · '+extras[d.extra]:''}`:tr('Dot ball','නිලකුණු පන්දුව'),detail:`${bowler} → ${batter}`,total:d.total};}
function watchCommentary(inn){if(!inn.deliveries.length)return `<div class="empty">${tr('Waiting for the first delivery.','පළමු පන්දුව බලා සිටිමින්.')}</div>`;let total=0,wickets=0;const rows=inn.deliveries.map(d=>{total+=d.total;if(d.wicket)wickets++;return {d,total,wickets}});return `<section class="panel"><h2>${tr('Latest delivery first','නවතම පන්දුව මුලින්')}</h2><p class="subtitle">${tr('Generated from saved scoring entries, including corrections.','නිවැරදි කිරීම් ඇතුළුව සුරැකි ලකුණු සටහන් අනුව පෙන්වයි.')}</p>${rows.slice(-100).reverse().map(({d,total,wickets})=>{const text=deliveryDescription(d,inn);return `<article class="comment"><b>${safe(d.label)}</b><div><h3>${safe(text.title)}</h3><p>${safe(text.detail)}</p><small class="muted">${tr('Score','ලකුණු')} ${total}/${wickets}${d.wicket&&d.total?' · +'+d.total:''}</small></div></article>`}).join('')}<p class="subtitle">${tr('Showing the latest 100 deliveries at most.','නවතම පන්දු සටහන් 100 දක්වා පෙන්වයි.')}</p></section>`}
function watchOvers(analysis){if(!analysis.overs.length)return `<div class="empty">${tr('No overs recorded yet.','තවම ඕවර සටහන් කර නැත.')}</div>`;const max=Math.max(1,...analysis.overs.map(o=>o.runs));return `<section class="panel"><h2>${tr('Runs per over','ඕවරයක ලකුණු')}</h2><div class="over-chart">${analysis.overs.map(o=>`<div class="over-row"><span>${tr('Over','ඕවරය')} ${o.number}</span><div class="over-track"><div class="over-fill" style="width:${o.runs/max*100}%"></div></div><strong>${o.runs}</strong><small>${o.wickets?'W '+o.wickets:''}${o.balls<6?' · '+tr('partial over','අසම්පූර්ණ ඕවරය'):''}</small></div>`).join('')}</div>${table(analysis.overs.map(o=>[o.number,o.runs,o.wickets,`${o.balls}/6`,o.deliveries.map(d=>d.wicket?'W':d.extra==='none'?String(d.runs):`${d.runs}${d.extra==='wide'?'wd':d.extra.includes('nb')||d.extra==='no-ball'?'nb':d.extra==='bye'?'b':'lb'}`).join(' · ')]),[tr('OVER','ඕවරය'),tr('RUNS','ලකුණු'),tr('WICKETS','කඩුලු'),tr('LEGAL BALLS','නිවැරදි පන්දු'),tr('DELIVERIES','පන්දු සටහන්')])}</section>`}
document.addEventListener('visibilitychange',()=>{if(!location.hash.startsWith('#watch/'))return;clearTimeout(watchTimer);if(document.hidden){watchStatus(tr('Updates paused while tab is hidden','Tab එක නොපෙනෙන නිසා යාවත්කාලීන වීම නවතා ඇත'),'paused');}else if(!watchPaused&&!watchAbort)pollWatch(location.hash.split('/')[1],watchEpoch);});

let centreFilter = 'all';
let centreSearch = '';
let centreMatches = [];
let activeCompetition = null;
const centreTitle = () => tr('Match Centre', 'තරග මධ්‍යස්ථානය');
const fanStatus = status => status === 'review'
 ? tr('Result pending approval', 'ප්‍රතිඵලය අනුමැතිය බලාපොරොත්තුවෙන්')
 : stateName(status);

function updateCentreList() {
 const list = document.querySelector('#centre-list');
 const matches = centreMatches.filter(match => {
  const {teamA,teamB,competition,venue} = match.config;
  return (centreFilter === 'all' || (centreFilter === 'live' && match.state.status === 'interval') || centreFilter === match.state.status)
   && [teamA,teamB,competition,venue].join(' ').toLowerCase().includes(centreSearch.trim().toLowerCase());
 });
 list.innerHTML = matches.length ? matches.map(match => {
  const {teamA,teamB,date,competition} = match.config;
  return `<a class="match-card" href="#spectate/${encodeURIComponent(match.id)}">
   <div class="card-body"><div class="statusline"><span class="pill ${match.state.status==='live'?'live':''}">${fanStatus(match.state.status)}</span><small>${safe(date)}</small></div>
   <h3>${safe(teamA)} vs ${safe(teamB)}</h3><p class="subtitle">${safe(competition)}</p>
   ${match.state.innings.map(inn => `<div class="saved-score"><span>${safe(nameOf(match.config,inn.team))}</span><strong>${inn.total}/${inn.wickets} <small>(${overString(inn.balls)})</small></strong></div>`).join('')}
   ${match.state.result ? `<p class="result">${safe(resultOf(match))}</p>` : ''}</div>
   <div class="card-footer">${tr('View team scorecard ↗','කණ්ඩායම් ලකුණු පත්‍රය බලන්න ↗')}</div></a>`;
 }).join('') : `<div class="empty"><h2>${centreMatches.length ? tr('No matches found','තරග හමු නොවීය') : tr('No matches listed yet','තවම තරග පළ කර නැහැ')}</h2></div>`;
}

async function openCentre(epoch, competition = null) {
 if(activeCompetition!==competition) {
  centreFilter = 'all';
  centreSearch = '';
  activeCompetition = competition;
 }
 main.innerHTML = heading(tr('School cricket','පාසල් ක්‍රිකට්'), centreTitle(), tr('Follow fixtures, live team scores and approved results.','ඉදිරි තරග, සජීවී කණ්ඩායම් ලකුණු සහ අනුමත ප්‍රතිඵල බලන්න.'));
 if(competition!==null)main.insertAdjacentHTML('afterbegin',`<a class="back" href="#competitions">← ${competitionsTitle()}</a> <a class="button" href="#points/${encodeURIComponent(competition)}">${tr('Points table ↗','ප්‍රසාද ලකුණු වගුව ↗')}</a>`);
 const content = document.createElement('div');
 main.append(content);
 content.textContent = tr('Loading matches…','තරග ලබාගනිමින්…');
 try {
  const data = await api('/api/match-centre' + (competition===null?'':'?competition='+encodeURIComponent(competition)));
  if (epoch !== watchEpoch) return;
  centreMatches = data.matches;
  if(competition!==null)main.querySelector('h1').textContent = centreMatches[0]?.config.competition || competition;
  content.innerHTML = `<div class="filters">
   <input id="centre-search" type="search" aria-label="${tr('Search listed matches','පළ කළ තරග සොයන්න')}" placeholder="${tr('Search teams or ground…','කණ්ඩායම් හෝ ක්‍රීඩාංගණය සොයන්න…')}" value="${safe(centreSearch)}">
   <select id="centre-filter" aria-label="${tr('Match status','තරග තත්ත්වය')}">
   ${[['all','All matches','සියලු තරග'],['live','Live','සජීවී'],['scheduled','Upcoming','ඉදිරි තරග'],['review','Awaiting approval','අනුමැතිය බලාපොරොත්තුවෙන්'],['completed','Results','ප්‍රතිඵල']].map(([id,en,si])=>`<option value="${id}" ${centreFilter===id?'selected':''}>${tr(en,si)}</option>`).join('')}
   </select><button class="button" id="centre-refresh">${tr('Refresh','යාවත්කාලීන කරන්න')}</button>
  </div><div class="cards" id="centre-list"></div>`;
  document.querySelector('#centre-search').oninput=e=>{centreSearch=e.target.value;updateCentreList()};
  document.querySelector('#centre-filter').onchange=e=>{centreFilter=e.target.value;updateCentreList()};
  document.querySelector('#centre-refresh').onclick=render;
  updateCentreList();
 } catch {
  if (epoch !== watchEpoch) return;
  content.innerHTML = `<p class="info">${tr('Could not load the matches.','තරග ලබාගැනීමට නොහැකි විය.')}</p><button class="button" id="centre-retry">${tr('Try again','නැවත උත්සාහ කරන්න')}</button>`;
  document.querySelector('#centre-retry').onclick=render;
 }
}

function fanScorecard(match) {
 const {config,state,overs,updatedAt}=match;
 const headingLine = `${safe(config.teamA)} vs ${safe(config.teamB)}`;
 const sections = state.innings.map((inn,i)=>{
  const rows = overs[i];
  return `<section class="panel watch-section"><h2>${safe(nameOf(config,inn.team))} · ${tr('Over summary','ඕවර සාරාංශය')}</h2>
   ${rows.length ? table(rows.map(o=>[o.number,o.runs,o.wickets,`${o.balls}/6`,o.deliveries.map(delivery=>{
    if (delivery.wicket) return delivery.runs ? `W+${delivery.runs}` : 'W';
    const extra = {'wide':'wd','no-ball':'nb','bye':'b','leg-bye':'lb','nb-bye':'nb+b','nb-leg-bye':'nb+lb'}[delivery.extra] || '';
    return `${delivery.runs}${extra}`;
   }).join(' · ')]),[tr('OVER','ඕවරය'),tr('RUNS','ලකුණු'),tr('WICKETS','කඩුලු'),tr('LEGAL BALLS','නිවැරදි පන්දු'),tr('DELIVERIES','පන්දු සටහන්')])
   : `<p class="subtitle">${tr('Waiting for the first delivery.','පළමු පන්දුව බලා සිටිමින්.')}</p>`}</section>`;
 }).join('');
 return heading(centreTitle(),headingLine,`${safe(config.competition)} · ${safe(config.venue)} · ${safe(config.date)}`)
  + `<section class="panel live-board watch-board"><span class="pill ${state.status==='live'?'live':''}">${fanStatus(state.status)}</span>
  ${state.innings.map(inn=>`<div class="saved-score"><span>${safe(nameOf(config,inn.team))}</span><strong>${inn.total}/${inn.wickets}<small> ${tr('Overs','ඕවර')} ${overString(inn.balls)}${inningsLimit(config)}</small></strong></div>`).join('')}
  ${state.result ? `<p class="watch-result">${safe(resultOf(match))}</p>` : ''}
  <p class="watch-save-time">${tr('Last updated','අවසන් වරට යාවත්කාලීන කළේ')} ${clockLabel(updatedAt)} SLST</p></section>` + sections;
}

function openFanScore(id,epoch) {
 if (!/^[a-zA-Z0-9_-]{10,80}$/.test(id||'')) {
  main.innerHTML=`<a class="back" href="#centre">← ${centreTitle()}</a><div class="empty">${tr('Match not found.','තරගය හමු නොවීය.')}</div>`;
  return;
 }
 main.innerHTML=`<a class="back" href="#centre">← ${centreTitle()}</a><p class="subtitle" id="fan-status" role="status">${tr('Loading scorecard…','ලකුණු පත්‍රය ලබාගනිමින්…')}</p><div id="fan-score"></div>`;
 let revision;
 async function refresh(){
  if(epoch!==watchEpoch)return;
  if(document.hidden){watchTimer=setTimeout(refresh,5000);return;}
  const abort=new AbortController();
  watchAbort=abort;
  const timeout=setTimeout(()=>abort.abort(),12000);
  let removed=false, delay=5000;
  try{
   const suffix=revision===undefined?'':'?revision='+revision;
   const response=await fetch('/api/match-centre/'+encodeURIComponent(id)+suffix,{cache:'no-store',signal:abort.signal});
   if(epoch!==watchEpoch)return;
   if(response.status===404){
    removed=true;
    document.querySelector('#fan-score').replaceChildren();
    document.querySelector('#fan-status').textContent=tr('This match is no longer listed.','මෙම තරගය දැන් ලැයිස්තුවේ නැත.');
    return;
   }
   if(!response.ok)throw new Error('Scorecard unavailable');
   const data=await response.json();
   if(epoch!==watchEpoch)return;
   if(data.match){
    revision=data.match.revision;
    document.querySelector('#fan-score').innerHTML=fanScorecard(data.match);
   }
   const status=document.querySelector('#fan-status');
   const message=tr('Scores refresh automatically.','ලකුණු ස්වයංක්‍රීයව යාවත්කාලීන වේ.');
   if(status.textContent!==message)status.textContent=message;
  }catch{
   if(epoch!==watchEpoch)return;
   delay=15000;
   document.querySelector('#fan-status').textContent=tr('Connection interrupted. Retrying…','සම්බන්ධතාව බිඳ වැටුණා. නැවත උත්සාහ කරමින්…');
  }finally{
   clearTimeout(timeout);
   if(watchAbort===abort)watchAbort=null;
   if(epoch===watchEpoch&&!removed)watchTimer=setTimeout(refresh,delay);
  }
 }
 refresh();
}

let competitionSearch = '';
const competitionsTitle = () => tr('Tournaments','තරගාවලි');

function competitionFixtureLink(key) {
 return '#competition/' + encodeURIComponent(key);
}

async function openCompetitions(epoch) {
 main.innerHTML = heading(tr('School cricket','පාසල් ක්‍රිකට්'), competitionsTitle(),
  tr('Browse fixtures and results by tournament.','තරගාවලිය අනුව ඉදිරි තරග සහ ප්‍රතිඵල බලන්න.'));
 const content = document.createElement('div');
 main.append(content);
 content.textContent = tr('Loading tournaments…','තරගාවලි ලබාගනිමින්…');
 try {
  const {competitions} = await api('/api/competitions');
  if(epoch!==watchEpoch)return;
  if(!competitions.length){
   content.innerHTML = `<div class="empty"><h2>${tr('No tournaments listed yet','තවම තරගාවලි පළ කර නැහැ')}</h2>
   <p>${tr('Tournaments appear here when their matches are listed in Match Centre.','තරග මධ්‍යස්ථානයේ තරගයක් පළ කළ විට එහි තරගාවලිය මෙතැන පෙන්වයි.')}</p></div>`;
   return;
  }
  content.innerHTML = `<div class="filters">
   <input type="search" id="competition-search" aria-label="${tr('Search tournaments','තරගාවලි සොයන්න')}" placeholder="${tr('Search tournaments…','තරගාවලි සොයන්න…')}" value="${safe(competitionSearch)}">
   <button class="button" id="competition-refresh">${tr('Refresh','යාවත්කාලීන කරන්න')}</button>
   </div><p class="subtitle" id="competition-count" role="status"></p><div class="cards" id="competition-cards"></div>`;
  const renderCards = () => {
   const found = competitions.filter(item=>item.name.toLowerCase().includes(competitionSearch.trim().toLowerCase()));
   document.querySelector('#competition-count').textContent = `${found.length} ${tr('tournaments','තරගාවලි')}`;
   document.querySelector('#competition-cards').innerHTML = found.length ? found.map(item=>`<a class="match-card" href="${competitionFixtureLink(item.key)}">
    <div class="card-body"><h3>${safe(item.name)}</h3><p class="subtitle">${item.matches} ${tr('listed matches','පළ කළ තරග')}</p></div>
    <div class="card-footer">${tr('View fixtures and results ↗','තරග සහ ප්‍රතිඵල බලන්න ↗')}</div></a>`).join('')
    : `<div class="empty"><h2>${tr('No tournaments found','තරගාවලි හමු නොවීය')}</h2></div>`;
  };
  document.querySelector('#competition-search').oninput = event => {competitionSearch = event.target.value; renderCards();};
  document.querySelector('#competition-refresh').onclick = render;
  renderCards();
 } catch {
  if(epoch!==watchEpoch)return;
  content.innerHTML = `<p class="info">${tr('Could not load tournaments.','තරගාවලි ලබාගැනීමට නොහැකි විය.')}</p>
   <button class="button" id="competition-retry">${tr('Try again','නැවත උත්සාහ කරන්න')}</button>`;
  document.querySelector('#competition-retry').onclick = render;
 }
}

function openCompetition(encoded,epoch) {
 let key;
 try { key=decodeURIComponent(encoded||''); } catch { key=''; }
 if(!key.trim()||key.length>100){
  main.innerHTML=`<a class="back" href="#competitions">← ${competitionsTitle()}</a><div class="empty">${tr('Tournament not found.','තරගාවලිය හමු නොවීය.')}</div>`;
  return;
 }
 openCentre(epoch,key);
}

const standingsTitle = () => tr('Points tables','ප්‍රසාද ලකුණු');
const pointsFields = [
 ['wins','Win','ජය'],
 ['ties','Tie','සම ප්‍රතිඵලය'],
 ['losses','Loss','පරාජය'],
 ['draws','Draw','ජය පරාජයෙන් තොර'],
];

function renderTeamStandings(teams,rules) {
 const sorted = rules ? teams.map(team=>({
  ...team,points:pointsFields.reduce((total,[field])=>total+team[field]*rules[field],0),
 })).sort((a,b)=>b.points-a.points||(rules.tieBreak==='wins'?b.wins-a.wins:0)||a.team.localeCompare(b.team)) : teams;
 let rank = 0;
 const rows = sorted.map((team,index)=>{
  if(rules && (index===0||team.points!==sorted[index-1].points||(rules.tieBreak==='wins'&&team.wins!==sorted[index-1].wins)))rank=index+1;
  return [rules?rank:'—', safe(team.team),team.played,team.wins,team.ties,team.draws,team.losses,rules?team.points:'—'];
 });
 document.querySelector('#standings-table').innerHTML = teams.length
  ? table(rows,[tr('RANK','ස්ථානය'),tr('TEAM','කණ්ඩායම'),tr('PLAYED','තරග'),tr('WON','ජය'),tr('TIED','සම'),tr('DRAWN','ජය පරාජයෙන් තොර'),tr('LOST','පරාජය'),tr('POINTS','ලකුණු')])
  : `<div class="empty"><h2>${tr('No approved results yet','තවම අනුමත ප්‍රතිඵල නැහැ')}</h2></div>`;
}

async function openStandings(encoded,epoch) {
 let selected = '';
 try { selected=decodeURIComponent(encoded||''); } catch {}
 main.innerHTML = heading(tr('School cricket','පාසල් ක්‍රිකට්'),standingsTitle(),
  tr('Team records from results that are approved and listed in Match Centre.','අනුමත කර තරග මධ්‍යස්ථානයේ පළ කළ ප්‍රතිඵල අනුව කණ්ඩායම් වාර්තා.'));
 const content = document.createElement('div');
 content.textContent=tr('Loading standings…','ලකුණු වගුව ලබාගනිමින්…');
 main.append(content);
 try {
  const {competitions} = await api('/api/competitions');
  if(epoch!==watchEpoch)return;
  const competition = competitions.find(item=>item.key===selected);
  content.innerHTML = `<div class="filters"><label for="standings-tournament">${tr('Tournament','තරගාවලිය')}</label>
   <select id="standings-tournament"><option value="">${tr('Select tournament','තරගාවලිය තෝරන්න')}</option>
   ${competitions.map(item=>`<option value="${safe(item.key)}" ${item===competition?'selected':''}>${safe(item.name)}</option>`).join('')}</select>
   ${competition?`<a class="button" href="${competitionFixtureLink(competition.key)}">${tr('Fixtures and results ↗','තරග සහ ප්‍රතිඵල ↗')}</a><button class="button" id="standings-refresh">${tr('Refresh','යාවත්කාලීන කරන්න')}</button>`:''}</div>
   <div id="standings-content"></div>`;
  document.querySelector('#standings-tournament').onchange=e=>{
   location.hash=e.target.value?'points/'+encodeURIComponent(e.target.value):'points';
  };
  const panel=document.querySelector('#standings-content');
  if(!competition){
   panel.innerHTML=`<div class="empty"><h2>${competitions.length?tr('Choose a tournament','තරගාවලියක් තෝරන්න'):tr('No tournaments listed yet','තවම තරගාවලි පළ කර නැහැ')}</h2></div>`;
   return;
  }
  document.querySelector('#standings-refresh').onclick=render;
  panel.textContent=tr('Loading results…','ප්‍රතිඵල ලබාගනිමින්…');
  const {teams,matches,rules,rulesRevision,canEditRules}=await api('/api/standings?competition='+encodeURIComponent(competition.key));
  if(epoch!==watchEpoch)return;
  panel.innerHTML=`<section class="panel"><h2>${safe(competition.name)}</h2>
   <p class="subtitle">${matches} ${tr('approved results','අනුමත ප්‍රතිඵල')}</p>
   ${rules?`<p>${pointsFields.map(([field,en,si])=>tr(en,si)+' '+rules[field]).join(' · ')} · ${rules.tieBreak==='wins'?tr('Equal points: most wins first','සමාන ලකුණු: වැඩිම ජය පළමුව'):tr('Equal points: shared rank','සමාන ලකුණු: එකම ස්ථානය')}</p>`
   :`<p>${tr('The tournament administrator has yet to set points.','තරගාවලියේ ප්‍රසාද ලකුණු තවම සකස් කර නැහැ.')}</p>`}
   ${canEditRules?`<form id="points-rules"><div class="filters">
   ${pointsFields.map(([field,en,si])=>`<label>${tr(en,si)}<input name="${field}" type="number" min="-100" max="100" step="1" required value="${rules?.[field]??''}"></label>`).join('')}
   <label>${tr('When points are equal','ලකුණු සමාන විට')}<select name="tieBreak">
    <option value="shared">${tr('Share rank','එකම ස්ථානය')}</option>
    <option value="wins" ${rules?.tieBreak==='wins'?'selected':''}>${tr('Most wins first','වැඩිම ජය පළමුව')}</option>
   </select></label>
   <button class="button primary">${tr('Save tournament rules','තරගාවලි නීති සුරකින්න')}</button></div>
   <p id="rules-feedback" class="subtitle" role="status"></p></form>`:''}
   <div id="standings-table"></div></section>`;
  const form=document.querySelector('#points-rules');
  if(form)form.onsubmit=async e=>{
   e.preventDefault();
   const fields=new FormData(form), button=form.querySelector('button');
   const newRules=Object.fromEntries(pointsFields.map(([field])=>[field,Number(fields.get(field))]));
   newRules.tieBreak=fields.get('tieBreak');
   button.disabled=true;
   try{
    await api('/api/standings',{method:'POST',body:JSON.stringify({competition:competition.key,rules:newRules,revision:rulesRevision})});
    if(epoch===watchEpoch)render();
   }catch(error){
    form.querySelector('#rules-feedback').textContent=translateError(error.message);
   }finally{button.disabled=false;}
  };
  renderTeamStandings(teams,rules);
 }catch{
  if(epoch!==watchEpoch)return;
  content.innerHTML=`<div class="empty"><p>${tr('Could not load the points table.','ප්‍රසාද ලකුණු වගුව ලබාගැනීමට නොහැකි විය.')}</p><button class="button" id="standings-retry">${tr('Try again','නැවත උත්සාහ කරන්න')}</button></div>`;
  document.querySelector('#standings-retry').onclick=render;
 }
}

const dictionary={
'Match Centre':'තරග මධ්‍යස්ථානය',
'The penalty reaches the target. Record only the wide or no-ball penalty.':'දඬුවම් ලකුණෙන් ඉලක්කය සම්පූර්ණයි. වයිඩ් හෝ නිපන්දු දඬුවම් ලකුණ පමණක් සටහන් කරන්න.',
'The winning run ends the match. Record only the runs needed, unless a boundary was scored.':'ජයග්‍රාහී ලකුණෙන් තරගය අවසන් වේ. සීමා පහරක් හැර අවශ්‍ය ලකුණු පමණක් සටහන් කරන්න.',
'The target was reached before this dismissal. Record the winning runs without a wicket.':'දැවීයාමට පෙර ඉලක්කය සම්පූර්ණයි. කඩුල්ලක් නොමැතිව ජයග්‍රාහී ලකුණු සටහන් කරන්න.',
'Overview':'සාරාංශය','Matches':'තරග','Tournaments':'තරගාවලි','Points tables':'ප්‍රසාද ලකුණු','Player statistics':'ක්‍රීඩක සංඛ්‍යාලේඛන','Resources':'සම්පත්','My matches':'මගේ තරග','SCHOOL CRICKET · SRI LANKA':'පාසල් ක්‍රිකට් · ශ්‍රී ලංකාව','EXPLORE THE GAME':'ක්‍රීඩාව ගවේෂණය කරන්න','Sri Lanka':'ශ්‍රී ලංකාව','School cricket':'පාසල් ක්‍රිකට්','PUBLIC PREVIEW · DEMO DATA':'පොදු ආකෘතිය · ආදර්ශ දත්ත','Independent redesign concept':'ස්වාධීන නව සැලසුම් ආකෘතිය','Behind every great player,':'සෑම දක්ෂ ක්‍රීඩකයෙකු පිටුපසම,','there’s a school ground.':'පාසල් ක්‍රීඩාංගණයක් තිබේ.','Follow the next generation.':'ඊළඟ පරපුර සමඟ රැඳෙන්න.','Scorer portal ↗':'ලකුණු ඇතුළත් කිරීමේ පද්ධතිය ↗','Every school. Every innings.':'සෑම පාසලක්ම. සෑම ඉනිමක්ම.','The game starts here.':'ක්‍රීඩාව මෙතැනින් ඇරඹේ.','Your front-row seat to Sri Lankan school cricket.':'ශ්‍රී ලංකාවේ පාසල් ක්‍රිකට් තොරතුරු ඔබ වෙත.','◷   Season 2026 / 27':'◷   තරග වාරය 2026 / 27','THE 2026 / 27 SCHOOL CRICKET SEASON':'2026 / 27 පාසල් ක්‍රිකට් තරග වාරය','Small grounds.':'කුඩා ක්‍රීඩාංගණ.','Extraordinary beginnings.':'අසමසම ආරම්භයන්.','Follow the rivalries, the rising stars, and every moment that makes school cricket special.':'පාසල් ක්‍රිකට් විශේෂ කරන තරගකාරීත්වය, නව තරු සහ සෑම මොහොතක්ම සමඟ රැඳෙන්න.','Explore the matches   ↗':'තරග බලන්න   ↗','Around the grounds':'ක්‍රීඩාංගණ වටා','2 live demos':'සජීවී ආදර්ශ 2','All matches ↗':'සියලු තරග ↗','LIVE · DEMO':'සජීවී · ආදර්ශ','UPCOMING':'ඉදිරි තරග','RESULT':'ප්‍රතිඵලය','Innings 2':'දෙවන ඉනිම','Day 1 · Tea':'පළමු දිනය · තේ විවේකය','Completed':'අවසන්','Yet to bat':'තවම පන්දුවට පහර දී නැත','Royal need 29 runs from 70 balls':'Royal සඳහා පන්දු 70 කින් ලකුණු 29 ක් අවශ්‍යයි','Trinity College elected to bat':'Trinity College පළමුව පන්දුවට පහර දීමට තීරණය කළා','Ananda College won by 3 wickets':'Ananda College කඩුලු 3 කින් ජයගත්තා','Isipathana College won by 5 wickets':'Isipathana College කඩුලු 5 කින් ජයගත්තා','View match ↗':'තරගය බලන්න ↗','In the tournament':'තරගාවලි තොරතුරු','Explore all ↗':'සියල්ල බලන්න ↗','Leading the way':'ඉදිරියෙන් සිටින්නෝ','Full statistics ↗':'සියලු සංඛ්‍යාලේඛන ↗','MOST RUNS · SAMPLE PLAYERS':'වැඩිම ලකුණු · ආදර්ශ ක්‍රීඩකයින්','PLAYER':'ක්‍රීඩකයා','RUNS':'ලකුණු','SCHOOL':'පාසල','MATCHES':'තරග','WICKETS':'කඩුලු','Under 19 Division I · Illustrative statistics':'අවු. 19 න් පහළ පළමු කාණ්ඩය · ආදර්ශ සංඛ්‍යාලේඛන','Match centre':'තරග මධ්‍යස්ථානය','Follow every innings.':'සෑම ඉනිමක් සමඟම රැඳෙන්න.','Find a school, choose a competition, and get closer to the game.':'පාසලක් සොයා, තරගාවලියක් තෝරා, ක්‍රීඩාවට සමීප වන්න.','All matches':'සියලු තරග','Live · 2':'සජීවී · 2','Upcoming':'ඉදිරි තරග','Results':'ප්‍රතිඵල','All age groups':'සියලු වයස් කාණ්ඩ','Under 19':'අවු. 19 න් පහළ','Under 17':'අවු. 17 න් පහළ','Reset filters':'පෙරහන් ඉවත් කරන්න','Search a school or ground…':'පාසලක් හෝ ක්‍රීඩාංගණයක් සොයන්න…','Search school or ground':'පාසල හෝ ක්‍රීඩාංගණය සොයන්න','Age group':'වයස් කාණ්ඩය','No matches found':'තරග හමු නොවීය','Try another school name or reset your filters.':'වෙනත් පාසලක් සොයන්න හෝ පෙරහන් ඉවත් කරන්න.','The competitions':'තරගාවලි','Follow the season, from the opening ball to the final.':'පළමු පන්දුවේ සිට අවසන් තරගය දක්වා රැඳෙන්න.','Competition names and team counts in this preview are illustrative.':'මෙම ආකෘතියේ තරගාවලි නම් සහ කණ්ඩායම් ගණන් ආදර්ශ පමණයි.','Under 19 Division I':'අවු. 19 න් පහළ · පළමු කාණ්ඩය','Under 17 Division I':'අවු. 17 න් පහළ · පළමු කාණ්ඩය','Under 15 Division I':'අවු. 15 න් පහළ · පළමු කාණ්ඩය','← All tournaments':'← සියලු තරගාවලි','Tournament overview':'තරගාවලි සාරාංශය','Schools cricket championship':'පාසල් ක්‍රිකට් ශූරතාවලිය','The next generation takes the field':'නව පරපුර ක්‍රීඩාංගණයට','Where the journey begins':'ගමන ඇරඹෙන තැන','Schools · demo':'පාසල් · ආදර්ශ','Season':'තරග වාරය','Match format':'තරග ආකෘතිය','Points table':'ප්‍රසාද ලකුණු වගුව','Competition matches':'තරගාවලියේ තරග','No demonstration matches in this competition yet.':'මෙම තරගාවලියේ ආදර්ශ තරග තවම නැත.','The standings':'ප්‍රසාද ලකුණු තත්ත්වය','Standings coming soon':'ප්‍රසාද ලකුණු ඉදිරියේදී','No sample standings have been added for this competition.':'මෙම තරගාවලියට ආදර්ශ ප්‍රසාද ලකුණු එකතු කර නැත.','Demo scoring: win 4 points, draw 1 point. Official competition rules will be configured during backend development.':'ආදර්ශ නීති: ජයකට ලකුණු 4 යි, ජය පරාජයෙන් තොර තරගයකට 1 යි. නිල තරගාවලි නීති පසුව සකස් කෙරේ.','The next generation':'නව පරපුර','Top batters':'ප්‍රමුඛ පිතිකරුවන්','Top bowlers':'ප්‍රමුඛ පන්දු යවන්නන්','No sample statistics for this competition yet.':'මෙම තරගාවලියේ ආදර්ශ සංඛ්‍යාලේඛන තවම නැත.','Player names and statistics are fictional placeholders. Public player data will be integrated in a later stage.':'ක්‍රීඩක නම් සහ සංඛ්‍යාලේඛන ආදර්ශ පමණයි. සැබෑ දත්ත පසුව සම්බන්ධ කෙරේ.','← Player statistics':'← ක්‍රීඩක සංඛ්‍යාලේඛන','Player profile':'ක්‍රීඩක තොරතුරු','Runs':'ලකුණු','Wickets':'කඩුලු','Season overview':'තරග වාරයේ සාරාංශය','STATISTIC':'සංඛ්‍යාලේඛනය','VALUE':'අගය','Batting average':'පිතිකරණ සාමාන්‍යය','← Match centre':'← තරග මධ්‍යස්ථානය','LIVE MATCH PREVIEW':'සජීවී තරග ආකෘතිය','MATCH PREVIEW':'තරග ආකෘතිය','Match information':'තරග තොරතුරු','Teams and scorecard will appear when the match begins.':'තරගය ඇරඹුණු පසු කණ්ඩායම් සහ ලකුණු පත්‍රය පෙන්වයි.','Match summary':'තරග සාරාංශය','A detailed scorecard has not been added for this demo match. Open Royal College vs S. Thomas’ College to try the full scorecard and commentary preview.':'මෙම ආදර්ශ තරගයේ සවිස්තර ලකුණු පත්‍රයක් තවම නැත. සම්පූර්ණ ආදර්ශය සඳහා Royal College vs S. Thomas’ College විවෘත කරන්න.','Open sample scorecard ↗':'ආදර්ශ ලකුණු පත්‍රය බලන්න ↗','Scorecard':'ලකුණු පත්‍රය','Commentary':'පන්දුවෙන් පන්දුව','Match info':'තරග තොරතුරු','Royal College · 2nd innings':'Royal College · දෙවන ඉනිම','BATTER':'පිතිකරු','DISMISSAL':'දැවීයාම','BOWLER':'පන්දු යවන්නා','Ball by ball · sample commentary':'පන්දුවෙන් පන්දුව · ආදර්ශ විස්තර','FOUR':'හතරේ පහර','No run':'නිලකුණු','1 run':'ලකුණක්','Competition':'තරගාවලිය','Format':'ආකෘතිය','Venue':'ක්‍රීඩාංගණය','Toss':'කාසියේ වාසිය','Data source':'දත්ත මූලාශ්‍රය','MATCH':'තරගය','DETAIL':'විස්තරය','Illustrative demo; no live feed connected':'ආදර්ශ දත්ත; සජීවී දත්ත සම්බන්ධ කර නැත','Beyond the boundary':'සීමාවෙන් ඔබ්බට','Resources & scoring':'සම්පත් සහ ලකුණු ඇතුළත් කිරීම','Official services, all in one place.':'නිල සේවා එකම තැනකින්.','Competition downloads':'තරගාවලි ලේඛන','Find the current official documents on the original SLSCA website.':'වත්මන් නිල ලේඛන සඳහා මුල් SLSCA වෙබ් අඩවිය වෙත යන්න.','Open official downloads ↗':'නිල ලේඛන ලබාගන්න ↗','Become a scorer':'ලකුණු සටහන් කරන්නෙකු වන්න','Use the existing official registration service to apply. This preview does not collect personal information.':'අයදුම් කිරීමට නිල ලියාපදිංචි සේවාව භාවිත කරන්න. මෙම ආකෘතිය පෞද්ගලික තොරතුරු ලබාගන්නේ නැත.','Open scorer registration ↗':'ලකුණු සටහන්කරුවන්ගේ ලියාපදිංචිය ↗','Scorer portal':'ලකුණු ඇතුළත් කිරීමේ පද්ධතිය','Existing scorers can access the official scoring system.':'ලියාපදිංචි ලකුණු සටහන්කරුවන්ට නිල පද්ධතියට පිවිසිය හැකියි.','Go to scorer portal ↗':'නිල පද්ධතියට යන්න ↗','This is an independent UI concept, not an official SLSCA service. All displayed scores, fixtures, standings, and player records are demonstration data.':'මෙය ස්වාධීන UI ආකෘතියකි. නිල SLSCA සේවාවක් නොවේ. පොදු පිටුවල ලකුණු, තරග සහ ක්‍රීඩක තොරතුරු ආදර්ශ දත්තයි.','Original SLSCA website ↗':'මුල් SLSCA වෙබ් අඩවිය ↗','/ Made for the love of the game.':'/ ක්‍රීඩාවට ඇති ආදරය වෙනුවෙන්.','Page not found':'පිටුව හමු නොවීය','Back to overview':'සාරාංශයට ආපසු යන්න','Toggle dark theme':'අඳුරු වර්ණ සැකසුම මාරු කරන්න',
'Choose two different opening batters.':'වෙනස් ආරම්භක පිතිකරුවන් දෙදෙනෙකු තෝරන්න.','Teams must have different names.':'කණ්ඩායම් සඳහා වෙනස් නම් යොදන්න.','Both teams must have the same number of players.':'කණ්ඩායම් දෙකේ ක්‍රීඩක ගණන සමාන විය යුතුයි.','Each team needs 2–11 players.':'කණ්ඩායමකට ක්‍රීඩකයින් 2–11 ක් අවශ්‍යයි.','Player names must be unique within a team.':'කණ්ඩායමක ක්‍රීඩක නම් නැවත යෙදිය නොහැක.','Choose between 1 and 50 overs.':'ඕවර 1 සහ 50 අතර අගයක් තෝරන්න.','Choose a different bowler for the new over.':'නව ඕවරය සඳහා වෙනත් පන්දු යවන්නෙකු තෝරන්න.','Only run-out is supported on a no-ball or free hit.':'නිපන්දුවක හෝ free hit එකක run-out පමණක් මෙහි සටහන් කළ හැකියි.','Invalid dismissal on a wide.':'වයිඩ් පන්දුවක මෙම දැවීයාම වලංගු නැත.','Cannot record a boundary and wicket together.':'සීමා ලකුණු සහ කඩුල්ලක් එකවර සටහන් කළ නොහැක.','Use zero runs for this dismissal.':'මෙම දැවීයාම සඳහා ලකුණු 0 යොදන්න.','Nothing to undo.':'ආපසු ගැනීමට ක්‍රියාවක් නැත.','This match changed in another tab. Review the latest score before scoring again.':'මෙම තරගය වෙනත් tab එකකින් වෙනස් කර ඇත. නව ලකුණු පරීක්ෂා කර නැවත ඇතුළත් කරන්න.','Another scorer updated this match. Refresh before continuing.':'තරගය වෙනත් තැනකින් යාවත්කාලීන කර ඇත. ඉදිරියට යාමට පෙර Refresh කරන්න.','Sign in to manage your matches.':'ඔබගේ තරග කළමනාකරණයට පිවිසෙන්න.','Match not found.':'තරගය හමු නොවීය.','Boundary must be 4 or 6 runs.':'සීමා ලකුණු 4 හෝ 6 විය යුතුයි.','Extras boundaries are four runs.':'අතිරේක සීමා ලකුණු හතරකි.','Runs must be between 0 and 6.':'ලකුණු 0 සිට 6 අතර විය යුතුයි.','Select the next batter and bowler before scoring.':'ලකුණු ඇතුළත් කිරීමට පෙර ඊළඟ පිතිකරු සහ පන්දු යවන්නා තෝරන්න.'};
function translateError(s){return language==='si'?(dictionary[s]||s):s}
function translateText(s){if(dictionary[s])return dictionary[s];return s.replace(/Season 2026 \/ 27/g,'තරග වාරය 2026 / 27').replace(/^(\d+) matches · Demonstration data$/,(_,n)=>`${n} තරග · ආදර්ශ දත්ත`).replace(/^(\d+) schools\s*·\s*(.+)$/,(_,n,f)=>`පාසල් ${n} · ${f.replace('50 overs','ඕවර 50').replace('2 day & 50 overs','දෙදින සහ ඕවර 50').replace('Limited overs','සීමිත ඕවර')}`).replace(/^(\d+(?:\.\d+)?) overs$/,(_,n)=>`ඕවර ${n}`).replace(/Under 19 · Division I/g,'අවු. 19 න් පහළ · පළමු කාණ්ඩය').replace(/Under 17 · Division I/g,'අවු. 17 න් පහළ · පළමු කාණ්ඩය').replace(/50 overs/g,'ඕවර 50').replace(/2 day/g,'දෙදින').replace(/Demonstration standings/g,'ආදර්ශ ප්‍රසාද ලකුණු').replace(/Illustrative player records/g,'ආදර්ශ ක්‍රීඩක තොරතුරු').replace(/Fictional demo player/g,'ආදර්ශ ක්‍රීඩකයා');}
const originalTexts=new WeakMap(),originalAttributes=new WeakMap();
function localize(){document.documentElement.lang=language==='si'?'si':'en';const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);while(walker.nextNode()){const node=walker.currentNode;if(node.parentElement?.closest('script,style,textarea,#language,input'))continue;if(!originalTexts.has(node))originalTexts.set(node,node.nodeValue);const original=originalTexts.get(node);const clean=original.trim();node.nodeValue=language==='si'?original.replace(clean,translateText(clean)):original;}
 for(const el of document.querySelectorAll('[placeholder],[aria-label]')){if(el.id==='language')continue;if(!originalAttributes.has(el))originalAttributes.set(el,{placeholder:el.getAttribute('placeholder'),label:el.getAttribute('aria-label')});const o=originalAttributes.get(el);for(const [attr,key] of [['placeholder','placeholder'],['aria-label','label']])if(o[key])el.setAttribute(attr,language==='si'?translateText(o[key]):o[key]);}
 document.querySelector('#language').textContent=language==='si'?'English':'සිංහල';document.querySelector('#language').setAttribute('aria-label',language==='si'?'Switch to English':'සිංහල භාෂාවට මාරු කරන්න');}
const renderPublic=render;
render=function(){stopWatching();const seq=++renderSequence;const [route='home',id]=(location.hash.slice(1)||'home').split('/');const privatePage=['admin','new','score','watch','squads','leaderboards'].includes(route);document.querySelector('.demo').textContent=privatePage?tr('PRIVATE WORKSPACE · SAVED DATA','පෞද්ගලික පුවරුව · සුරැකි දත්ත'):'PUBLIC PREVIEW · DEMO DATA';originalTexts.delete(document.querySelector('.demo').firstChild);
 if(['centre','spectate','competitions','competition','points'].includes(route)){
  document.querySelector('.demo').textContent=tr('LISTED MATCHES','පළ කළ තරග');
  document.querySelectorAll('[data-nav]').forEach(a=>{const active=a.dataset.nav===(route==='points'?'points':['competitions','competition'].includes(route)?'competitions':'centre');a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
  if(route==='points')openStandings(id,watchEpoch);else if(route==='competitions')openCompetitions(watchEpoch);else if(route==='competition')openCompetition(id,watchEpoch);else if(route==='centre')openCentre(watchEpoch);else openFanScore(id,watchEpoch);
 }else if(privatePage){document.querySelectorAll('[data-nav]').forEach(a=>{const active=a.dataset.nav==='admin';a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});main.innerHTML=`<div class="empty" role="status">${tr('Loading your saved matches…','ඔබගේ සුරැකි තරග ලබාගනිමින්…')}</div>`;if(route==='admin')adminPage(seq);else if(route==='new')newPage();else if(route==='squads')openSquads(watchEpoch,id);else if(route==='leaderboards')openPlayerStats(watchEpoch);else if(route==='watch')startWatch(id);else scorerPage(id,seq);}else renderPublic();localize();};
const updateMatchesPublic=updateMatches;updateMatches=function(){updateMatchesPublic();localize()};
document.querySelector('#language').onclick=()=>{if(saving)return;const form=document.querySelector('#new-match,#delivery-form');if(form){const saved=new FormData(form);language=language==='si'?'en':'si';try{localStorage.setItem('matchday-language',language)}catch{}if(location.hash==='#new'){render();for(const [key,value] of saved)document.querySelector(`[name="${key}"]`).value=value;document.querySelector('#new-match').dispatchEvent(new Event('match-format-restored'));}else{drawScorer(workspaceMatch);for(const [key,value] of saved){const el=document.querySelector(`[name="${key}"]`);if(el)el.value=value;}}}else{language=language==='si'?'en':'si';try{localStorage.setItem('matchday-language',language)}catch{}render();}};
render();
