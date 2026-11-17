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
