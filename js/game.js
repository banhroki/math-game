// game.js — ゲームロジック・画面制御

// ===== STATE =====
let mode=0, diff='easy', lang='ja', theme='th-sky';
let score=0, total=0, correctAns=0, answered=false;
const Q_PER_GAME = 8;
let qCount=0, timerInterval=null, timeLeft=0;
let history=[], countVal=0;
let iconAnimActive = false;

const EMOJIS=['🍎','🍊','⚽','🚗','🌟','🐶','🐱','🎈','🍪','🌸','🐸','🦋','🍓','🍭','🎀','🚂','🐥','🎵','🍦','⭐'];
const DIFF = {
  easy:{maxAdd:5, maxSub:5, maxMulA:3, maxMulB:3, maxDivB:3, countMax:8,  timerSec:0,  bonusSeals:0},
  norm:{maxAdd:8, maxSub:8, maxMulA:5, maxMulB:4, maxDivB:4, countMax:10, timerSec:20, bonusSeals:2},
  hard:{maxAdd:12,maxSub:12,maxMulA:6, maxMulB:5, maxDivB:5, countMax:10, timerSec:12, bonusSeals:4},
};
const L = {
  ja:{
    modes:['かずをかぞえよう','たしざん','ひきざん','かけざん','わりざん','おおきいかず'],
    howMany:'いくつ あるかな？',
    addQ:(em,a,b)=>`${em}が ${a}こと ${b}こ。あわせると？`,
    subQ:(em,a,b)=>`${em}が ${a}こ。${b}こ とりました。のこりは？`,
    mulQ:(em,a,b)=>`おさらが ${a}まい。${em}が ${b}こずつ。ぜんぶで？`,
    divQ:(em,a,b)=>`${em}が ${a}こ。${b}にんで わけると？`,
    bigQ:'ボタンをつかってかずをかえてみよう！',
    correct:'⭕ すごい！せいかい！', wrong:n=>`❌ ざんねん… こたえは ${n} だよ`,
    next:'つぎへ ▶', resultGreat:'ぜんもんせいかい！🎉', resultGood:'よくできました！', resultOk:'がんばったね！',
    scoreMsg:(c,t)=>`${t}もんちゅう ${c}もんせいかい！`,
    sealGet:n=>`シールが ${n}まい もらえたよ！`,
    diff:['かんたん','ふつう','むずかしい'],
    accuracy:'せいかいりつ',
  },
  en:{
    modes:['Count','Addition','Subtraction','Multiplication','Division','Big Numbers'],
    howMany:'How many?',
    addQ:(em,a,b)=>`${a} ${em} + ${b} ${em} = ?`,
    subQ:(em,a,b)=>`${a} ${em}. ${b} gone. Left?`,
    mulQ:(em,a,b)=>`${a} plates × ${b} ${em} each = ?`,
    divQ:(em,a,b)=>`${a} ${em} ÷ ${b} friends = ?`,
    bigQ:'Use buttons to change the number!',
    correct:'⭕ Correct!', wrong:n=>`❌ Oops! Answer: ${n}`,
    next:'Next ▶', resultGreat:'Perfect! 🎉', resultGood:'Well done!', resultOk:'Good try!',
    scoreMsg:(c,t)=>`${c}/${t} correct!`,
    sealGet:n=>`You earned ${n} sticker(s)!`,
    diff:['Easy','Normal','Hard'],
    accuracy:'Accuracy',
  }
};
const t = () => L[lang];

// ===== UTILS =====
const rand = (a,b) => Math.floor(Math.random()*(b-a+1))+a;
const shuffle = a => [...a].sort(()=>Math.random()-.5);
const pickEmoji = () => EMOJIS[rand(0,EMOJIS.length-1)];

