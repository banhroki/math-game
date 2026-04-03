/**
 * icons.js
 * 20種の擬人化キャラクターをCanvasに描画する。
 * 各キャラ：目・口・手足（一部）・独自カラーを持つ。
 * タップ時アニメーション対応。
 */

const ICONS = (() => {
  // キャラ定義
  const chars = [
    { id:0,  name:'タマゴくん',   bg:'#fffde7', body:'#fff9c4', accent:'#f9a825', draw: drawEgg      },
    { id:1,  name:'リンゴちゃん', bg:'#ffebee', body:'#ef9a9a', accent:'#b71c1c', draw: drawApple    },
    { id:2,  name:'ほしくん',     bg:'#fffde7', body:'#ffee58', accent:'#f57f17', draw: drawStar     },
    { id:3,  name:'うみちゃん',   bg:'#e3f2fd', body:'#64b5f6', accent:'#0d47a1', draw: drawWave     },
    { id:4,  name:'もりくん',     bg:'#e8f5e9', body:'#66bb6a', accent:'#1b5e20', draw: drawTree     },
    { id:5,  name:'ひよこちゃん', bg:'#fffde7', body:'#ffee58', accent:'#f57f17', draw: drawChick    },
    { id:6,  name:'くもくん',     bg:'#e3f2fd', body:'#b3e5fc', accent:'#0288d1', draw: drawCloud    },
    { id:7,  name:'にじちゃん',   bg:'#fce4ec', body:'#f48fb1', accent:'#880e4f', draw: drawRainbow  },
    { id:8,  name:'ゆきくん',     bg:'#e8eaf6', body:'#c5cae9', accent:'#283593', draw: drawSnow     },
    { id:9,  name:'たいようくん', bg:'#fff8e1', body:'#ffca28', accent:'#e65100', draw: drawSun      },
    { id:10, name:'ロケットくん', bg:'#fce4ec', body:'#f06292', accent:'#880e4f', draw: drawRocket   },
    { id:11, name:'さかなちゃん', bg:'#e0f7fa', body:'#4dd0e1', accent:'#006064', draw: drawFish     },
    { id:12, name:'かぼちゃくん', bg:'#fff3e0', body:'#ff9800', accent:'#e65100', draw: drawPumpkin  },
    { id:13, name:'ケーキちゃん', bg:'#fce4ec', body:'#f8bbd0', accent:'#c2185b', draw: drawCake     },
    { id:14, name:'ダイヤくん',   bg:'#e3f2fd', body:'#42a5f5', accent:'#0d47a1', draw: drawDiamond  },
    { id:15, name:'キノコちゃん', bg:'#ffebee', body:'#ef5350', accent:'#b71c1c', draw: drawMushroom },
    { id:16, name:'まほうくん',   bg:'#f3e5f5', body:'#ce93d8', accent:'#4a148c', draw: drawMagic    },
    { id:17, name:'ハートちゃん', bg:'#fce4ec', body:'#f06292', accent:'#880e4f', draw: drawHeart    },
    { id:18, name:'かみなりくん', bg:'#fffde7', body:'#ffee58', accent:'#f57f17', draw: drawThunder  },
    { id:19, name:'おにぎりくん', bg:'#e8f5e9', body:'#ffffff', accent:'#212121', draw: drawOnigiri  },
  ];

  // ===== 共通描画ヘルパー =====
  function eye(ctx, x, y, r, blink) {
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.ellipse(x, y, r, blink ? r*0.1 : r, 0, 0, Math.PI*2); ctx.fill();
    if (!blink) {
      ctx.fillStyle = '#222';
      ctx.beginPath(); ctx.ellipse(x, y+r*0.1, r*0.55, r*0.55, 0, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.ellipse(x+r*0.2, y-r*0.1, r*0.2, r*0.2, 0, 0, Math.PI*2); ctx.fill();
    }
  }
  function mouth(ctx, x, y, w, happy) {
    ctx.strokeStyle = '#333'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
    ctx.beginPath();
    if (happy) {
      ctx.arc(x, y - w*0.3, w*0.5, 0.2, Math.PI-0.2); ctx.stroke();
    } else {
      ctx.arc(x, y + w*0.3, w*0.5, Math.PI+0.2, -0.2); ctx.stroke();
    }
  }
  function blush(ctx, x, y, r) {
    ctx.fillStyle = 'rgba(255,100,100,0.22)';
    ctx.beginPath(); ctx.ellipse(x, y, r, r*0.6, 0, 0, Math.PI*2); ctx.fill();
  }
  function arm(ctx, x, y, angle, len, color) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
    ctx.strokeStyle = color; ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0, len); ctx.stroke();
    // hand (small circle)
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(0, len, 4, 0, Math.PI*2); ctx.fill();
    ctx.restore();
  }

  // ===== DRAW FUNCTIONS =====
  function drawEgg(ctx, s, anim) {
    const cx=s/2, cy=s/2, rx=s*0.3, ry=s*0.38;
    const wave = anim ? Math.sin(Date.now()*0.008)*4 : 0;
    ctx.save(); ctx.translate(0, wave);
    ctx.fillStyle = '#fff9c4'; ctx.strokeStyle = '#f9a825'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(cx, cy+ry*0.08, rx, ry, 0, 0, Math.PI*2);
    ctx.fill(); ctx.stroke();
    blush(ctx, cx-rx*0.55, cy+ry*0.1, rx*0.28);
    blush(ctx, cx+rx*0.55, cy+ry*0.1, rx*0.28);
    eye(ctx, cx-rx*0.38, cy-ry*0.1, rx*0.18, false);
    eye(ctx, cx+rx*0.38, cy-ry*0.1, rx*0.18, false);
    mouth(ctx, cx, cy+ry*0.3, rx*0.7, true);
    // arms
    arm(ctx, cx-rx*0.85, cy+ry*0.05, anim?-0.6:-0.3, s*0.16, '#f9a825');
    arm(ctx, cx+rx*0.85, cy+ry*0.05, anim?0.6:0.3,   s*0.16, '#f9a825');
    ctx.restore();
  }

  function drawApple(ctx, s, anim) {
    const cx=s/2, cy=s*0.54;
    const bounce = anim ? Math.abs(Math.sin(Date.now()*0.01))*6 : 0;
    ctx.save(); ctx.translate(0, -bounce);
    // stem
    ctx.strokeStyle = '#5d4037'; ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(cx, cy-s*0.35); ctx.quadraticCurveTo(cx+s*0.1, cy-s*0.46, cx+s*0.04, cy-s*0.42); ctx.stroke();
    // leaf
    ctx.fillStyle = '#43a047';
    ctx.beginPath(); ctx.ellipse(cx+s*0.08, cy-s*0.4, s*0.1, s*0.06, -0.5, 0, Math.PI*2); ctx.fill();
    // body
    ctx.fillStyle = '#ef9a9a'; ctx.strokeStyle = '#b71c1c'; ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy-s*0.3);
    ctx.bezierCurveTo(cx+s*0.38, cy-s*0.3, cx+s*0.38, cy+s*0.32, cx, cy+s*0.32);
    ctx.bezierCurveTo(cx-s*0.38, cy+s*0.32, cx-s*0.38, cy-s*0.3, cx, cy-s*0.3);
    ctx.fill(); ctx.stroke();
    blush(ctx, cx-s*0.22, cy+s*0.04, s*0.1);
    blush(ctx, cx+s*0.22, cy+s*0.04, s*0.1);
    eye(ctx, cx-s*0.13, cy-s*0.06, s*0.09, false);
    eye(ctx, cx+s*0.13, cy-s*0.06, s*0.09, false);
    mouth(ctx, cx, cy+s*0.12, s*0.22, true);
    arm(ctx, cx-s*0.34, cy+s*0.0, anim?-0.7:-0.3, s*0.14, '#ef9a9a');
    arm(ctx, cx+s*0.34, cy+s*0.0, anim?0.7:0.3,   s*0.14, '#ef9a9a');
    ctx.restore();
  }

  function drawStar(ctx, s, anim) {
    const cx=s/2, cy=s/2;
    const rot = anim ? Date.now()*0.004 : 0;
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
    // star shape
    ctx.fillStyle = '#ffee58'; ctx.strokeStyle = '#f57f17'; ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i=0;i<5;i++) {
      const a1 = (i*2*Math.PI/5) - Math.PI/2;
      const a2 = a1 + Math.PI/5;
      const r1=s*0.4, r2=s*0.18;
      if(i===0) ctx.moveTo(Math.cos(a1)*r1, Math.sin(a1)*r1);
      else ctx.lineTo(Math.cos(a1)*r1, Math.sin(a1)*r1);
      ctx.lineTo(Math.cos(a2)*r2, Math.sin(a2)*r2);
    }
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.rotate(-rot); // unrotate face
    blush(ctx, -s*0.16, s*0.04, s*0.08);
    blush(ctx, s*0.16, s*0.04, s*0.08);
    eye(ctx, -s*0.1, -s*0.04, s*0.085, false);
    eye(ctx, s*0.1, -s*0.04, s*0.085, false);
    mouth(ctx, 0, s*0.14, s*0.2, true);
    ctx.restore();
  }

  function drawWave(ctx, s, anim) {
    const cx=s/2, cy=s/2;
    const t2 = anim ? Date.now()*0.006 : 0;
    // body (teardrop/droplet)
    ctx.fillStyle = '#64b5f6'; ctx.strokeStyle = '#0d47a1'; ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy-s*0.38);
    ctx.bezierCurveTo(cx+s*0.38, cy-s*0.1, cx+s*0.38, cy+s*0.32, cx, cy+s*0.38);
    ctx.bezierCurveTo(cx-s*0.38, cy+s*0.32, cx-s*0.38, cy-s*0.1, cx, cy-s*0.38);
    ctx.fill(); ctx.stroke();
    // wave on body
    ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx-s*0.2, cy+s*0.1);
    for(let x=0;x<=s*0.4;x+=2) ctx.lineTo(cx-s*0.2+x, cy+s*0.1+Math.sin((x*0.2)+t2)*4);
    ctx.stroke();
    blush(ctx, cx-s*0.22, cy+s*0.02, s*0.1);
    blush(ctx, cx+s*0.22, cy+s*0.02, s*0.1);
    eye(ctx, cx-s*0.12, cy-s*0.08, s*0.09, false);
    eye(ctx, cx+s*0.12, cy-s*0.08, s*0.09, false);
    mouth(ctx, cx, cy+s*0.18, s*0.22, true);
  }

  function drawTree(ctx, s, anim) {
    const cx=s/2;
    const sway = anim ? Math.sin(Date.now()*0.006)*3 : 0;
    ctx.save(); ctx.translate(sway, 0);
    // trunk
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(cx-s*0.07, s*0.68, s*0.14, s*0.28);
    // foliage circles
    [[0,-0.12,0.32],[cx-s*0.16,s*0.42,s*0.22],[cx+s*0.16,s*0.42,s*0.22]].forEach((_,i)=>{
      ctx.fillStyle = ['#2e7d32','#388e3c','#43a047'][i] || '#43a047';
    });
    [0,1,2].forEach(i=>{
      const offsets = [[cx,s*0.3,s*0.32],[cx-s*0.17,s*0.44,s*0.22],[cx+s*0.17,s*0.44,s*0.22]];
      ctx.fillStyle = ['#2e7d32','#388e3c','#43a047'][i];
      ctx.strokeStyle = '#1b5e20'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(offsets[i][0],offsets[i][1],offsets[i][2],0,Math.PI*2);
      ctx.fill(); ctx.stroke();
    });
    blush(ctx, cx-s*0.12, s*0.3, s*0.09);
    blush(ctx, cx+s*0.12, s*0.3, s*0.09);
    eye(ctx, cx-s*0.1, s*0.22, s*0.085, false);
    eye(ctx, cx+s*0.1, s*0.22, s*0.085, false);
    mouth(ctx, cx, s*0.36, s*0.2, true);
    ctx.restore();
  }

  function drawChick(ctx, s, anim) {
    const cx=s/2, cy=s/2;
    const hop = anim ? -Math.abs(Math.sin(Date.now()*0.012))*8 : 0;
    ctx.save(); ctx.translate(0, hop);
    // body
    ctx.fillStyle = '#ffee58'; ctx.strokeStyle = '#f9a825'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.ellipse(cx, cy+s*0.08, s*0.3, s*0.28, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    // head
    ctx.beginPath(); ctx.arc(cx, cy-s*0.18, s*0.22, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    // beak
    ctx.fillStyle = '#ff9800';
    ctx.beginPath(); ctx.moveTo(cx, cy-s*0.1); ctx.lineTo(cx+s*0.16, cy-s*0.12); ctx.lineTo(cx, cy-s*0.16); ctx.closePath(); ctx.fill();
    // wings
    ctx.fillStyle = '#ffd600';
    ctx.beginPath(); ctx.ellipse(cx-s*0.28, cy+s*0.1, s*0.1, s*0.16, -0.4, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx+s*0.28, cy+s*0.1, s*0.1, s*0.16, 0.4, 0, Math.PI*2); ctx.fill();
    // feet
    ctx.strokeStyle = '#ff9800'; ctx.lineWidth = 2.5;
    [cx-s*0.1, cx+s*0.1].forEach(x => {
      ctx.beginPath(); ctx.moveTo(x, cy+s*0.34); ctx.lineTo(x-s*0.06, cy+s*0.44); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, cy+s*0.34); ctx.lineTo(x+s*0.06, cy+s*0.44); ctx.stroke();
    });
    blush(ctx, cx-s*0.12, cy-s*0.18, s*0.08);
    blush(ctx, cx+s*0.12, cy-s*0.18, s*0.08);
    eye(ctx, cx-s*0.08, cy-s*0.22, s*0.07, false);
    eye(ctx, cx+s*0.08, cy-s*0.22, s*0.07, false);
    ctx.restore();
  }

  function drawCloud(ctx, s, anim) {
    const cx=s/2, cy=s/2;
    const drift = anim ? Math.sin(Date.now()*0.005)*5 : 0;
    ctx.save(); ctx.translate(drift, 0);
    ctx.fillStyle = '#e1f5fe'; ctx.strokeStyle = '#0288d1'; ctx.lineWidth = 2.5;
    const puffs = [[cx,cy,s*0.28],[cx-s*0.2,cy+s*0.06,s*0.2],[cx+s*0.2,cy+s*0.06,s*0.2],
                   [cx-s*0.1,cy-s*0.14,s*0.18],[cx+s*0.1,cy-s*0.14,s*0.18]];
    puffs.forEach(([px,py,pr]) => {ctx.beginPath();ctx.arc(px,py,pr,0,Math.PI*2);ctx.fill();});
    puffs.forEach(([px,py,pr]) => {ctx.beginPath();ctx.arc(px,py,pr,0,Math.PI*2);ctx.stroke();});
    blush(ctx, cx-s*0.14, cy+s*0.06, s*0.08);
    blush(ctx, cx+s*0.14, cy+s*0.06, s*0.08);
    eye(ctx, cx-s*0.1, cy-s*0.02, s*0.08, false);
    eye(ctx, cx+s*0.1, cy-s*0.02, s*0.08, false);
    mouth(ctx, cx, cy+s*0.14, s*0.2, true);
    ctx.restore();
  }

  function drawRainbow(ctx, s, anim) {
    const cx=s/2, cy=s*0.56;
    const pulse = anim ? 1+Math.sin(Date.now()*0.01)*0.05 : 1;
    ctx.save(); ctx.translate(cx, cy); ctx.scale(pulse, pulse); ctx.translate(-cx, -cy);
    const colors = ['#f44336','#ff9800','#ffee58','#66bb6a','#42a5f5','#7e57c2'];
    colors.forEach((c,i) => {
      ctx.strokeStyle = c; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(cx, cy+s*0.06, s*(0.38-i*0.05), Math.PI, 0); ctx.stroke();
    });
    // face on arc
    blush(ctx, cx-s*0.14, cy-s*0.06, s*0.09);
    blush(ctx, cx+s*0.14, cy-s*0.06, s*0.09);
    eye(ctx, cx-s*0.1, cy-s*0.14, s*0.08, false);
    eye(ctx, cx+s*0.1, cy-s*0.14, s*0.08, false);
    mouth(ctx, cx, cy-s*0.0, s*0.2, true);
    // clouds at base
    ctx.fillStyle = '#fff'; ctx.strokeStyle = '#aaa'; ctx.lineWidth = 1.5;
    [cx-s*0.36, cx+s*0.36-s*0.14].forEach(bx => {
      [0,0.06,-0.06].forEach(off => {ctx.beginPath();ctx.arc(bx+off*s,cy+s*0.06,s*0.1,0,Math.PI*2);ctx.fill();ctx.stroke();});
    });
    ctx.restore();
  }

  function drawSnow(ctx, s, anim) {
    const cx=s/2, cy=s/2;
    const rot = anim ? Date.now()*0.002 : 0;
    // body
    ctx.fillStyle = '#c5cae9'; ctx.strokeStyle = '#283593'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(cx, cy, s*0.36, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    // snowflake spokes
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
    ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 2;
    for(let i=0;i<6;i++){
      ctx.save(); ctx.rotate(i*Math.PI/3);
      ctx.beginPath(); ctx.moveTo(0,-s*0.3); ctx.lineTo(0,s*0.3); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-s*0.1,-s*0.18); ctx.lineTo(0,-s*0.24); ctx.lineTo(s*0.1,-s*0.18); ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
    blush(ctx, cx-s*0.16, cy+s*0.06, s*0.09);
    blush(ctx, cx+s*0.16, cy+s*0.06, s*0.09);
    eye(ctx, cx-s*0.12, cy-s*0.06, s*0.09, false);
    eye(ctx, cx+s*0.12, cy-s*0.06, s*0.09, false);
    mouth(ctx, cx, cy+s*0.16, s*0.22, true);
  }

  function drawSun(ctx, s, anim) {
    const cx=s/2, cy=s/2;
    const rot = anim ? Date.now()*0.003 : 0;
    ctx.save(); ctx.translate(cx,cy); ctx.rotate(rot);
    // rays
    ctx.strokeStyle = '#ff8f00'; ctx.lineWidth = 3.5; ctx.lineCap = 'round';
    for(let i=0;i<8;i++){
      ctx.save(); ctx.rotate(i*Math.PI/4);
      ctx.beginPath(); ctx.moveTo(0,-s*0.3); ctx.lineTo(0,-s*0.42); ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
    ctx.fillStyle = '#ffca28'; ctx.strokeStyle = '#e65100'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(cx,cy,s*0.28,0,Math.PI*2); ctx.fill(); ctx.stroke();
    blush(ctx, cx-s*0.14, cy+s*0.06, s*0.09);
    blush(ctx, cx+s*0.14, cy+s*0.06, s*0.09);
    eye(ctx, cx-s*0.1, cy-s*0.06, s*0.09, false);
    eye(ctx, cx+s*0.1, cy-s*0.06, s*0.09, false);
    mouth(ctx, cx, cy+s*0.14, s*0.22, true);
  }

  function drawRocket(ctx, s, anim) {
    const cx=s/2;
    const fly = anim ? Math.sin(Date.now()*0.008)*4 : 0;
    ctx.save(); ctx.translate(0, fly);
    // body
    ctx.fillStyle = '#f06292'; ctx.strokeStyle = '#880e4f'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.roundRect(cx-s*0.14, s*0.22, s*0.28, s*0.46, s*0.08);
    ctx.fill(); ctx.stroke();
    // nose cone
    ctx.fillStyle = '#f48fb1';
    ctx.beginPath(); ctx.moveTo(cx, s*0.06); ctx.lineTo(cx-s*0.14, s*0.24); ctx.lineTo(cx+s*0.14, s*0.24); ctx.closePath(); ctx.fill(); ctx.stroke();
    // window
    ctx.fillStyle = '#e3f2fd'; ctx.strokeStyle = '#1565c0'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx, s*0.38, s*0.1, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    // face in window
    eye(ctx, cx-s*0.04, s*0.36, s*0.04, false);
    eye(ctx, cx+s*0.04, s*0.36, s*0.04, false);
    mouth(ctx, cx, s*0.42, s*0.1, true);
    // fins
    ctx.fillStyle = '#e91e63';
    ctx.beginPath(); ctx.moveTo(cx-s*0.14,s*0.56); ctx.lineTo(cx-s*0.28,s*0.68); ctx.lineTo(cx-s*0.14,s*0.68); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx+s*0.14,s*0.56); ctx.lineTo(cx+s*0.28,s*0.68); ctx.lineTo(cx+s*0.14,s*0.68); ctx.closePath(); ctx.fill();
    // flame
    if(anim) {
      ctx.fillStyle = '#ff9800';
      ctx.beginPath(); ctx.ellipse(cx, s*0.76, s*0.07, s*0.1, 0, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#ffee58';
      ctx.beginPath(); ctx.ellipse(cx, s*0.74, s*0.04, s*0.06, 0, 0, Math.PI*2); ctx.fill();
    }
    ctx.restore();
  }

  function drawFish(ctx, s, anim) {
    const cx=s/2, cy=s/2;
    const swim = anim ? Math.sin(Date.now()*0.008)*5 : 0;
    ctx.save(); ctx.translate(swim, 0);
    // tail
    ctx.fillStyle = '#00acc1'; ctx.strokeStyle = '#006064'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx+s*0.32,cy); ctx.lineTo(cx+s*0.46,cy-s*0.18); ctx.lineTo(cx+s*0.46,cy+s*0.18); ctx.closePath(); ctx.fill(); ctx.stroke();
    // body
    ctx.fillStyle = '#4dd0e1'; ctx.strokeStyle = '#006064'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.ellipse(cx, cy, s*0.34, s*0.22, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    // fin
    ctx.fillStyle = '#00bcd4';
    ctx.beginPath(); ctx.moveTo(cx,cy-s*0.22); ctx.quadraticCurveTo(cx-s*0.08,cy-s*0.36,cx+s*0.1,cy-s*0.22); ctx.fill();
    blush(ctx, cx-s*0.06, cy+s*0.06, s*0.07);
    eye(ctx, cx-s*0.18, cy-s*0.05, s*0.09, false);
    mouth(ctx, cx-s*0.06, cy+s*0.1, s*0.16, true);
    ctx.restore();
  }

  function drawPumpkin(ctx, s, anim) {
    const cx=s/2, cy=s*0.54;
    const bob = anim ? Math.abs(Math.sin(Date.now()*0.01))*5 : 0;
    ctx.save(); ctx.translate(0, -bob);
    // stem
    ctx.strokeStyle = '#5d4037'; ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(cx, cy-s*0.38); ctx.lineTo(cx, cy-s*0.46); ctx.stroke();
    // segments
    const segs = [[-s*0.2,s*0.3],[0,s*0.33],[s*0.2,s*0.3]];
    segs.forEach(([ox,ow]) => {
      ctx.fillStyle = '#ff9800'; ctx.strokeStyle = '#e65100'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(cx+ox, cy, ow*0.6, s*0.32, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    });
    blush(ctx, cx-s*0.18, cy+s*0.08, s*0.09);
    blush(ctx, cx+s*0.18, cy+s*0.08, s*0.09);
    eye(ctx, cx-s*0.13, cy-s*0.08, s*0.09, false);
    eye(ctx, cx+s*0.13, cy-s*0.08, s*0.09, false);
    mouth(ctx, cx, cy+s*0.14, s*0.22, true);
    ctx.restore();
  }

  function drawCake(ctx, s, anim) {
    const cx=s/2;
    const bounce = anim ? Math.abs(Math.sin(Date.now()*0.01))*4 : 0;
    ctx.save(); ctx.translate(0, -bounce);
    // cake body
    ctx.fillStyle = '#f8bbd0'; ctx.strokeStyle = '#c2185b'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.roundRect(cx-s*0.3, s*0.44, s*0.6, s*0.38, [0,0,s*0.08,s*0.08]); ctx.fill(); ctx.stroke();
    // frosting top
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.roundRect(cx-s*0.3, s*0.38, s*0.6, s*0.12, s*0.06); ctx.fill(); ctx.stroke();
    // drips
    ctx.fillStyle = '#f48fb1';
    [-s*0.16, 0, s*0.16].forEach(ox => {
      ctx.beginPath(); ctx.ellipse(cx+ox, s*0.5, s*0.05, s*0.07, 0, 0, Math.PI*2); ctx.fill();
    });
    // candle
    ctx.fillStyle = '#ffee58'; ctx.strokeStyle = '#f9a825'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(cx-s*0.04, s*0.22, s*0.08, s*0.18, s*0.04); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ff9800';
    ctx.beginPath(); ctx.ellipse(cx, s*0.21, s*0.04, s*0.07, 0, 0, Math.PI*2); ctx.fill();
    // face
    blush(ctx, cx-s*0.14, s*0.58, s*0.09);
    blush(ctx, cx+s*0.14, s*0.58, s*0.09);
    eye(ctx, cx-s*0.1, s*0.5, s*0.08, false);
    eye(ctx, cx+s*0.1, s*0.5, s*0.08, false);
    mouth(ctx, cx, s*0.62, s*0.2, true);
    ctx.restore();
  }

  function drawDiamond(ctx, s, anim) {
    const cx=s/2, cy=s/2;
    const spin = anim ? Date.now()*0.003 : 0;
    ctx.save(); ctx.translate(cx,cy); ctx.rotate(Math.sin(spin)*0.15);
    ctx.fillStyle = '#42a5f5'; ctx.strokeStyle = '#0d47a1'; ctx.lineWidth = 2.5;
    // diamond shape
    ctx.beginPath();
    ctx.moveTo(0,-s*0.38); ctx.lineTo(s*0.3,-s*0.1); ctx.lineTo(0,s*0.4);
    ctx.lineTo(-s*0.3,-s*0.1); ctx.closePath(); ctx.fill(); ctx.stroke();
    // inner lines (facets)
    ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0,-s*0.38); ctx.lineTo(0,s*0.0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-s*0.3,-s*0.1); ctx.lineTo(s*0.3,-s*0.1); ctx.stroke();
    // face
    blush(ctx, -s*0.1, s*0.06, s*0.07);
    blush(ctx, s*0.1, s*0.06, s*0.07);
    eye(ctx, -s*0.08, -s*0.04, s*0.07, false);
    eye(ctx, s*0.08, -s*0.04, s*0.07, false);
    mouth(ctx, 0, s*0.14, s*0.18, true);
    ctx.restore();
  }

  function drawMushroom(ctx, s, anim) {
    const cx=s/2;
    const sway = anim ? Math.sin(Date.now()*0.008)*4 : 0;
    ctx.save(); ctx.translate(sway, 0);
    // stalk
    ctx.fillStyle = '#fff3e0'; ctx.strokeStyle = '#bcaaa4'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(cx-s*0.14, s*0.56, s*0.28, s*0.3, [0,0,s*0.08,s*0.08]); ctx.fill(); ctx.stroke();
    // cap
    ctx.fillStyle = '#ef5350'; ctx.strokeStyle = '#b71c1c'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(cx, s*0.42, s*0.34, Math.PI, 0); ctx.lineTo(cx+s*0.34, s*0.56);
    ctx.lineTo(cx-s*0.34, s*0.56); ctx.closePath(); ctx.fill(); ctx.stroke();
    // dots
    ctx.fillStyle = '#fff';
    [[cx-s*0.12,s*0.34],[cx+s*0.14,s*0.3],[cx,s*0.44],[cx-s*0.2,s*0.46]].forEach(([dx,dy]) => {
      ctx.beginPath(); ctx.arc(dx,dy,s*0.05,0,Math.PI*2); ctx.fill();
    });
    // face on stalk
    blush(ctx, cx-s*0.1, s*0.66, s*0.08);
    blush(ctx, cx+s*0.1, s*0.66, s*0.08);
    eye(ctx, cx-s*0.08, s*0.6, s*0.07, false);
    eye(ctx, cx+s*0.08, s*0.6, s*0.07, false);
    mouth(ctx, cx, s*0.72, s*0.18, true);
    ctx.restore();
  }

  function drawMagic(ctx, s, anim) {
    const cx=s/2, cy=s/2;
    const t2 = anim ? Date.now()*0.006 : 0;
    // wand
    ctx.strokeStyle = '#4a148c'; ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(cx-s*0.28, cy+s*0.3); ctx.lineTo(cx+s*0.18, cy-s*0.22); ctx.stroke();
    ctx.fillStyle = '#ffd600'; ctx.strokeStyle = '#ff9800'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx+s*0.2, cy-s*0.24, s*0.1, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    // sparkles
    const sparks = [[cx-s*0.1,cy-s*0.1],[cx+s*0.32,cy+s*0.1],[cx-s*0.28,cy+s*0.05]];
    sparks.forEach(([sx,sy],i) => {
      const a = t2+i*2;
      ctx.fillStyle = ['#ff9800','#7c4dff','#00e5ff'][i];
      ctx.beginPath(); ctx.arc(sx+Math.cos(a)*s*0.04, sy+Math.sin(a)*s*0.04, s*0.04, 0, Math.PI*2); ctx.fill();
    });
    // hat body
    ctx.fillStyle = '#7e57c2'; ctx.strokeStyle = '#4a148c'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(cx-s*0.26, s*0.36, s*0.52, s*0.08, s*0.04); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx-s*0.16,s*0.36); ctx.lineTo(cx,s*0.1); ctx.lineTo(cx+s*0.16,s*0.36); ctx.closePath(); ctx.fill(); ctx.stroke();
    // face
    blush(ctx, cx-s*0.1, s*0.56, s*0.08);
    blush(ctx, cx+s*0.1, s*0.56, s*0.08);
    eye(ctx, cx-s*0.09, s*0.5, s*0.08, false);
    eye(ctx, cx+s*0.09, s*0.5, s*0.08, false);
    mouth(ctx, cx, s*0.62, s*0.2, true);
  }

  function drawHeart(ctx, s, anim) {
    const cx=s/2, cy=s/2;
    const pulse = anim ? 1+Math.abs(Math.sin(Date.now()*0.012))*0.1 : 1;
    ctx.save(); ctx.translate(cx,cy); ctx.scale(pulse,pulse); ctx.translate(-cx,-cy);
    ctx.fillStyle = '#f06292'; ctx.strokeStyle = '#880e4f'; ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx,cy+s*0.3);
    ctx.bezierCurveTo(cx-s*0.5,cy,cx-s*0.5,cy-s*0.38,cx,cy-s*0.18);
    ctx.bezierCurveTo(cx+s*0.5,cy-s*0.38,cx+s*0.5,cy,cx,cy+s*0.3);
    ctx.fill(); ctx.stroke();
    blush(ctx, cx-s*0.14, cy+s*0.06, s*0.09);
    blush(ctx, cx+s*0.14, cy+s*0.06, s*0.09);
    eye(ctx, cx-s*0.1, cy-s*0.04, s*0.09, false);
    eye(ctx, cx+s*0.1, cy-s*0.04, s*0.09, false);
    mouth(ctx, cx, cy+s*0.18, s*0.22, true);
    ctx.restore();
  }

  function drawThunder(ctx, s, anim) {
    const cx=s/2, cy=s/2;
    const flash = anim && Math.sin(Date.now()*0.015)>0.7;
    ctx.fillStyle = flash ? '#fff176' : '#ffee58';
    ctx.strokeStyle = '#f57f17'; ctx.lineWidth = 2.5;
    // lightning bolt shape
    ctx.beginPath();
    ctx.moveTo(cx+s*0.08, s*0.08);
    ctx.lineTo(cx-s*0.1, cy+s*0.04);
    ctx.lineTo(cx+s*0.04, cy+s*0.04);
    ctx.lineTo(cx-s*0.08, s*0.9);
    ctx.lineTo(cx+s*0.2, cy-s*0.04);
    ctx.lineTo(cx+s*0.02, cy-s*0.04);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    blush(ctx, cx-s*0.02, cy+s*0.2, s*0.08);
    blush(ctx, cx+s*0.14, cy+s*0.2, s*0.08);
    eye(ctx, cx+s*0.0, cy+s*0.1, s*0.07, flash);
    eye(ctx, cx+s*0.14, cy+s*0.1, s*0.07, flash);
    mouth(ctx, cx+s*0.07, cy+s*0.24, s*0.18, !flash);
  }

  function drawOnigiri(ctx, s, anim) {
    const cx=s/2, cy=s*0.54;
    const bob = anim ? Math.sin(Date.now()*0.009)*4 : 0;
    ctx.save(); ctx.translate(0, -bob);
    // seaweed base
    ctx.fillStyle = '#212121'; ctx.strokeStyle = '#111'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(cx-s*0.26, cy+s*0.08, s*0.52, s*0.26, [0,0,s*0.1,s*0.1]); ctx.fill();
    // rice body
    ctx.fillStyle = '#fff'; ctx.strokeStyle = '#bbb'; ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx-s*0.3, cy+s*0.12);
    ctx.lineTo(cx-s*0.24, cy-s*0.24);
    ctx.quadraticCurveTo(cx, cy-s*0.42, cx+s*0.24, cy-s*0.24);
    ctx.lineTo(cx+s*0.3, cy+s*0.12);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    // salmon dot
    ctx.fillStyle = '#ff8a65'; ctx.strokeStyle = '#e64a19'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.ellipse(cx, cy-s*0.1, s*0.08, s*0.06, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    blush(ctx, cx-s*0.16, cy+s*0.02, s*0.09);
    blush(ctx, cx+s*0.16, cy+s*0.02, s*0.09);
    eye(ctx, cx-s*0.1, cy-s*0.06, s*0.08, false);
    eye(ctx, cx+s*0.1, cy-s*0.06, s*0.08, false);
    mouth(ctx, cx, cy+s*0.1, s*0.22, true);
    ctx.restore();
  }

  // ===== PUBLIC API =====
  function draw(ctx, id, size, anim=false) {
    const ch = chars.find(c=>c.id===id);
    if (!ch) return;
    ctx.clearRect(0,0,size,size);
    // background
    ctx.fillStyle = ch.bg;
    ctx.beginPath(); ctx.roundRect(0,0,size,size,size*0.2); ctx.fill();
    ch.draw(ctx, size, anim);
  }

  function getAll() { return chars; }
  function getName(id) { return (chars.find(c=>c.id===id)||{name:'?'}).name; }

  // Animated canvas loop
  const animLoops = new Map(); // canvas -> rafId
  function startAnim(canvas, id) {
    stopAnim(canvas);
    const size = canvas.width;
    const ctx = canvas.getContext('2d');
    let rafId;
    function loop() {
      draw(ctx, id, size, true);
      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);
    animLoops.set(canvas, rafId);
  }
  function stopAnim(canvas) {
    if (animLoops.has(canvas)) {
      cancelAnimationFrame(animLoops.get(canvas));
      animLoops.delete(canvas);
    }
  }
  function staticDraw(canvas, id) {
    stopAnim(canvas);
    const ctx = canvas.getContext('2d');
    draw(ctx, id, canvas.width, false);
  }

  return { draw, getAll, getName, startAnim, stopAnim, staticDraw };
})();