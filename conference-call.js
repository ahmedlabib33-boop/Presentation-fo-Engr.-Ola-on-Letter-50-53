(()=>{
  'use strict';

  const PROTOCOL='response53-cobrowse-v3';
  const params=new URLSearchParams(location.search);
  const invitedRoom=(params.get('conference')||'').replace(/[^A-Za-z0-9_-]/g,'').slice(0,80);
  const invitedRole=params.get('role')==='guest'?'guest':'host';
  const invitedMode=params.get('mode')==='voice'?'voice':'sync';
  const state={peer:null,connections:new Map(),room:invitedRoom,role:invitedRole,localId:'',controllerId:'',sessionReady:false,mode:'sync',wantVoice:invitedMode==='voice',voiceRequested:false,voiceCall:null,localStream:null,approvedVoicePeers:new Set(),applyingRemote:false,follow:true,pending:null,expanded:false,lastSent:0,drag:null};

  const ar=()=>document.body.classList.contains('arabic-mode');
  const t=(en,ara)=>ar()?ara:en;
  const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
  const launcher=el('button','conference-launcher');
  launcher.type='button';launcher.setAttribute('aria-haspopup','dialog');
  const dock=el('section','conference-dock');dock.setAttribute('role','dialog');dock.setAttribute('aria-modal','false');
  dock.innerHTML=`
    <header class="conference-head">
      <div class="conference-head-copy"><strong class="conference-title"></strong><small class="conference-state"></small></div>
      <button class="conference-icon-btn conference-expand" type="button">↗</button>
      <button class="conference-icon-btn conference-minimize" type="button">—</button>
      <button class="conference-icon-btn conference-close" type="button">×</button>
    </header>
    <div class="conference-setup">
      <h3></h3><p class="conference-intro"></p>
      <div class="conference-field"><label for="conferenceName"></label><input id="conferenceName" maxlength="45" autocomplete="name"></div>
      <div class="conference-field"><label for="conferenceRoom"></label><input id="conferenceRoom" maxlength="80" spellcheck="false"></div>
      <div class="conference-starts"><button class="conference-primary conference-sync" type="button"></button><button class="conference-secondary conference-voice-start" type="button"></button></div>
      <div class="conference-disclosure"></div>
    </div>
    <div class="conference-live">
      <div class="conference-request"><span></span><button class="accept" type="button"></button><button class="reject" type="button"></button></div>
      <div class="conference-toolbar"><button class="conference-action conference-invite" type="button"></button><button class="conference-action conference-follow active" type="button"></button><button class="conference-action conference-control" type="button"></button><button class="conference-action conference-voice-toggle" type="button"></button></div>
      <div class="conference-sync-panel"><strong></strong><span></span><i class="conference-peer-state"></i></div>
      <audio class="conference-remote-audio" autoplay playsinline></audio>
      <div class="conference-tip"></div>
    </div>
    <div class="conference-toast" role="status" aria-live="polite"></div>`;
  document.body.append(launcher,dock);

  const q=s=>dock.querySelector(s);
  const ui={title:q('.conference-title'),status:q('.conference-state'),setupTitle:q('.conference-setup h3'),intro:q('.conference-intro'),name:q('#conferenceName'),room:q('#conferenceRoom'),nameLabel:q('label[for="conferenceName"]'),roomLabel:q('label[for="conferenceRoom"]'),sync:q('.conference-sync'),voiceStart:q('.conference-voice-start'),disclosure:q('.conference-disclosure'),expand:q('.conference-expand'),minimize:q('.conference-minimize'),close:q('.conference-close'),invite:q('.conference-invite'),follow:q('.conference-follow'),control:q('.conference-control'),voiceToggle:q('.conference-voice-toggle'),syncTitle:q('.conference-sync-panel strong'),syncText:q('.conference-sync-panel span'),peerState:q('.conference-peer-state'),remoteAudio:q('.conference-remote-audio'),tip:q('.conference-tip'),request:q('.conference-request'),requestText:q('.conference-request span'),accept:q('.conference-request .accept'),reject:q('.conference-request .reject'),toast:q('.conference-toast')};
  ui.name.value=invitedRole==='guest'?'Eng. OLA':'Eng. Ahmed Labib';ui.room.value=state.room;
  const peerCount=()=>state.connections.size;
  const voiceActive=()=>!!state.voiceCall;

  function refreshText(){
    dock.dir=ar()?'rtl':'ltr';launcher.textContent=t('Voice & live sync','الصوت والمزامنة المباشرة');
    dock.setAttribute('aria-label',t('Voice conference and independent presentation sync','المكالمة الصوتية ومزامنة العرض المستقلة'));
    ui.title.textContent=t('Voice and live presentation sync','الصوت ومزامنة العرض المباشرة');
    ui.status.textContent=voiceActive()?t('Voice on · presentation sync active','الصوت يعمل · مزامنة العرض نشطة'):peerCount()?t('Sync active · voice is off','المزامنة نشطة · الصوت متوقف'):state.sessionReady?t('Sync ready · waiting for participant','المزامنة جاهزة · بانتظار المشارك'):t('Share the app with or without voice','شارك التطبيق مع الصوت أو بدونه');
    ui.setupTitle.textContent=state.room?t('Join the shared presentation','الانضمام إلى العرض المشترك'):t('Start a shared presentation','بدء عرض مشترك');
    ui.intro.textContent=t('Synchronization works independently from voice. Either participant can request control; the person currently controlling must grant or decline it.','تعمل المزامنة بصورة مستقلة عن الصوت. يمكن لأي مشارك طلب التحكم، وعلى المتحكم الحالي منح الطلب أو رفضه.');
    ui.nameLabel.textContent=t('Your display name','اسمك الظاهر');ui.roomLabel.textContent=t('Private session name','اسم الجلسة الخاصة');
    ui.sync.textContent=state.room?t('Join sync only','انضم للمزامنة فقط'):t('Start sync only','ابدأ المزامنة فقط');
    ui.voiceStart.textContent=state.room?t('Join and request voice','انضم واطلب الصوت'):t('Start sync and request voice','ابدأ المزامنة واطلب الصوت');
    ui.disclosure.textContent=t('Sync-only mode does not request microphone access. Voice is audio-only and starts only after the other participant accepts. Search text and form entries are never transmitted.','وضع المزامنة فقط لا يطلب الوصول إلى الميكروفون. الاتصال صوتي فقط ولا يبدأ إلا بعد قبول المشارك الآخر. ولا تُنقل نصوص البحث أو بيانات النماذج مطلقًا.');
    ui.expand.setAttribute('aria-label',t('Expand shared session','تكبير نافذة الجلسة المشتركة'));ui.minimize.setAttribute('aria-label',t('Minimize shared session','تصغير نافذة الجلسة المشتركة'));ui.close.setAttribute('aria-label',t('Leave shared session','مغادرة الجلسة المشتركة'));
    ui.invite.textContent=t('Copy invitation','نسخ رابط الدعوة');ui.follow.textContent=state.follow?t('Following presenter','متابعة مقدم العرض'):t('Follow paused','المتابعة متوقفة');
    const owns=state.sessionReady&&state.controllerId&&state.controllerId===state.localId;
    ui.control.textContent=owns?t('You control','أنت المتحكم'):t('Request control','طلب التحكم');ui.control.disabled=!peerCount()||owns;
    ui.voiceToggle.textContent=voiceActive()?t('End voice · keep sync','إنهاء الصوت · إبقاء المزامنة'):state.voiceRequested?t('Voice requested','تم طلب الصوت'):t('Request voice','طلب اتصال صوتي');
    ui.voiceToggle.classList.toggle('active',voiceActive());ui.voiceToggle.disabled=!peerCount()||state.voiceRequested;
    ui.syncTitle.textContent=t('Presentation synchronization is active','مزامنة العرض نشطة');ui.syncText.textContent=t('Voice is optional. Navigate freely, follow the presenter, or request control.','الصوت اختياري. تنقل بحرية أو تابع مقدم العرض أو اطلب التحكم.');
    ui.peerState.textContent=peerCount()?t('Both participants connected','المشاركان متصلان'):t('Share the invitation link to connect Eng. OLA','شارك رابط الدعوة للاتصال بم. علا');
    ui.tip.textContent=t('Independent sync keeps both devices on the same app tab and reading position, whether voice is active or not.','تحافظ المزامنة المستقلة على تبويب التطبيق وموضع القراءة نفسيهما على الجهازين، سواء كان الصوت نشطًا أم لا.');
    if(state.pending?.type==='voice'){ui.accept.textContent=t('Accept voice','قبول الصوت');ui.reject.textContent=t('Decline','رفض');}
    else{ui.accept.textContent=t('Grant control','منح التحكم');ui.reject.textContent=t('Decline','رفض');}
  }

  function toast(message){ui.toast.textContent=message;ui.toast.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>ui.toast.classList.remove('show'),4200);}
  function randomRoom(){return 'Response53-'+Date.now().toString(36)+'-'+crypto.getRandomValues(new Uint32Array(1))[0].toString(36);}
  function openDock(){dock.classList.add('open');dock.classList.remove('minimized');launcher.hidden=true;refreshText();}
  function minimize(){dock.classList.add('minimized');launcher.hidden=false;}
  function updateLiveClass(){dock.classList.toggle('connected',state.sessionReady);launcher.classList.toggle('is-live',state.sessionReady);}
  launcher.addEventListener('click',openDock);ui.minimize.addEventListener('click',minimize);ui.expand.addEventListener('click',()=>{state.expanded=!state.expanded;dock.classList.toggle('expanded',state.expanded);ui.expand.textContent=state.expanded?'↙':'↗';});ui.close.addEventListener('click',leaveSession);

  function loadPeer(){
    if(window.Peer)return Promise.resolve();if(loadPeer.promise)return loadPeer.promise;
    loadPeer.promise=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='https://unpkg.com/peerjs@1.5.5/dist/peerjs.min.js';s.async=true;s.onload=resolve;s.onerror=()=>reject(new Error('PeerJS failed to load'));document.head.appendChild(s);});return loadPeer.promise;
  }
  async function join(mode='sync'){
    if(state.peer)return;state.wantVoice=mode==='voice';const name=(ui.name.value||'Guest').trim().slice(0,45);
    state.room=(ui.room.value||randomRoom()).replace(/[^A-Za-z0-9_-]/g,'').slice(0,80);ui.room.value=state.room;
    if(!invitedRoom){state.role='host';const p=new URLSearchParams(location.search);p.set('conference',state.room);p.set('role','host');p.set('mode',mode);history.replaceState(null,'',location.pathname+'?'+p.toString()+location.hash);}
    ui.sync.disabled=true;ui.voiceStart.disabled=true;(mode==='voice'?ui.voiceStart:ui.sync).textContent=t('Connecting…','جارٍ الاتصال…');
    try{
      await loadPeer();state.peer=state.role==='host'?new window.Peer(state.room,{debug:1}):new window.Peer(undefined,{debug:1});
      state.peer.on('open',id=>{state.localId=id;state.sessionReady=true;if(state.role==='host')state.controllerId=id;updateLiveClass();ui.sync.disabled=false;ui.voiceStart.disabled=false;refreshText();if(state.role==='guest')adoptConnection(state.peer.connect(state.room,{reliable:true,metadata:{protocol:PROTOCOL,role:'guest',name}}));});
      state.peer.on('connection',adoptConnection);state.peer.on('call',acceptIncomingMediaCall);state.peer.on('error',handlePeerError);
      state.peer.on('disconnected',()=>{state.sessionReady=false;updateLiveClass();refreshText();toast(t('The synchronization broker disconnected. Reopen the session to reconnect.','انقطع وسيط المزامنة. أعد فتح الجلسة للاتصال من جديد.'));});
      state.peer.on('close',()=>{state.sessionReady=false;updateLiveClass();refreshText();});
    }catch(_){state.peer=null;state.sessionReady=false;updateLiveClass();ui.sync.disabled=false;ui.voiceStart.disabled=false;refreshText();toast(t('Unable to open the shared session. Check the connection and try again.','تعذر فتح الجلسة المشتركة. تحقق من الاتصال وحاول مرة أخرى.'));}
  }
  function handlePeerError(error){if(error?.type==='peer-unavailable')toast(t('The other participant is not connected yet. Keep this window open and try the invitation again.','المشارك الآخر غير متصل بعد. اترك هذه النافذة مفتوحة وأعد فتح رابط الدعوة.'));else toast(t('The shared connection reported an error.','أبلغ اتصال المشاركة عن خطأ.'));}
  function adoptConnection(conn){
    if(!conn)return;
    conn.on('open',()=>{state.connections.set(conn.peer,conn);state.sessionReady=true;if(state.role==='guest'&&!state.controllerId)state.controllerId=state.room;updateLiveClass();refreshText();send({type:'hello',role:state.role,name:ui.name.value,controllerId:state.controllerId},conn.peer);if(state.controllerId===state.localId)setTimeout(()=>sendState(conn.peer),250);if(state.wantVoice&&!state.voiceRequested)setTimeout(requestVoice,450);});
    conn.on('data',msg=>receive(msg,conn.peer));conn.on('close',()=>{state.connections.delete(conn.peer);state.approvedVoicePeers.delete(conn.peer);endVoice(false);refreshText();});conn.on('error',()=>{state.connections.delete(conn.peer);refreshText();});
  }
  function send(payload,target){const msg={protocol:PROTOCOL,ts:Date.now(),...payload};if(target){const conn=state.connections.get(target);if(conn?.open)try{conn.send(msg);}catch(_){ }return;}state.connections.forEach(conn=>{if(conn.open)try{conn.send(msg);}catch(_){ }});}
  function receive(msg,sender){
    if(!msg||msg.protocol!==PROTOCOL)return;
    if(msg.type==='hello'){if(msg.role==='host'&&msg.controllerId)state.controllerId=msg.controllerId;if(state.role==='host')sendState(sender);refreshText();return;}
    if(msg.type==='control-request'&&state.controllerId===state.localId){state.pending={type:'control',id:sender,name:msg.name||t('Participant','مشارك')};ui.requestText.textContent=t(`${state.pending.name} is asking to control the presentation.`,`يطلب ${state.pending.name} التحكم في العرض.`);ui.request.classList.add('show');refreshText();return;}
    if(msg.type==='control-granted'){if(state.controllerId&&sender!==state.controllerId)return;state.controllerId=msg.participantId;state.follow=true;refreshText();if(state.localId===msg.participantId)toast(t('You now control the presentation.','أصبح التحكم في العرض لديك الآن.'));return;}
    if(msg.type==='control-denied'){toast(t('The control request was declined.','تم رفض طلب التحكم.'));return;}
    if(msg.type==='voice-request'){state.pending={type:'voice',id:sender,name:msg.name||t('Participant','مشارك')};ui.requestText.textContent=t(`${state.pending.name} is requesting a voice connection.`,`يطلب ${state.pending.name} بدء اتصال صوتي.`);ui.request.classList.add('show');refreshText();return;}
    if(msg.type==='voice-accepted'){state.voiceRequested=false;state.approvedVoicePeers.add(sender);startOutgoingVoice(sender);return;}
    if(msg.type==='voice-denied'){state.voiceRequested=false;refreshText();toast(t('The voice request was declined; synchronization remains active.','تم رفض طلب الصوت، وما تزال المزامنة نشطة.'));return;}
    if(msg.type==='voice-ended'){endVoice(false);toast(t('Voice ended; synchronization remains active.','انتهى الاتصال الصوتي، وما تزال المزامنة نشطة.'));return;}
    if(msg.type==='state'){if(state.controllerId&&sender!==state.controllerId)return;if(!state.controllerId)state.controllerId=sender;if(state.follow)applyState(msg.view);refreshText();}
  }

  function presentationEntered(){return document.getElementById('master')?.classList.contains('show')||false;}
  function activeView(){const tabs=[...document.querySelectorAll('#tabbar .tb')];const section=tabs.findIndex(x=>x.getAttribute('aria-selected')==='true');const sec=document.querySelectorAll('#host > .sec')[Math.max(0,section)];const subs=sec?[...sec.querySelectorAll(':scope > .subbar .sb')]:[];const sub=Math.max(0,subs.findIndex(x=>x.getAttribute('aria-selected')==='true'));const pane=sec?.querySelector('.pane:not([hidden])');const details=pane?[...pane.querySelectorAll('details')].map((d,i)=>d.open?i:-1).filter(i=>i>=0):[];const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);return{entered:presentationEntered(),section:Math.max(0,section),sub,arabic:ar(),scroll:Math.max(0,Math.min(1,scrollY/max)),details};}
  function sendState(target){if(state.applyingRemote||!state.sessionReady||state.controllerId!==state.localId)return;send({type:'state',view:activeView()},target);}
  function applyState(view){
    if(!view||!Number.isInteger(view.section))return;state.applyingRemote=true;
    const needsEntry=!!view.entered&&!presentationEntered();
    try{
      if(needsEntry)document.getElementById('press')?.click();
      setTimeout(()=>{
        try{
          if(ar()!==!!view.arabic)document.getElementById('langToggleTop')?.click();
          if(typeof window.pick==='function')window.pick(view.section);else document.querySelectorAll('#tabbar .tb')[view.section]?.click();
          const sec=document.querySelectorAll('#host > .sec')[view.section];sec?.querySelectorAll(':scope > .subbar .sb')[view.sub||0]?.click();
          const pane=sec?.querySelector('.pane:not([hidden])');if(pane&&Array.isArray(view.details))[...pane.querySelectorAll('details')].forEach((d,i)=>{d.open=view.details.includes(i);});
          setTimeout(()=>{const max=Math.max(0,document.documentElement.scrollHeight-innerHeight);scrollTo({top:max*Math.max(0,Math.min(1,Number(view.scroll)||0)),behavior:'smooth'});setTimeout(()=>{state.applyingRemote=false;},450);},180);
        }catch(_){state.applyingRemote=false;}
      },needsEntry?2200:0);
    }catch(_){state.applyingRemote=false;}
  }

  async function ensureLocalAudio(){if(state.localStream)return state.localStream;state.localStream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true},video:false});return state.localStream;}
  function wireMediaCall(call){if(!call)return;state.voiceCall=call;state.mode='voice';state.voiceRequested=false;refreshText();call.on('stream',stream=>{ui.remoteAudio.srcObject=stream;ui.remoteAudio.play().catch(()=>{});state.mode='voice';refreshText();toast(t('Voice connected; synchronization remains active.','تم اتصال الصوت، وما تزال المزامنة نشطة.'));});call.on('close',()=>endVoice(false));call.on('error',()=>{endVoice(false);toast(t('Voice could not connect; synchronization remains active.','تعذر اتصال الصوت، وما تزال المزامنة نشطة.'));});}
  async function startOutgoingVoice(peerId){try{const stream=await ensureLocalAudio();wireMediaCall(state.peer.call(peerId,stream,{metadata:{protocol:PROTOCOL}}));}catch(_){state.voiceRequested=false;send({type:'voice-denied'},peerId);refreshText();toast(t('Microphone access was not granted; synchronization remains active.','لم يتم السماح بالوصول إلى الميكروفون، وما تزال المزامنة نشطة.'));}}
  async function acceptIncomingMediaCall(call){if(!state.approvedVoicePeers.has(call.peer)){call.close();return;}try{const stream=await ensureLocalAudio();call.answer(stream);wireMediaCall(call);}catch(_){call.close();send({type:'voice-denied'},call.peer);}}
  function requestVoice(){if(!peerCount()){state.wantVoice=true;toast(t('Voice will be requested when Eng. OLA joins.','سيتم طلب الصوت عند انضمام م. علا.'));return;}state.voiceRequested=true;send({type:'voice-request',name:ui.name.value});refreshText();toast(t('Voice request sent. Synchronization continues while waiting.','تم إرسال طلب الصوت. وتستمر المزامنة أثناء انتظار الرد.'));}
  function endVoice(notify=true){const peerId=state.voiceCall?.peer;try{state.voiceCall?.close();}catch(_){ }state.voiceCall=null;state.voiceRequested=false;state.mode='sync';if(state.localStream){state.localStream.getTracks().forEach(track=>track.stop());state.localStream=null;}ui.remoteAudio.srcObject=null;if(notify)send({type:'voice-ended'},peerId);refreshText();}
  function leaveSession(){endVoice(false);state.connections.forEach(conn=>{try{conn.close();}catch(_){ }});state.connections.clear();if(state.peer){try{state.peer.destroy();}catch(_){ }state.peer=null;}state.sessionReady=false;state.localId='';state.controllerId='';state.pending=null;state.approvedVoicePeers.clear();ui.request.classList.remove('show');dock.classList.remove('connected','open','expanded');launcher.hidden=false;launcher.classList.remove('is-live');refreshText();}

  ui.sync.addEventListener('click',()=>join('sync'));ui.voiceStart.addEventListener('click',()=>join('voice'));
  ui.invite.addEventListener('click',async()=>{const p=new URLSearchParams(location.search);p.set('conference',state.room);p.set('role','guest');p.set('mode','sync');const url=location.origin+location.pathname+'?'+p.toString()+location.hash;try{await navigator.clipboard.writeText(url);toast(t('Invitation link copied. Send it to Eng. OLA.','تم نسخ رابط الدعوة. أرسله إلى م. علا.'));}catch(_){prompt(t('Copy this invitation link:','انسخ رابط الدعوة:'),url);}});
  ui.follow.addEventListener('click',()=>{state.follow=!state.follow;ui.follow.classList.toggle('active',state.follow);refreshText();if(state.follow)send({type:'hello',role:state.role,name:ui.name.value,controllerId:state.controllerId});});
  ui.control.addEventListener('click',()=>{send({type:'control-request',name:ui.name.value});toast(t('Control request sent to the current presenter.','تم إرسال طلب التحكم إلى مقدم العرض الحالي.'));});
  ui.voiceToggle.addEventListener('click',()=>{if(voiceActive())endVoice(true);else requestVoice();});
  ui.accept.addEventListener('click',async()=>{if(!state.pending)return;const pending=state.pending;ui.request.classList.remove('show');state.pending=null;if(pending.type==='control'){state.controllerId=pending.id;send({type:'control-granted',participantId:pending.id});refreshText();return;}try{await ensureLocalAudio();state.approvedVoicePeers.add(pending.id);send({type:'voice-accepted'},pending.id);toast(t('Voice accepted. Synchronization stays active while audio connects.','تم قبول الصوت. وتظل المزامنة نشطة أثناء اتصال الصوت.'));}catch(_){send({type:'voice-denied'},pending.id);toast(t('Microphone access was not granted; synchronization remains active.','لم يتم السماح بالوصول إلى الميكروفون، وما تزال المزامنة نشطة.'));}refreshText();});
  ui.reject.addEventListener('click',()=>{if(state.pending)send({type:state.pending.type==='voice'?'voice-denied':'control-denied'},state.pending.id);ui.request.classList.remove('show');state.pending=null;refreshText();});

  document.addEventListener('click',e=>{if(!state.sessionReady||state.applyingRemote||state.controllerId!==state.localId)return;if(e.target.closest('#press')){setTimeout(()=>sendState(),2400);return;}if(e.target.closest('#tabbar,.subbar,details,.smart-table-shell'))setTimeout(()=>sendState(),240);},true);
  const viewObserver=new MutationObserver(()=>{
    if(!state.sessionReady||state.applyingRemote||state.controllerId!==state.localId)return;
    clearTimeout(viewObserver.timer);viewObserver.timer=setTimeout(()=>sendState(),320);
  });
  const master=document.getElementById('master'),tabbar=document.getElementById('tabbar'),host=document.getElementById('host');
  if(master)viewObserver.observe(master,{attributes:true,attributeFilter:['class']});
  if(tabbar)viewObserver.observe(tabbar,{subtree:true,attributes:true,attributeFilter:['aria-selected']});
  if(host)viewObserver.observe(host,{subtree:true,attributes:true,attributeFilter:['aria-selected','open','hidden']});
  window.addEventListener('scroll',()=>{
    if(!state.sessionReady||state.applyingRemote||state.controllerId!==state.localId)return;
    const now=Date.now();
    if(now-state.lastSent>=120){state.lastSent=now;sendState();}
    clearTimeout(state.scrollTimer);
    state.scrollTimer=setTimeout(()=>{state.lastSent=Date.now();sendState();},260);
  },{passive:true});
  window.addEventListener('site-language',()=>{refreshText();if(state.sessionReady&&state.controllerId===state.localId)setTimeout(sendState,120);});
  const head=q('.conference-head');head.addEventListener('pointerdown',e=>{if(innerWidth<=700||e.target.closest('button')||state.expanded)return;const r=dock.getBoundingClientRect();state.drag={x:e.clientX-r.left,y:e.clientY-r.top};head.setPointerCapture(e.pointerId);});head.addEventListener('pointermove',e=>{if(!state.drag)return;const left=Math.max(8,Math.min(innerWidth-dock.offsetWidth-8,e.clientX-state.drag.x));const top=Math.max(8,Math.min(innerHeight-dock.offsetHeight-8,e.clientY-state.drag.y));dock.style.left=left+'px';dock.style.top=top+'px';dock.style.right='auto';dock.style.bottom='auto';});head.addEventListener('pointerup',()=>{state.drag=null;});
  refreshText();if(invitedRoom)openDock();
})();