// ===== SOUND =====
function playSound(type) {
  try {
    const ctx = new(window.AudioContext||window.webkitAudioContext)();
    const o=ctx.createOscillator(), g=ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    if (type==='correct') {
      o.frequency.setValueAtTime(523,ctx.currentTime);
      o.frequency.setValueAtTime(659,ctx.currentTime+.1);
      o.frequency.setValueAtTime(784,ctx.currentTime+.2);
      g.gain.setValueAtTime(.3,ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.5);
      o.start(); o.stop(ctx.currentTime+.5);
    } else if (type==='prize') {
      [523,659,784,1047].forEach((f,i)=>{
        const o2=ctx.createOscillator(),g2=ctx.createGain();
        o2.connect(g2); g2.connect(ctx.destination);
        o2.frequency.value=f; g2.gain.setValueAtTime(.22,ctx.currentTime+i*.12);
        g2.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+i*.12+.3);
        o2.start(ctx.currentTime+i*.12); o2.stop(ctx.currentTime+i*.12+.3);
      });
    } else {
      o.type='sawtooth'; o.frequency.setValueAtTime(200,ctx.currentTime);
      o.frequency.setValueAtTime(160,ctx.currentTime+.15);
      g.gain.setValueAtTime(.18,ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.4);
      o.start(); o.stop(ctx.currentTime+.4);
    }
  } catch(e){}
}

// ===== CONFETTI =====
function confetti() {
  const wrap = document.getElementById('confettiWrap');
  wrap.innerHTML = '';
  const colors=['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#ff9ff3','#f9ca24'];
  for(let i=0;i<55;i++){
    const d=document.createElement('div'); d.className='conf';
    d.style.cssText=`left:${rand(0,100)}%;background:${colors[rand(0,colors.length-1)]};
      animation-duration:${rand(15,30)*.1}s;animation-delay:${rand(0,8)*.1}s;
      width:${rand(8,14)}px;height:${rand(8,14)}px;border-radius:${rand(0,1)?'50%':'2px'}`;
    wrap.appendChild(d);
  }
  setTimeout(()=>wrap.innerHTML='',3500);
}

// ===== ICON MANAGEMENT =====
function setupIcons() {
  const acc = DB.current();
  if (!acc) return;
  ['userIconCanvas','miniIconCanvas','resultIconCanvas'].forEach(id => {
    const cv = document.getElementById(id);
    if (cv) ICONS.staticDraw(cv, acc.iconId);
  });

  // Tap to animate
  const iconWrap = document.getElementById('userIconWrap');
  const userCanvas = document.getElementById('userIconCanvas');
  iconWrap.addEventListener('click', () => {
    if (iconAnimActive) return;
    iconAnimActive = true;
    ICONS.startAnim(userCanvas, acc.iconId);
    setTimeout(() => {
      iconAnimActive = false;
      ICONS.staticDraw(userCanvas, acc.iconId);
    }, 2000);
  });
  const miniCanvas = document.getElementById('miniIconCanvas');
  if (miniCanvas) {
    miniCanvas.addEventListener('click', () => {
      ICONS.startAnim(miniCanvas, acc.iconId);
      setTimeout(() => ICONS.staticDraw(miniCanvas, acc.iconId), 2000);
    });
  }
}

// ===== SCREENS =====
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function goHome() {
  clearTimer();
  showScreen('sHome');
  const acc = DB.current();
  if (acc) {
    document.getElementById('peekCount').textContent = acc.sealGrid.filter(x=>x!==null).length;
    document.getElementById('userSeals').textContent = acc.sealCount;
  }
}

function showSeal() {
  SEAL.showSealScreen(lang);
  showScreen('sSeal');
}

function logout() {
  DB.logout();
  window.location.href = 'index.html';
}

function retryMode() { startMode(mode); }

// ===== SETTINGS =====
function setTheme(th, btn) {
  document.body.className = th; theme = th;
  document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  DB.update({ theme });
}
function setDiff(d, btn) {
  diff = d;
  document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  DB.update({ diff });
}
function setLang(l, btn) {
  lang = l;
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  updateLabels();
  DB.update({ lang });
}

function updateLabels() {
  const tl = t();
  document.querySelectorAll('.mLabel').forEach((el,i) => el.textContent = tl.modes[i]);
  document.querySelectorAll('.dlabel').forEach((el,i) => el.textContent = tl.diff[i]);
  if (document.getElementById('nextBtn'))
    document.getElementById('nextBtn').textContent = tl.next;
}

