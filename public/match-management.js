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
   <label>${tr('Scorer’s GitHub email','ලකුණු සටහන්කරුගේ GitHub ඊමේල් ලිපිනය')}
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
