// auth.js — ログイン・アカウント登録画面の制御

let selectedIconId = 0;
let loginPinVal  = '';
let signupPinVal = '';

// ===== INIT =====
window.addEventListener('DOMContentLoaded', () => {
  // Splash
  setTimeout(() => {
    document.getElementById('splash').classList.remove('active');
  }, 1200);

  buildPinPad('loginPin',  v => { loginPinVal  = v; });
  buildPinPad('signupPin', v => { signupPinVal = v; });
  buildIconGrid();
  refreshAccountList();

  // Redirect if already logged in
  const acc = DB.current();
  if (acc) window.location.href = 'game.html';
});

// ===== TABS =====
function switchTab(tab) {
  document.getElementById('formLogin').style.display  = tab==='login'  ? 'flex':'none';
  document.getElementById('formSignup').style.display = tab==='signup' ? 'flex':'none';
  document.getElementById('tabLogin').classList.toggle('active',  tab==='login');
  document.getElementById('tabSignup').classList.toggle('active', tab==='signup');
  document.getElementById('loginErr').textContent  = '';
  document.getElementById('signupErr').textContent = '';
}

// ===== PIN PAD =====
function buildPinPad(containerId, onChange) {
  const wrap = document.getElementById(containerId);
  // 4 dot display
  const dotsDiv = document.createElement('div');
  dotsDiv.className = 'pin-row';
  const dots = [];
  for (let i=0; i<4; i++) {
    const d = document.createElement('button');
    d.className = 'pin-dot';
    d.type = 'button';
    d.addEventListener('click', () => {
      // cycle 0-9 on tap (simple approach for kids)
    });
    dots.push(d);
    dotsDiv.appendChild(d);
  }

  // Numpad
  const numpad = document.createElement('div');
  numpad.className = 'numpad';
  let pinVal = '';

  function refresh() {
    dots.forEach((d, i) => {
      d.classList.toggle('filled', i < pinVal.length);
      d.textContent = i < pinVal.length ? '●' : '';
    });
    onChange(pinVal);
  }

  [1,2,3,4,5,6,7,8,9,'',0,'⌫'].forEach(v => {
    const btn = document.createElement('button');
    btn.className = 'np-btn' + (v==='⌫'?' np-del':'');
    btn.type = 'button';
    btn.textContent = v === '' ? '' : v;
    btn.disabled = v === '';
    btn.addEventListener('click', () => {
      if (v === '⌫') { pinVal = pinVal.slice(0,-1); }
      else if (typeof v === 'number' && pinVal.length < 4) { pinVal += String(v); }
      refresh();
    });
    numpad.appendChild(btn);
  });

  wrap.appendChild(dotsDiv);
  wrap.appendChild(numpad);
}

// ===== ICON GRID =====
function buildIconGrid() {
  const grid = document.getElementById('iconGrid');
  ICONS.getAll().forEach(ch => {
    const cell = document.createElement('div');
    cell.className = 'icon-cell' + (ch.id===0?' selected':'');
    const canvas = document.createElement('canvas');
    canvas.width = 56; canvas.height = 56;
    cell.appendChild(canvas);
    cell.title = ch.name;
    cell.addEventListener('click', () => {
      selectedIconId = ch.id;
      document.querySelectorAll('#iconGrid .icon-cell').forEach(c=>c.classList.remove('selected'));
      cell.classList.add('selected');
      // update preview
      const prev = document.getElementById('previewCanvas');
      ICONS.startAnim(prev, ch.id);
    });
    grid.appendChild(cell);
    ICONS.staticDraw(canvas, ch.id);
  });
  // initial preview
  ICONS.startAnim(document.getElementById('previewCanvas'), 0);
}

// ===== ACCOUNT LIST =====
function refreshAccountList() {
  const accounts = DB.getAll();
  const wrap = document.getElementById('accountListWrap');
  const list = document.getElementById('accountList');
  list.innerHTML = '';
  if (!accounts.length) { wrap.style.display='none'; return; }
  wrap.style.display = 'block';
  accounts.forEach(acc => {
    const card = document.createElement('div');
    card.className = 'account-card';
    const iconWrap = document.createElement('div');
    iconWrap.className = 'account-card-icon';
    const cv = document.createElement('canvas');
    cv.width=48; cv.height=48;
    iconWrap.appendChild(cv);
    ICONS.staticDraw(cv, acc.iconId);

    const info = document.createElement('div');
    info.innerHTML = `<div class="account-card-name">${escHtml(acc.name)}</div>
      <div class="account-card-info">シール ${acc.sealGrid.filter(x=>x!==null).length}/100</div>`;
    card.appendChild(iconWrap);
    card.appendChild(info);
    card.addEventListener('click', () => quickLogin(acc.id));
    list.appendChild(card);
  });
}

// Quick login (tap account → ask pin)
function quickLogin(id) {
  const pin = prompt('パスワード（4けた）をいれてね');
  if (pin === null) return;
  const res = DB.loginById(id, pin);
  if (!res.ok) { alert(res.msg); return; }
  window.location.href = 'game.html';
}

// ===== LOGIN =====
function doLogin() {
  const name = document.getElementById('loginName').value.trim();
  const errEl = document.getElementById('loginErr');
  if (!name) { errEl.textContent = 'なまえをいれてね'; return; }
  if (loginPinVal.length < 4) { errEl.textContent = 'パスワードは4けただよ'; return; }
  const res = DB.login(name, loginPinVal);
  if (!res.ok) { errEl.textContent = res.msg; return; }
  window.location.href = 'game.html';
}

// ===== SIGNUP =====
function doSignup() {
  const name = document.getElementById('signupName').value.trim();
  const errEl = document.getElementById('signupErr');
  if (!name) { errEl.textContent = 'なまえをいれてね'; return; }
  if (name.length > 10) { errEl.textContent = 'なまえは10もじいないにしてね'; return; }
  if (signupPinVal.length < 4) { errEl.textContent = 'パスワードは4けただよ'; return; }
  const res = DB.createAccount(name, signupPinVal, selectedIconId);
  if (!res.ok) { errEl.textContent = res.msg; return; }
  // Auto login
  DB.login(name, signupPinVal);
  window.location.href = 'game.html';
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}