// ===== INIT =====
window.addEventListener('DOMContentLoaded', () => {
  const acc = DB.current();
  if (!acc) { window.location.href = 'index.html'; return; }

  // Restore settings
  theme = acc.theme || 'th-sky';
  diff  = acc.diff  || 'easy';
  lang  = acc.lang  || 'ja';
  document.body.className = theme;

  // Apply active classes to settings buttons
  document.querySelectorAll('.theme-btn').forEach(b => {
    if (b.onclick && b.onclick.toString().includes(theme)) b.classList.add('active');
  });
  // Simpler: set via attribute
  document.querySelectorAll('.diff-btn').forEach((b,i) => {
    b.classList.toggle('active', ['easy','norm','hard'][i] === diff);
  });
  document.querySelectorAll('.lang-btn').forEach((b,i) => {
    b.classList.toggle('active', ['ja','en'][i] === lang);
  });

  document.getElementById('userName').textContent = acc.name;
  document.getElementById('userSeals').textContent = acc.sealCount;
  document.getElementById('peekCount').textContent = acc.sealGrid.filter(x=>x!==null).length;

  setupIcons();
  updateLabels();
});

// ===== START MODE =====
function startMode(m) {
  mode=m; score=0; total=0; qCount=0; history=[];
  document.getElementById('score').textContent = 0;
  const tl = t();
  document.getElementById('modeTitle').textContent = tl.modes[m];
  document.getElementById('nextBtn').textContent = tl.next;
  const tw = document.getElementById('timerWrap');
  tw.style.display = (m!==5 && DIFF[diff].timerSec>0) ? 'block' : 'none';
  showScreen('sGame');
  // animate mini icon
  const miniCv = document.getElementById('miniIconCanvas');
  const acc = DB.current();
  if (acc && miniCv) ICONS.staticDraw(miniCv, acc.iconId);
  nextQ();
}

// ===== NEXT Q =====
function nextQ() {
  if (qCount >= Q_PER_GAME && mode !== 5) { showResult(); return; }
  answered = false;
  document.getElementById('feedback').textContent = '';
  document.getElementById('feedback').className = 'feedback';
  document.getElementById('nextBtn').style.display = 'none';
  document.getElementById('answers').innerHTML = '';
  clearTimer();

  if (mode===0) buildCount();
  else if (mode===1) buildAdd();
  else if (mode===2) buildSub();
  else if (mode===3) buildMul();
  else if (mode===4) buildDiv();
  else buildBig();

  if (mode!==5 && DIFF[diff].timerSec>0) startTimer();
  qCount++;
}

// ===== TIMER =====
function startTimer() {
  timeLeft = DIFF[diff].timerSec;
  const bar = document.getElementById('timerBar');
  bar.style.width='100%'; bar.style.background='#66dd88';
  timerInterval = setInterval(() => {
    timeLeft -= .1;
    const p = Math.max(0, timeLeft/DIFF[diff].timerSec*100);
    bar.style.width = p+'%';
    if (p<40) bar.style.background='#ff9800';
    if (p<15) bar.style.background='#f44336';
    if (timeLeft<=0) { clearTimer(); timeUp(); }
  }, 100);
}
function clearTimer() { clearInterval(timerInterval); timerInterval=null; }
function timeUp() {
  if (answered) return;
  answered = true;
  const fb = document.getElementById('feedback');
  fb.textContent = t().wrong(correctAns); fb.className='feedback ng';
  document.querySelectorAll('.ans-btn').forEach(b=>{if(+b.textContent===correctAns)b.classList.add('correct');});
  playSound('wrong');
  history.push({mode, correct:false});
  document.getElementById('nextBtn').style.display='block';
}

