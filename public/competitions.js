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
