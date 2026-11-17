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