// ===== QUESTION BUILDERS =====
function buildCount() {
  const d=DIFF[diff], n=rand(1,d.countMax), em=pickEmoji(); correctAns=n;
  document.getElementById('qText').textContent = t().howMany;
  document.getElementById('qEq').textContent = '';
  let h='<div class="emoji-stage">';
  for(let i=0;i<n;i++) h+=`<span class="emoji-item" id="ci${i}">${em}</span>`;
  h+='</div>'; document.getElementById('visual').innerHTML=h;
  for(let i=0;i<n;i++) setTimeout(()=>{const el=document.getElementById('ci'+i);if(el){el.classList.add('pop');setTimeout(()=>el.classList.remove('pop'),350);}},i*120);
  buildAnswers(n,1,d.countMax+3);
}
function buildAdd() {
  const d=DIFF[diff], a=rand(1,d.maxAdd), b=rand(1,d.maxAdd), em=pickEmoji(); correctAns=a+b;
  document.getElementById('qText').textContent=t().addQ(em,a,b);
  document.getElementById('qEq').textContent=`${a} ＋ ${b} ＝ ？`;
  let h='<div class="emoji-stage">';
  for(let i=0;i<a;i++) h+=`<span class="emoji-item">${em}</span>`;
  h+='<span style="font-size:20px;margin:0 3px;color:#ccc">｜</span>';
  for(let i=0;i<b;i++) h+=`<span class="emoji-item">${em}</span>`;
  h+='</div>'; document.getElementById('visual').innerHTML=h;
  buildAnswers(a+b,1,d.maxAdd*2+2);
}
function buildSub() {
  const d=DIFF[diff], b=rand(1,d.maxSub), a=rand(b,b+d.maxSub-1), em=pickEmoji(); correctAns=a-b;
  document.getElementById('qText').textContent=t().subQ(em,a,b);
  document.getElementById('qEq').textContent=`${a} ー ${b} ＝ ？`;
  let h='<div class="emoji-stage">';
  for(let i=0;i<a;i++) h+=`<span class="emoji-item" id="si${i}">${em}</span>`;
  h+='</div>'; document.getElementById('visual').innerHTML=h;
  setTimeout(()=>{for(let i=0;i<b;i++){const el=document.getElementById('si'+i);if(el)el.classList.add('gone');}},400);
  buildAnswers(a-b,0,d.maxSub+2);
}
function buildMul() {
  const d=DIFF[diff], a=rand(2,d.maxMulA), b=rand(2,d.maxMulB), em=pickEmoji(); correctAns=a*b;
  document.getElementById('qText').textContent=t().mulQ(em,a,b);
  document.getElementById('qEq').textContent=`${a} × ${b} ＝ ？`;
  let h='<div class="groups">';
  for(let i=0;i<a;i++){h+='<div class="group-box">';for(let j=0;j<b;j++)h+=`<span class="emoji-item">${em}</span>`;h+='</div>';}
  h+='</div>'; document.getElementById('visual').innerHTML=h;
  buildAnswers(a*b,2,d.maxMulA*d.maxMulB+4);
}
function buildDiv() {
  const d=DIFF[diff], b=rand(2,d.maxDivB), a=b*rand(2,4), em=pickEmoji(); correctAns=a/b;
  document.getElementById('qText').textContent=t().divQ(em,a,b);
  document.getElementById('qEq').textContent=`${a} ÷ ${b} ＝ ？`;
  let h='<div class="groups" id="dg">';
  for(let i=0;i<b;i++) h+=`<div class="group-box" id="dg${i}"><span style="font-size:22px">🙂</span></div>`;
  h+='</div>'; document.getElementById('visual').innerHTML=h;
  let idx=0; const tm=setInterval(()=>{if(idx>=a){clearInterval(tm);return;}
    const g=document.getElementById('dg'+(idx%b));if(g){const sp=document.createElement('span');sp.className='emoji-item';sp.textContent=em;g.appendChild(sp);}idx++;},110);
  buildAnswers(a/b,1,10);
}
function buildBig() {
  countVal = rand(1,20)*5;
  document.getElementById('qText').textContent = t().bigQ;
  document.getElementById('qEq').textContent = '';
  document.getElementById('answers').innerHTML = '';
  document.getElementById('nextBtn').style.display = 'none';
  renderBig();
}
function renderBig() {
  const v=countVal, T=Math.floor(v/1000), H=Math.floor((v%1000)/100),
        D=Math.floor((v%100)/10), O=v%10;
  let h='<div class="bead-area">';
  if(T>0){h+='<div class="bead-block">';for(let i=0;i<T;i++){h+='<div class="bead-cube" style="width:38px;height:38px">';for(let d=0;d<4;d++)h+='<div class="bead-dot" style="width:10px;height:10px;background:#ff99cc;border-color:#cc4488"></div>';h+='</div>';}h+='<label>×1000</label></div>';}
  if(H>0){h+='<div class="bead-block">';for(let i=0;i<H;i++){h+='<div class="bead-flat" style="width:30px;height:30px">';for(let d=0;d<4;d++)h+='<div class="bead-dot" style="width:7px;height:7px;background:#44ccee;border-color:#0099cc"></div>';h+='</div>';}h+='<label>×100</label></div>';}
  if(D>0){h+='<div class="bead-block">';for(let i=0;i<D;i++){h+='<div class="bead-rod" style="flex-direction:row;gap:2px;padding:2px 4px">';for(let d=0;d<3;d++)h+='<div class="bead-dot" style="background:#66dd88;border-color:#339944"></div>';h+='</div>';}h+='<label>×10</label></div>';}
  if(O>0){h+='<div class="bead-block"><div style="display:flex;flex-wrap:wrap;gap:3px;max-width:68px;justify-content:center">';for(let d=0;d<O;d++)h+='<div class="bead-dot" style="width:14px;height:14px"></div>';h+='</div><label>×1</label></div>';}
  if(v===0) h+='<span style="font-size:40px">0️⃣</span>';
  h+=`</div>
  <div class="count-display">${v}</div>
  <div class="counter-name">${numName(v)}</div>
  <div class="count-row">
    <button class="count-btn btn-minus" onclick="addCnt(-1)" ${v<=0?'disabled':''}>－1</button>
    <button class="count-btn btn-plus"  onclick="addCnt(1)"  ${v>=1000?'disabled':''}>＋1</button>
  </div>
  <div class="count-row">
    <button class="count-btn btn-ten" onclick="addCnt(-10)" ${v<10?'disabled':''}>－10</button>
    <button class="count-btn btn-ten" onclick="addCnt(10)"  ${v>=990?'disabled':''}>＋10</button>
  </div>
  <div class="count-row">
    <button class="count-btn btn-hun" onclick="addCnt(-100)" ${v<100?'disabled':''}>－100</button>
    <button class="count-btn btn-hun" onclick="addCnt(100)"  ${v>=900?'disabled':''}>＋100</button>
  </div>`;
  document.getElementById('visual').innerHTML=h;
}
function addCnt(n){ countVal=Math.max(0,Math.min(1000,countVal+n)); renderBig(); }
function numName(v){
  if(lang==='en') return v===0?'zero':String(v);
  if(v===0)return 'れい'; if(v===1000)return 'せん';
  const O=['','いち','に','さん','し','ご','ろく','なな','はち','きゅう'];
  const TW=['','じゅう','にじゅう','さんじゅう','よんじゅう','ごじゅう','ろくじゅう','ななじゅう','はちじゅう','きゅうじゅう'];
  const HW=['','ひゃく','にひゃく','さんびゃく','よんひゃく','ごひゃく','ろっぴゃく','ななひゃく','はっぴゃく','きゅうひゃく'];
  const th=Math.floor(v/1000),h=Math.floor((v%1000)/100),t2=Math.floor((v%100)/10),o=v%10;
  let s=''; if(th)s+='せん'; if(h)s+=HW[h]; if(t2)s+=TW[t2]; if(o)s+=O[o]; return s;
}

