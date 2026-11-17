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
