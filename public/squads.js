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