// ===== ANSWERS =====
function buildAnswers(correct, mn, mx) {
  correctAns=correct; total++;
  let ch=new Set([correct]); let tr=0;
  while(ch.size<4&&tr<300){let v=rand(Math.max(mn,correct-4),Math.min(mx,correct+4));if(v!==correct&&v>=mn)ch.add(v);tr++;}
  let r=mn; while(ch.size<4){if(!ch.has(r))ch.add(r);r++;}
  shuffle([...ch]).slice(0,4).forEach(v=>{
    const b=document.createElement('button'); b.className='ans-btn'; b.textContent=v;
    b.onclick=()=>checkAns(v,b); document.getElementById('answers').appendChild(b);
  });
}
function checkAns(v, btn) {
  if (answered) return; answered=true; clearTimer();
  const ok = v===correctAns;
  const fb = document.getElementById('feedback');
  if (ok) {
    btn.classList.add('correct'); fb.textContent=t().correct; fb.className='feedback ok';
    score++; document.getElementById('score').textContent=score;
    playSound('correct');
    // mini icon bounce
    const acc=DB.current(); const cv=document.getElementById('miniIconCanvas');
    if(acc&&cv){ICONS.startAnim(cv,acc.iconId);setTimeout(()=>ICONS.staticDraw(cv,acc.iconId),1200);}
  } else {
    btn.classList.add('wrong'); fb.textContent=t().wrong(correctAns); fb.className='feedback ng';
    document.querySelectorAll('.ans-btn').forEach(b=>{if(+b.textContent===correctAns)b.classList.add('correct');});
    playSound('wrong');
  }
  history.push({mode,correct:ok});
  document.getElementById('nextBtn').style.display='block';
}

