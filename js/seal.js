// seal.js — シール台紙・すごろく管理

const SEAL = (() => {
  const STICKER_OPTS = ['⭐','🌟','💖','🌈','🎀','🦋','🌸','🍀','🎵','🐥',
                        '🍭','🎈','🐱','🦊','🐸','🌙','🍎','⚽','🎠','🏆'];

  const PRIZES = {
    10: {icon:'🎀', ja:{t:'10マスたっせい！', d:'すごい！りぼんのトロフィーだよ！'}, en:{t:'10 squares!', d:'You got a ribbon trophy!'}},
    20: {icon:'🏅', ja:{t:'20マスたっせい！', d:'メダルをもらったよ！'},              en:{t:'20 squares!', d:'A shiny medal for you!'}},
    30: {icon:'🎖️',ja:{t:'30マスたっせい！', d:'どんどんすすんでるね！'},             en:{t:'30 squares!', d:'Keep it up!'}},
    40: {icon:'🌈', ja:{t:'40マスたっせい！', d:'にじがでたよ！'},                    en:{t:'40 squares!', d:'A rainbow appeared!'}},
    50: {icon:'🎂', ja:{t:'ちょうどはんぶん！',d:'50マス！ケーキでおいわい！'},        en:{t:'Halfway!',    d:'50 squares! Cake time!'}},
    60: {icon:'🚀', ja:{t:'60マスたっせい！', d:'ロケットみたいにとんでる！'},         en:{t:'60 squares!', d:'Soaring like a rocket!'}},
    70: {icon:'💎', ja:{t:'70マスたっせい！', d:'ダイヤモンドだよ！きらきら！'},       en:{t:'70 squares!', d:'You\'re a diamond!'}},
    80: {icon:'👑', ja:{t:'80マスたっせい！', d:'おうかんをかぶろう！'},               en:{t:'80 squares!', d:'Wear the crown!'}},
    90: {icon:'🌟', ja:{t:'90マスたっせい！', d:'ゴールまであとすこし！'},             en:{t:'90 squares!', d:'Almost there!'}},
   100: {icon:'🏆', ja:{t:'100マスぜんぶうめた！！', d:'さいこう！！おめでとう！'},   en:{t:'All 100 squares!!', d:'PERFECT! Congratulations!'}},
  };

  let selectedSticker = '⭐';
  let currentLang = 'ja';

  function setLang(l) { currentLang = l; }

  function buildStickerPicker() {
    const el = document.getElementById('stickerPicker');
    el.innerHTML = STICKER_OPTS.map(s =>
      `<span class="sticker-opt${s===selectedSticker?' selected':''}"
        onclick="SEAL.selectSticker('${s}',this)">${s}</span>`
    ).join('');
  }

  function selectSticker(s, el) {
    selectedSticker = s;
    document.querySelectorAll('.sticker-opt').forEach(e => e.classList.remove('selected'));
    el.classList.add('selected');
  }

  function renderBoard(sealGrid, pendingSeals, milestones) {
    const grid = document.getElementById('boardGrid');
    // snake order: row0 = sq91-100 L→R, row1 = sq81-90 R→L …
    const order = [];
    for (let row = 0; row < 10; row++) {
      const base = 90 - row*10;
      if (row % 2 === 0) for(let i=base; i<base+10; i++) order.push(i);
      else               for(let i=base+9; i>=base; i--) order.push(i);
    }
    grid.innerHTML = '';
    order.forEach(idx => {
      const sq = idx + 1;
      const isMilestone = sq % 10 === 0;
      const sticker = sealGrid[idx];
      const canPlace = pendingSeals > 0 && sticker === null;
      const div = document.createElement('div');
      div.className = 'cell' +
        (isMilestone ? ' milestone' : ' empty') +
        (sticker ? ' filled' : '') +
        (canPlace ? ' clickable' : '');
      let inner = `<span class="cell-num">${sq}</span>`;
      if (sticker) inner += `<span class="sticker-face">${sticker}</span>`;
      else if (isMilestone) {
        const pr = PRIZES[sq];
        inner += `<span class="milestone-icon">${pr ? pr.icon : '🎁'}</span>`;
      }
      div.innerHTML = inner;
      if (canPlace) div.onclick = () => SEAL.placeSticker(idx);
      grid.appendChild(div);
    });
  }

  function placeSticker(idx) {
    const acc = DB.current();
    if (!acc || acc.pendingSeals <= 0 || acc.sealGrid[idx] !== null) return;
    acc.sealGrid[idx] = selectedSticker;
    acc.pendingSeals--;
    const sq = idx + 1;
    // milestone check
    let prizeShown = false;
    if (sq % 10 === 0 && PRIZES[sq] && !acc.milestones[sq]) {
      acc.milestones[sq] = true;
      prizeShown = true;
    }
    DB.update({ sealGrid: acc.sealGrid, pendingSeals: acc.pendingSeals, milestones: acc.milestones });
    // re-render
    const placed = acc.sealGrid.filter(x=>x!==null).length;
    updateSealStats(placed, acc.pendingSeals);
    renderBoard(acc.sealGrid, acc.pendingSeals, acc.milestones);
    document.getElementById('peekCount').textContent = placed;
    document.getElementById('userSeals').textContent = acc.sealCount;

    if (prizeShown) {
      const pr = PRIZES[sq];
      const p = currentLang === 'ja' ? pr.ja : pr.en;
      setTimeout(() => showPrize(pr.icon, p.t, p.d), 200);
    }
  }

  function updateSealStats(placed, pending) {
    const acc = DB.current();
    if (!acc) return;
    const txt = currentLang === 'ja'
      ? `はったシール：${placed}まい ／ もっているシール：${pending}まい`
      : `Placed: ${placed} ／ Available: ${pending}`;
    document.getElementById('sealTotal').textContent = txt;
  }

  function showSealScreen(lang) {
    currentLang = lang;
    const acc = DB.current();
    if (!acc) return;
    buildStickerPicker();
    const placed = acc.sealGrid.filter(x=>x!==null).length;
    updateSealStats(placed, acc.pendingSeals);
    renderBoard(acc.sealGrid, acc.pendingSeals, acc.milestones);

    document.getElementById('sealInfo').textContent =
      lang==='ja' ? 'シールをえらんでマスをタップ！' : 'Pick a sticker, tap a square!';
    document.getElementById('sealTitle').textContent =
      lang==='ja' ? '🎯 シールちょう' : '🎯 Sticker Book';
  }

  function showPrize(icon, title, desc) {
    document.getElementById('prizeIcon').textContent = icon;
    document.getElementById('prizeTitle').textContent = title;
    document.getElementById('prizeDesc').textContent  = desc;
    document.getElementById('prizeOverlay').classList.add('show');
    playSound('prize');
    confetti();
  }

  return { selectSticker, placeSticker, showSealScreen, showPrize, updateSealStats };
})();

function closePrize() {
  document.getElementById('prizeOverlay').classList.remove('show');
}