// ===== RESULT =====
function showResult() {
  clearTimer();
  const d=DIFF[diff];
  const earned = score + (score===total ? d.bonusSeals : 0);
  // Save to account
  const acc=DB.current();
  if (acc) {
    acc.pendingSeals += earned;
    acc.sealCount    += earned;
    // stats
    acc.stats.totalCorrect += score;
    acc.stats.totalQ += total;
    history.forEach(h=>{
      const k=String(h.mode);
      if(!acc.stats.byMode[k]) acc.stats.byMode[k]={c:0,t:0};
      acc.stats.byMode[k].t++;
      if(h.correct) acc.stats.byMode[k].c++;
    });
    DB.update({pendingSeals:acc.pendingSeals, sealCount:acc.sealCount, stats:acc.stats});
  }

  const pct=score/total;
  const tl=t();
  // result icon (animated if perfect)
  const rv = document.getElementById('resultIconCanvas');
  if (acc && rv) {
    if (pct===1) ICONS.startAnim(rv, acc.iconId);
    else ICONS.staticDraw(rv, acc.iconId);
  }
  document.getElementById('rTitle').textContent = pct===1?tl.resultGreat:pct>=.6?tl.resultGood:tl.resultOk;
  document.getElementById('rScore').textContent = tl.scoreMsg(score,total);
  document.getElementById('rSeal').innerHTML =
    `<div>${tl.sealGet(earned)}</div><div class="big">🎯 ×${earned}</div>
     <div style="font-size:12px;color:#888">${lang==='ja'?'もっているシール':'Available'}: ${acc?acc.pendingSeals:0}まい</div>`;

  // bars
  const mh={};
  history.forEach(h=>{if(!mh[h.mode])mh[h.mode]={c:0,t:0};mh[h.mode].t++;if(h.correct)mh[h.mode].c++;});
  let bh=`<div style="font-size:14px;font-weight:bold;margin-bottom:6px;color:#555">${tl.accuracy}</div>`;
  Object.keys(mh).forEach(m=>{
    const{c,t:tt}=mh[m],p=Math.round(c/tt*100);
    bh+=`<div class="bar-row"><div class="bar-label">${tl.modes[m]} ${c}/${tt}</div>
      <div class="bar-track"><div class="bar-fill" style="width:0%" data-w="${p}%"></div></div></div>`;
  });
  document.getElementById('rBars').innerHTML=bh;
  if(pct===1) confetti();
  showScreen('sResult');
  setTimeout(()=>document.querySelectorAll('.bar-fill').forEach(b=>b.style.width=b.dataset.w),150);
}