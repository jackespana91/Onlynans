/* Procedural art — every texture is drawn here in canvas 2D. Original characters. */
(function (g) {
  const O = '#24123a', TAU = Math.PI * 2;
  const DISP = '"Luckiest Guy","Impact","Arial Black",sans-serif', BODY = '"Fredoka","Trebuchet MS",Arial,sans-serif';
  let X; // current ctx
  const fs = (f, s, lw) => { if (f) { X.fillStyle = f; X.fill(); } if (s) { X.strokeStyle = s; X.lineWidth = lw || 4; X.lineJoin = 'round'; X.lineCap = 'round'; X.stroke(); } };
  const circ = (x, y, r, f, s, lw) => { X.beginPath(); X.arc(x, y, r, 0, TAU); fs(f, s, lw); };
  const ell = (x, y, rx, ry, f, s, lw, rot) => { X.beginPath(); X.ellipse(x, y, rx, ry, rot || 0, 0, TAU); fs(f, s, lw); };
  const rr = (x, y, w, h, r, f, s, lw) => { X.beginPath(); X.roundRect(x, y, w, h, r); fs(f, s, lw); };
  const poly = (p, f, s, lw, open) => { X.beginPath(); X.moveTo(p[0], p[1]); for (let i = 2; i < p.length; i += 2) X.lineTo(p[i], p[i + 1]); if (!open) X.closePath(); fs(f, s, lw); };
  const line = (x1, y1, x2, y2, s, lw) => { X.beginPath(); X.moveTo(x1, y1); X.lineTo(x2, y2); fs(null, s, lw); };
  const arc = (x, y, r, a0, a1, s, lw, ccw) => { X.beginPath(); X.arc(x, y, r, a0, a1, ccw); fs(null, s, lw); };
  const lg = (x0, y0, x1, y1, ...st) => { const gr = X.createLinearGradient(x0, y0, x1, y1); st.forEach((c, i) => gr.addColorStop(i / (st.length - 1), c)); return gr; };
  const rg = (x, y, r0, r1, ...st) => { const gr = X.createRadialGradient(x, y, r0, x, y, r1); st.forEach((c, i) => gr.addColorStop(i / (st.length - 1), c)); return gr; };
  const text = (t, x, y, size, f, s, lw, font, align) => { t = I18N.art(String(t)); X.font = `${size}px ${font || DISP}`; X.textAlign = align || 'center'; X.textBaseline = 'middle'; if (s) { X.strokeStyle = s; X.lineWidth = lw || 5; X.lineJoin = 'round'; X.strokeText(t, x, y); } X.fillStyle = f; X.fillText(t, x, y); };
  function heartPath(cx, cy, s) { X.beginPath(); X.moveTo(cx, cy + s * 0.9); X.bezierCurveTo(cx - s * 1.5, cy - s * 0.1, cx - s * 0.75, cy - s * 1.15, cx, cy - s * 0.35); X.bezierCurveTo(cx + s * 0.75, cy - s * 1.15, cx + s * 1.5, cy - s * 0.1, cx, cy + s * 0.9); X.closePath(); }
  const heart = (cx, cy, s, f, st, lw) => { heartPath(cx, cy, s); fs(f, st, lw); };
  function star(cx, cy, r, f, s, lw, n) { n = n || 5; X.beginPath(); for (let i = 0; i < n * 2; i++) { const a = -Math.PI / 2 + i * Math.PI / n, rad = i % 2 ? r * 0.45 : r; X.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad); } X.closePath(); fs(f, s, lw); }
  let seed = 7; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  function leopard(x, y, w, h) { // fills current clip region
    X.fillStyle = lg(x, y, x, y + h, '#f0b955', '#d9952f'); X.fillRect(x, y, w, h); seed = 11;
    for (let i = 0; i < (w * h) / 900; i++) { const px = x + rnd() * w, py = y + rnd() * h, r = 6 + rnd() * 5; ell(px, py, r, r * 0.75, '#a8621c', null, 0, rnd() * 3); X.beginPath(); X.ellipse(px, py, r * 1.25, r, rnd() * 3, 0.4, 4.6); fs(null, '#3a1c0c', 3.2); }
  }

  /* ---------- nan face ---------- */
  let PGIMG = null;
  function nanFace(cx, cy, s, o) {
    if (o.pg && PGIMG) { const w = 2.3 * s, h = w * 285 / 305, y = cy - 0.1 * s; X.save(); X.beginPath(); X.ellipse(cx, y, 1.12 * s, 1.1 * s, 0, 0, TAU); X.clip(); X.imageSmoothingQuality = 'high'; X.drawImage(PGIMG, 40, 20, 305, 285, cx - w / 2, y - h / 2, w, h); X.restore(); return; }
    const lw = Math.max(2, s * 0.075), ex = 0.36 * s, ey = cy - 0.06 * s, e = o.expr || 'smile';
    const H = o.hair, HD = o.hairDark || O;
    // back hair
    if (o.style === 'bun') { circ(cx, cy - 1.12 * s, 0.44 * s, H, O, lw); circ(cx, cy - 0.18 * s, 1.0 * s, H, O, lw); }
    else if (o.style === 'perm') { for (let i = 0; i < 9; i++) { const a = Math.PI * (1.05 + i * 0.9 / 8) + (i > 4 ? 0 : 0); const aa = Math.PI + (i / 8) * Math.PI; circ(cx + Math.cos(aa) * 0.82 * s, cy - 0.2 * s + Math.sin(aa) * 0.85 * s, 0.38 * s, H, O, lw); } circ(cx, cy - 0.25 * s, 0.9 * s, H); }
    else if (o.style === 'bob') { rr(cx - 1.02 * s, cy - 1.05 * s, 2.04 * s, 1.85 * s, 0.75 * s, H, O, lw); }
    else { for (let i = 0; i < 7; i++) { const aa = Math.PI * 0.95 + (i / 6) * Math.PI * 1.1; circ(cx + Math.cos(aa) * 0.78 * s, cy - 0.15 * s + Math.sin(aa) * 0.8 * s, 0.4 * s, H, O, lw); } circ(cx, cy - 0.2 * s, 0.85 * s, H); }
    // ears + earrings
    circ(cx - 0.8 * s, cy + 0.06 * s, 0.17 * s, o.skin, O, lw); circ(cx + 0.8 * s, cy + 0.06 * s, 0.17 * s, o.skin, O, lw);
    circ(cx - 0.84 * s, cy + 0.36 * s, 0.11 * s, o.ear || '#ffc94a', O, lw * 0.7); circ(cx + 0.84 * s, cy + 0.36 * s, 0.11 * s, o.ear || '#ffc94a', O, lw * 0.7);
    // face
    ell(cx, cy + 0.02 * s, 0.8 * s, 0.9 * s, o.skin, O, lw);
    ell(cx - 0.5 * s, cy + 0.34 * s, 0.2 * s, 0.13 * s, 'rgba(255,80,120,.38)'); ell(cx + 0.5 * s, cy + 0.34 * s, 0.2 * s, 0.13 * s, 'rgba(255,80,120,.38)');
    // fringe curls
    const n = o.style === 'bob' ? 0 : 5;
    for (let i = 0; i < n; i++) { const t = i / (n - 1) - 0.5; circ(cx + t * 1.2 * s, cy - 0.74 * s + Math.abs(t) * 0.3 * s, 0.27 * s, H, O, lw); }
    if (o.style === 'bob') { X.beginPath(); X.moveTo(cx - 0.8 * s, cy - 0.35 * s); X.quadraticCurveTo(cx - 0.2 * s, cy - 0.5 * s, cx + 0.1 * s, cy - 0.85 * s); X.quadraticCurveTo(cx + 0.5 * s, cy - 0.45 * s, cx + 0.8 * s, cy - 0.35 * s); X.quadraticCurveTo(cx + 0.7 * s, cy - 1.0 * s, cx, cy - 1.0 * s); X.quadraticCurveTo(cx - 0.7 * s, cy - 1.0 * s, cx - 0.8 * s, cy - 0.35 * s); fs(H, O, lw); }
    if (o.rollers) for (let i = 0; i < 3; i++) rr(cx - 0.62 * s + i * 0.44 * s, cy - 1.12 * s, 0.36 * s, 0.26 * s, 0.1 * s, ['#ff7ab8', '#7fe3ff', '#ffe066'][i], O, lw * 0.8);
    // eyes
    const eye = (sx, mode) => {
      const x = cx + sx * ex;
      if (mode === 'open' || mode === 'wide' || mode === 'lid') {
        const r = mode === 'wide' ? 0.2 : 0.16;
        ell(x, ey, r * s, r * 1.1 * s, '#fff', O, lw * 0.7); circ(x + 0.02 * s * sx, ey + 0.02 * s, (mode === 'wide' ? 0.07 : 0.09) * s, O);
        circ(x + 0.05 * s, ey - 0.04 * s, 0.03 * s, '#fff');
        X.beginPath(); X.ellipse(x, ey, r * s, r * 1.1 * s, 0, Math.PI, TAU); X.lineTo(x + r * s, ey - (mode === 'lid' ? -0.02 : 0.1) * s); X.quadraticCurveTo(x, ey - (mode === 'lid' ? 0.02 : 0.16) * s, x - r * s, ey - (mode === 'lid' ? -0.02 : 0.1) * s); X.closePath(); fs(o.shadow || '#6fb7ff', O, lw * 0.6);
      } else if (mode === 'happy') { arc(x, ey + 0.06 * s, 0.15 * s, Math.PI * 1.1, Math.PI * 1.9, O, lw); }
      else { arc(x, ey - 0.04 * s, 0.15 * s, Math.PI * 0.1, Math.PI * 0.9, O, lw); ell(x, ey - 0.06 * s, 0.16 * s, 0.07 * s, o.shadow || '#6fb7ff'); arc(x, ey - 0.04 * s, 0.15 * s, Math.PI * 0.1, Math.PI * 0.9, O, lw); }
    };
    const L = { smile: 'open', laugh: 'happy', wink: 'open', gasp: 'wide', smirk: 'lid', blink: 'shut' }[e], R = e === 'wink' ? 'shut' : L;
    eye(-1, L); eye(1, R);
    // brows
    const bw = o.brow || HD;
    arc(cx - ex, ey - 0.02 * s, 0.34 * s, Math.PI * 1.25, Math.PI * 1.7, bw, lw * 0.9);
    arc(cx + ex, ey - (e === 'smirk' || e === 'gasp' ? 0.1 : 0.02) * s, 0.34 * s, Math.PI * 1.3, Math.PI * 1.75, bw, lw * 0.9);
    // glasses
    if (o.glasses) {
      const gc = o.glassCol || '#e0245e', glw = lw * 1.25;
      [-1, 1].forEach(sx => {
        const x = cx + sx * ex;
        if (o.glasses === 'cat') { X.beginPath(); X.moveTo(x - sx * 0.3 * s, ey - 0.16 * s); X.quadraticCurveTo(x + sx * 0.1 * s, ey - 0.3 * s, x + sx * 0.46 * s, ey - 0.36 * s); X.quadraticCurveTo(x + sx * 0.4 * s, ey + 0.2 * s, x, ey + 0.25 * s); X.quadraticCurveTo(x - sx * 0.34 * s, ey + 0.22 * s, x - sx * 0.3 * s, ey - 0.16 * s); fs('rgba(255,255,255,.22)', gc, glw); }
        else if (o.glasses === 'round') circ(x, ey, 0.28 * s, 'rgba(255,255,255,.22)', gc, glw);
        else { X.beginPath(); X.arc(x, ey + 0.02 * s, 0.27 * s, 0, Math.PI); X.closePath(); fs('rgba(255,255,255,.25)', gc, glw); }
      });
      line(cx - 0.09 * s, ey, cx + 0.09 * s, ey, gc, glw);
      if (o.chain) { X.setLineDash([lw, lw * 1.6]); arc(cx - 0.72 * s, ey + 0.35 * s, 0.4 * s, Math.PI * 0.6, Math.PI * 1.45, '#ffc94a', lw * 0.8); arc(cx + 0.72 * s, ey + 0.35 * s, 0.4 * s, Math.PI * 1.55, Math.PI * 0.4, '#ffc94a', lw * 0.8); X.setLineDash([]); }
    }
    // nose
    arc(cx + 0.03 * s, cy + 0.2 * s, 0.11 * s, Math.PI * 0.1, Math.PI * 1.0, '#c4755a', lw * 0.8);
    // mouth
    const my = cy + 0.52 * s, lip = o.lip || '#e0245e';
    if (e === 'laugh') { X.beginPath(); X.moveTo(cx - 0.36 * s, my - 0.08 * s); X.quadraticCurveTo(cx, my + 0.5 * s, cx + 0.36 * s, my - 0.08 * s); X.closePath(); fs('#5a1030', null); rr(cx - 0.28 * s, my - 0.08 * s, 0.56 * s, 0.11 * s, 0.03 * s, '#fff'); ell(cx, my + 0.2 * s, 0.14 * s, 0.07 * s, '#ff7a9c'); X.beginPath(); X.moveTo(cx - 0.36 * s, my - 0.08 * s); X.quadraticCurveTo(cx, my + 0.5 * s, cx + 0.36 * s, my - 0.08 * s); X.closePath(); fs(null, lip, lw * 1.3); }
    else if (e === 'gasp') ell(cx, my + 0.05 * s, 0.14 * s, 0.19 * s, '#5a1030', lip, lw * 1.4);
    else if (e === 'smirk') { X.beginPath(); X.moveTo(cx - 0.22 * s, my + 0.04 * s); X.quadraticCurveTo(cx + 0.1 * s, my + 0.16 * s, cx + 0.34 * s, my - 0.1 * s); fs(null, lip, lw * 1.6); }
    else { X.beginPath(); X.moveTo(cx - 0.3 * s, my - 0.02 * s); X.quadraticCurveTo(cx, my + 0.28 * s, cx + 0.3 * s, my - 0.02 * s); fs(null, lip, lw * 1.7); }
    if (o.mole) circ(cx + 0.3 * s, my - 0.12 * s, 0.035 * s, O);
    // crow's feet
    line(cx - 0.7 * s, ey - 0.05 * s, cx - 0.62 * s, ey, 'rgba(120,60,50,.5)', lw * 0.5); line(cx + 0.7 * s, ey - 0.05 * s, cx + 0.62 * s, ey, 'rgba(120,60,50,.5)', lw * 0.5);
  }
  const NANS = {
    MABEL: { skin: '#ffd9c2', hair: '#f2f2f7', style: 'curls', glasses: 'round', glassCol: '#3a9df0', lip: '#ff5fa2', shadow: '#c9a5ff', top: '#ff8fc0', ring: ['#ff8fc0', '#ff3d8b'], bg: ['#ffe1ef', '#ffb3d4'], expr: 'laugh', pearls: 1 },
    BRENDA: { skin: '#e9b48f', hair: '#ffe9a8', style: 'perm', glasses: null, lip: '#c2185b', shadow: '#58d6c8', top: '#8e5cf0', ring: ['#b79cf2', '#6a35d9'], bg: ['#e6dcff', '#b9a1f5'], expr: 'smirk', mole: 1, ear: '#ff5fa2' },
    VIOLET: { skin: '#c98d68', hair: '#9b5cf0', style: 'curls', glasses: 'half', glassCol: '#ffc94a', lip: '#ff3d6e', shadow: '#ffd24a', top: '#ffd24a', ring: ['#ffe27a', '#f5a300'], bg: ['#fff3c4', '#ffd66b'], expr: 'wink', rollers: 1 },
    GLADYS: { skin: '#f6cdb4', hair: '#ff8a5c', style: 'bob', glasses: 'cat', glassCol: '#18b8a6', lip: '#e0245e', shadow: '#8fe36b', top: '#18b8a6', ring: ['#5ff0d9', '#0e9c8c'], bg: ['#d5fff6', '#8debdc'], expr: 'gasp', pearls: 1 },
    DORIS: { skin: '#f3c9a8', hair: '#ffffff', style: 'perm', glasses: 'round', glassCol: '#e8a400', lip: '#d81b60', shadow: '#9be36b', top: '#4caf50', ring: ['#a5e86b', '#2e9e3a'], bg: ['#e6ffd0', '#a9e88a'], expr: 'smirk', mole: 1, ear: '#ffc94a' },
    DOTTIE: { pg: 1, skin: '#ffd3ba', hair: '#b99cf5', hairDark: '#6a4bb5', style: 'bun', glasses: 'cat', glassCol: '#ff2e7e', chain: 1, lip: '#ff1f6b', shadow: '#5fd1ff', top: 'leopard', ring: ['#ffe27a', '#ff9d00'], bg: ['#8a55f0', '#4a1fa8'], expr: 'smile', mole: 1 }
  };

  let build = function (scene) {
    PGIMG = scene.textures.exists('pg_bust') ? scene.textures.get('pg_bust').getSourceImage() : null;
    const tex = (key, w, h, fn) => { const t = scene.textures.createCanvas(key, w, h); X = t.context; X.save(); fn(w, h); X.restore(); t.refresh(); };

    /* ---- avatar symbols ---- */
    const avatar = (key, name, o, size, expr) => tex(key, size, size, () => {
      const k = size / 160; X.scale(k, k);
      circ(80, 78, 74, lg(0, 4, 0, 152, o.ring[0], o.ring[1]), O, 5);
      circ(80, 78, 62, lg(0, 16, 0, 140, o.bg[0], o.bg[1]), O, 4);
      X.save(); X.beginPath(); X.arc(80, 78, 60, 0, TAU); X.clip();
      if (o.top === 'leopard') { X.save(); X.beginPath(); X.ellipse(80, 150, 66, 44, 0, 0, TAU); X.clip(); leopard(10, 100, 140, 60); X.restore(); ell(80, 150, 66, 44, null, O, 4); for (let i = 0; i < 7; i++) circ(38 + i * 14, 112 + Math.abs(i - 3) * 2.5, 9, '#d9c6ff', O, 3); }
      else { ell(80, 150, 66, 44, o.top, O, 4); if (o.pearls) for (let i = 0; i < 7; i++) circ(50 + i * 10, 116 + (3 - Math.abs(i - 3)) * 2.5, 4.5, '#fff', O, 2); }
      nanFace(80, 74, 37, Object.assign({}, o, { expr: expr || o.expr }));
      X.restore();
      rr(26, 126, 108, 28, 14, lg(0, 126, 0, 154, o.ring[0], o.ring[1]), O, 4);
      text(name, 80, 141, 19, '#fff', O, 4);
      if (name === 'DOTTIE') { rr(104, 14, 48, 22, 8, '#ff2e4d', O, 3); text('LIVE', 128, 26, 13, '#fff'); }
      else circ(132, 30, 10, '#4dea7a', O, 4);
    });
    Object.keys(NANS).forEach(n => avatar('sym_' + n, n, NANS[n], 160));
    ['MABEL', 'BRENDA', 'VIOLET', 'GLADYS', 'DORIS'].forEach(n => avatar('big_' + n, n, NANS[n], 260, n === 'DORIS' ? 'wink' : 'laugh'));
    avatar('big_DOTTIE', 'DOTTIE', NANS.DOTTIE, 320, 'laugh');

    /* ---- low symbols ---- */
    if (I18N.lang === 'es') tex('sym_TEA', 160, 160, () => { // mate
      line(96, 70, 128, 8, O, 13); line(96, 70, 128, 8, '#cfd3e0', 7); rr(120, 2, 22, 12, 5, '#cfd3e0', O, 3.5);
      ell(80, 96, 54, 50, lg(30, 0, 130, 0, '#b0703c', '#7a4520'), O, 5); rr(40, 52, 80, 22, 10, lg(0, 52, 0, 74, '#f2f4fa', '#9aa0b4'), O, 5); ell(80, 54, 34, 8, '#5d8a2e', O, 4);
      for (let i = 0; i < 9; i++) circ(58 + (i * 37) % 46, 51 + (i % 3) * 2.5, 2.2, '#9bd65a'); heart(80, 104, 15, '#ff5fa2', O, 3.5); ell(54, 84, 8, 14, 'rgba(255,255,255,.25)', null, 0, 0.4); ell(80, 146, 34, 7, '#5a3216', O, 4);
    }); else tex('sym_TEA', 160, 160, () => {
      ell(80, 128, 62, 15, '#fff6e6', O, 5);
      arc(126, 84, 20, -1.2, 1.5, O, 14); arc(126, 84, 20, -1.2, 1.5, '#ff8fc0', 7);
      X.beginPath(); X.moveTo(34, 60); X.lineTo(126, 60); X.quadraticCurveTo(124, 122, 96, 124); X.lineTo(64, 124); X.quadraticCurveTo(36, 122, 34, 60); fs(lg(34, 0, 126, 0, '#ffb3d6', '#ff6fae'), O, 5);
      ell(80, 60, 46, 11, '#a8643a', O, 5); ell(74, 58, 22, 4, 'rgba(255,255,255,.3)');
      heart(80, 94, 15, '#8e5cf0', O, 3.5);
      X.beginPath(); X.moveTo(62, 40); X.bezierCurveTo(52, 28, 72, 22, 62, 8); fs(null, 'rgba(255,255,255,.9)', 5); X.beginPath(); X.moveTo(92, 42); X.bezierCurveTo(82, 30, 102, 24, 92, 10); fs(null, 'rgba(255,255,255,.9)', 5);
    });
    const dentTop = (x, y, w, h) => { rr(x, y, w, h * 0.62, [h * 0.5, h * 0.5, 8, 8], lg(0, y, 0, y + h, '#ff9db8', '#f0568a'), O, 5); const n = 6, tw = (w - 16) / n; for (let i = 0; i < n; i++) rr(x + 8 + i * tw, y + h * 0.42, tw - 2, h * 0.58, [3, 3, 8, 8], '#fffdf5', O, 3.5); };
    const dentBot = (x, y, w, h) => { rr(x, y + h * 0.38, w, h * 0.62, [8, 8, h * 0.5, h * 0.5], lg(0, y, 0, y + h, '#ff9db8', '#f0568a'), O, 5); const n = 6, tw = (w - 16) / n; for (let i = 0; i < n; i++) rr(x + 8 + i * tw, y, tw - 2, h * 0.58, [8, 8, 3, 3], '#fffdf5', O, 3.5); };
    tex('sym_DENT', 160, 160, () => { rr(26, 50, 108, 66, 14, '#5a1030'); dentTop(20, 30, 120, 56); dentBot(20, 82, 120, 56); star(132, 34, 14, '#fff', O, 3, 4); });
    tex('dent_top', 280, 130, w => dentTop(6, 6, 268, 118)); tex('dent_bot', 280, 130, w => dentBot(6, 6, 268, 118));
    tex('sym_BINGO', 160, 160, () => { circ(80, 82, 60, rg(60, 56, 6, 76, '#fff3a0', '#ffc21a', '#f08a00'), O, 5); circ(80, 82, 33, '#fff', O, 4); text('88', 80, 85, 38, '#e0245e', null); ell(52, 44, 16, 9, 'rgba(255,255,255,.75)', null, 0, -0.6); });
    tex('sym_YARN', 160, 160, () => {
      line(30, 136, 118, 22, O, 12); line(30, 136, 118, 22, '#e8b878', 6); circ(120, 20, 8, '#ff5fa2', O, 3.5);
      line(132, 136, 46, 22, O, 12); line(132, 136, 46, 22, '#e8b878', 6); circ(44, 20, 8, '#ff5fa2', O, 3.5);
      circ(80, 90, 52, rg(62, 70, 6, 60, '#7ff3e2', '#19b8a8'), O, 5);
      X.save(); X.beginPath(); X.arc(80, 90, 50, 0, TAU); X.clip(); for (let i = -4; i < 5; i++) { arc(80 + i * 16, 190, 110, 0, TAU, 'rgba(8,90,84,.55)', 3.5); arc(-30, 90 + i * 16, 110, 0, TAU, 'rgba(255,255,255,.3)', 3); } X.restore();
      X.beginPath(); X.moveTo(118, 126); X.bezierCurveTo(150, 140, 120, 156, 152, 150); fs(null, O, 9); X.beginPath(); X.moveTo(118, 126); X.bezierCurveTo(150, 140, 120, 156, 152, 150); fs(null, '#19b8a8', 4.5);
    });
    /* ---- specials ---- */
    const shipMini = (cx, cy, k) => { X.save(); X.translate(cx, cy); X.scale(k, k);
      rr(-22, -52, 14, 26, 3, '#ff5fa2', O, 3.5); rr(4, -52, 14, 26, 3, '#ff5fa2', O, 3.5);
      rr(-36, -30, 72, 18, 4, '#fff', O, 3.5); rr(-46, -14, 92, 16, 4, '#fff', O, 3.5);
      poly([-60, 0, 60, 0, 46, 26, -46, 26], '#3d2a8c', O, 3.5); line(-56, 8, 56, 8, '#ff2e4d', 4);
      for (let i = -3; i <= 3; i++) circ(i * 12, -6, 3, '#5fd1ff', O, 1.5); X.restore(); };
    tex('sym_SCAT', 160, 160, () => {
      circ(80, 76, 72, '#fff', O, 5);
      for (let i = 0; i < 4; i++) { X.beginPath(); X.moveTo(80, 76); X.arc(80, 76, 72, i * Math.PI / 2 + 0.35, i * Math.PI / 2 + 1.22); X.closePath(); fs('#ff2e4d'); }
      circ(80, 76, 72, null, O, 5); circ(80, 76, 50, lg(0, 26, 0, 126, '#ffb86b', '#ff7aa8', '#3fc7e8'), O, 4.5);
      X.save(); X.beginPath(); X.arc(80, 76, 48, 0, TAU); X.clip(); shipMini(80, 86, 0.72); X.fillStyle = '#19a8d6'; X.fillRect(20, 104, 120, 40); for (let i = 0; i < 6; i++) arc(36 + i * 20, 104, 10, Math.PI, TAU, '#fff', 3); X.restore();
      rr(18, 122, 124, 30, 15, lg(0, 122, 0, 152, '#ffe27a', '#ff9d00'), O, 4.5); text('CRUISE', 80, 138, 22, '#fff', O, 4.5);
    });
    tex('sym_MULT', 160, 160, () => { circ(80, 80, 70, rg(80, 80, 20, 72, 'rgba(255,95,162,.55)', 'rgba(255,95,162,0)')); heart(80, 74, 56, lg(0, 10, 0, 140, '#ff8fd0', '#ff2e7e', '#9b2be0'), O, 6); X.save(); heartPath(80, 74, 56); X.clip(); ell(52, 48, 18, 10, 'rgba(255,255,255,.65)', null, 0, -0.6); X.restore(); });
    tex('sym_BONUS', 160, 160, () => {
      line(80, 100, 80, 154, O, 14); line(80, 100, 80, 154, '#c98a4b', 7);
      X.save(); X.translate(80, 68); X.rotate(-0.06); rr(-66, -52, 132, 104, 16, lg(0, -52, 0, 52, '#fff8e6', '#ffe1a8'), O, 5); rr(-58, -44, 116, 88, 11, null, '#ff5fa2', 5);
      text('PICK', 0, -18, 36, '#8e3cf0', O, 5); text('ME!', 0, 22, 40, '#ff2e7e', O, 5); X.restore();
      circ(28, 26, 13, '#ffc21a', O, 3.5); text('7', 28, 27, 15, O); circ(134, 110, 13, '#5fd1ff', O, 3.5); text('22', 134, 111, 13, O);
    });

    /* ---- Doris's prize marrow: stacked wild segments that join up ---- */
    const marrow = (key, top, bot) => tex('sym_WILD_' + key, 160, 160, () => {
      const y0 = top ? 30 : -30, y1 = bot ? 150 : 190, rad = [top ? 52 : 0, top ? 52 : 0, bot ? 52 : 0, bot ? 52 : 0];
      if (top) { X.beginPath(); X.moveTo(80, 34); X.bezierCurveTo(74, 16, 96, 14, 92, 2); fs(null, O, 14); X.beginPath(); X.moveTo(80, 34); X.bezierCurveTo(74, 16, 96, 14, 92, 2); fs(null, '#7a5a2a', 7); }
      rr(26, y0, 108, y1 - y0, rad, lg(26, 0, 134, 0, '#1f7a2e', '#4fc04a', '#2f9a36', '#1b6a28'), O, 6);
      X.save(); X.beginPath(); X.roundRect(26, y0, 108, y1 - y0, rad); X.clip();
      [44, 62, 80, 98, 116].forEach((x, i) => { X.beginPath(); X.moveTo(x, y0); X.bezierCurveTo(x + (i - 2) * 3, 60, x + (i - 2) * 3, 110, x, y1); fs(null, i % 2 ? 'rgba(210,255,150,.75)' : 'rgba(255,240,140,.6)', i % 2 ? 5 : 3); });
      ell(52, 80, 9, 70, 'rgba(255,255,255,.22)'); X.restore();
      if (top) { circ(118, 44, 26, lg(0, 18, 0, 70, '#ff5f6e', '#c81a3a'), O, 4); circ(118, 44, 17, '#fff', O, 3); text('1st', 118, 45, 17, '#c81a3a'); poly([104, 64, 98, 96, 112, 86], '#ff5f6e', O, 3); poly([132, 64, 138, 96, 124, 86], '#ff5f6e', O, 3); }
      if (bot) text('WILD', 80, top ? 104 : 96, 34, '#ffe27a', O, 7);
    });
    marrow('top', true, false); marrow('mid', false, false); marrow('bot', false, true); marrow('one', true, true);
    tex('trowel', 90, 150, () => { rr(34, 4, 22, 60, 8, '#c98a4b', O, 5); rr(40, 58, 10, 26, 2, '#8a8fa0', O, 4); poly([22, 80, 68, 80, 60, 126, 45, 146, 30, 126], lg(22, 0, 68, 0, '#e6e9f2', '#9aa0b4'), O, 5); });

    /* ---- stream Dottie ---- */
    const OUTFITS = [
      (x, y, w, h) => leopard(x, y, w, h),
      (x, y, w, h) => { X.fillStyle = lg(x, y, x, y + h, '#ff8fc0', '#e0247e'); X.fillRect(x, y, w, h); seed = 17; for (let i = 0; i < w * h / 260; i++) star(x + rnd() * w, y + rnd() * h, 2 + rnd() * 5, i % 3 ? '#fff' : '#ffe27a', null, 0, 4); },
      (x, y, w, h) => { X.fillStyle = lg(x, y, x + w, y + h, '#fff3a0', '#ffb300', '#fff3a0', '#e08a00', '#ffe27a'); X.fillRect(x, y, w, h); seed = 23; for (let i = 0; i < w * h / 1500; i++) star(x + rnd() * w, y + rnd() * h, 8 + rnd() * 6, '#fff', '#c97a00', 2); },
      (x, y, w, h) => { X.fillStyle = lg(x, y, x, y + h, '#7a2be0', '#3a0f8c'); X.fillRect(x, y, w, h); X.save(); X.translate(x + w / 2, y + h / 2); X.rotate(-0.6); X.fillStyle = '#ffc94a'; X.fillRect(-w, -22, w * 2, 44); X.strokeStyle = O; X.lineWidth = 4; X.strokeRect(-w, -22, w * 2, 44); text('BINGO QUEEN', 0, 2, 26, '#7a2be0'); X.restore(); seed = 29; for (let i = 0; i < 14; i++) circ(x + rnd() * w, y + rnd() * h, 3, '#ffe27a'); }
    ];
    const TRIM = ['#d9c6ff', '#fff', '#fff3c4', '#fff'];
    OUTFITS.forEach((fill, oi) => {
      tex('dot_body_' + oi, 340, 240, () => {
        rr(138, 0, 64, 70, 20, NANS.DOTTIE.skin, O, 6);
        const p = () => { X.beginPath(); X.moveTo(20, 240); X.quadraticCurveTo(14, 96, 110, 62); X.lineTo(230, 62); X.quadraticCurveTo(326, 96, 320, 240); X.closePath(); };
        X.save(); p(); X.clip(); fill(0, 40, 340, 200); X.restore(); p(); fs(null, O, 6);
        poly([138, 60, 170, 130, 202, 60], NANS.DOTTIE.skin, O, 5);
        for (let i = 0; i < 9; i++) { const t = i / 8, x = 108 + t * 124, y = 66 + Math.sin(t * Math.PI) * 62; circ(x, y, 17, TRIM[oi], O, 4); if (oi === 3) circ(x, y, 4, O); }
        for (let i = 0; i < 6; i++) circ(140 + i * 12, 78 + Math.sin(i / 5 * Math.PI) * 14, 6, oi === 2 ? '#ffe27a' : '#fff', O, 2.5);
      });
      tex('dot_arm_' + oi, 110, 210, () => { X.save(); rr(26, 6, 58, 130, 28, '#000'); X.clip(); fill(20, 0, 70, 140); X.restore(); rr(26, 6, 58, 130, 28, null, O, 6); rr(24, 118, 62, 20, 9, TRIM[oi], O, 4); circ(55, 158, 26, NANS.DOTTIE.skin, O, 5); });
    });
    /* ---- desktop: Dottie on her mobility scooter ---- */
    const SK = NANS.DOTTIE.skin, BASE = [SK, '#ff5fa2', '#ffc21a', '#7a2be0'];
    const limb = (x1, y1, x2, y2, w, col) => { line(x1, y1, x2, y2, O, w + 9); line(x1, y1, x2, y2, col, w); };
    OUTFITS.forEach((fill, oi) => tex('scoot_dot_' + oi, 520, 420, () => {
      // scooter rear + seat
      rr(112, 118, 34, 126, 14, '#3a2260', O, 5); rr(182, 250, 22, 74, 6, '#555066', O, 5);
      rr(56, 274, 160, 62, 20, lg(0, 274, 0, 336, '#ff5f6e', '#c81a3a'), O, 6); rr(66, 318, 392, 36, 16, lg(0, 318, 0, 354, '#ff5f6e', '#c81a3a'), O, 6);
      rr(118, 226, 176, 34, 14, '#3a2260', O, 5);
      // legs
      limb(222, 236, 322, 246, 34, SK); limb(322, 246, 336, 312, 26, SK); ell(350, 318, 30, 12, '#ff8fc0', O, 4); circ(350, 310, 7, '#fff', O, 2.5);
      // torso
      rr(196, 82, 38, 40, 10, SK, O, 5);
      const torso = () => { X.beginPath(); X.moveTo(152, 246); X.quadraticCurveTo(140, 128, 178, 112); X.lineTo(252, 112); X.quadraticCurveTo(286, 134, 276, 246); X.closePath(); };
      if (oi === 0) {
        torso(); fs(SK, O, 6); X.save(); torso(); X.clip(); leopard(130, 136, 160, 46); leopard(130, 200, 160, 60); line(130, 136, 300, 136, O, 4); line(130, 182, 300, 182, O, 4); line(130, 200, 300, 200, O, 4); X.restore(); torso(); fs(null, O, 6);
        X.save(); X.beginPath(); X.roundRect(206, 219, 60, 36, 16); X.clip(); leopard(200, 214, 80, 46); X.restore(); rr(206, 219, 60, 36, 16, null, O, 4);
      } else {
        X.save(); torso(); X.clip(); fill(130, 100, 170, 160); X.restore(); torso(); fs(null, O, 6);
        X.save(); X.beginPath(); X.roundRect(200, 214, 132, 50, 22); X.clip(); fill(190, 204, 150, 70); X.restore(); rr(200, 214, 132, 50, 22, null, O, 5);
      }
      for (let i = 0; i < 7; i++) circ(184 + i * 10.5, 120 + Math.sin(i / 6 * Math.PI) * 13, 6, oi === 2 ? '#ffe27a' : '#fff', O, 2.5);
      // tiller, basket, arm on the handlebar
      limb(428, 330, 396, 160, 9, '#8a8fa0'); rr(426, 204, 76, 60, 10, '#e8b878', O, 5); for (let i = 0; i < 5; i++) line(438 + i * 13, 208, 438 + i * 13, 260, '#a8703a', 3); line(428, 232, 500, 232, '#a8703a', 3);
      circ(440, 296, 11, '#ffe27a', O, 4); limb(372, 148, 420, 168, 9, '#2a2438');
      limb(258, 140, 378, 158, 24, BASE[oi]); if (oi) rr(350, 142, 16, 30, 6, '#fff', O, 3); circ(386, 158, 14, SK, O, 4.5);
      // mudguards
      arc(120, 366, 52, Math.PI * 1.05, Math.PI * 1.95, O, 16); arc(120, 366, 52, Math.PI * 1.05, Math.PI * 1.95, '#c81a3a', 8); arc(420, 366, 52, Math.PI * 1.05, Math.PI * 1.95, O, 16); arc(420, 366, 52, Math.PI * 1.05, Math.PI * 1.95, '#c81a3a', 8);
    }));
    tex('wheel', 96, 96, () => { circ(48, 48, 43, '#2a2438', O, 6); circ(48, 48, 26, '#3d3650'); for (let i = 0; i < 4; i++) line(48 + Math.cos(i * 0.785) * 24, 48 + Math.sin(i * 0.785) * 24, 48 - Math.cos(i * 0.785) * 24, 48 - Math.sin(i * 0.785) * 24, '#cfd3e0', 5); circ(48, 48, 10, '#ffe27a', O, 3.5); });
    tex('arm_bare', 110, 210, () => { rr(31, 6, 48, 134, 24, SK, O, 6); circ(55, 158, 26, SK, O, 5); });
    tex('studio', 740, 764, (w, h) => {
      X.fillStyle = lg(0, 0, 0, 580, '#6a3fb0', '#4a2a86'); X.fillRect(0, 0, w, 580);
      for (let i = 0; i < 19; i++) { X.fillStyle = i % 2 ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.06)'; X.fillRect(i * 40, 0, 20, 580); }
      seed = 5; for (let i = 0; i < 60; i++) { const x = rnd() * w, y = 90 + rnd() * 470; for (let k = 0; k < 5; k++) circ(x + Math.cos(k * 1.257) * 6, y + Math.sin(k * 1.257) * 6, 4, 'rgba(255,143,192,.3)'); circ(x, y, 3, 'rgba(255,226,122,.45)'); }
      X.fillStyle = '#2a1648'; X.fillRect(0, 566, w, 22); X.fillStyle = lg(0, 588, 0, h, '#5a2f9c', '#2e1560'); X.fillRect(0, 588, w, h - 588);
      for (let i = 0; i < 12; i++) for (let j = 0; j < 4; j++) poly([i * 70 + (j % 2) * 35, 610 + j * 44, i * 70 + 22 + (j % 2) * 35, 632 + j * 44, i * 70 + (j % 2) * 35, 654 + j * 44, i * 70 - 22 + (j % 2) * 35, 632 + j * 44], 'rgba(255,143,192,.14)');
      ell(340, 706, 330, 46, '#ff8fc0', O, 5); ell(340, 706, 290, 34, null, '#fff', 4); ell(340, 706, 250, 26, '#ffb3d6');
      // neon, cat picture, shelf
      rr(26, 150, 168, 54, 14, 'rgba(20,8,40,.7)', '#ff5fa2', 4); X.shadowColor = '#ff5fa2'; X.shadowBlur = 16; text('ON AIR', 110, 179, 32, '#ffd0e6'); X.shadowBlur = 0;
      rr(392, 140, 84, 96, 6, '#ffe27a', O, 5); rr(402, 150, 64, 76, 3, '#8debdc', O, 3); circ(434, 198, 20, '#ff9d5c', O, 3.5); poly([416, 188, 420, 168, 430, 182], '#ff9d5c', O, 3.5); poly([452, 188, 448, 168, 438, 182], '#ff9d5c', O, 3.5); circ(427, 196, 2.6, O); circ(441, 196, 2.6, O); arc(434, 202, 5, 0.2, 2.9, O, 2.5);
      rr(500, 470, 224, 16, 5, '#b0703c', O, 4); poly([530, 470, 522, 430, 566, 430, 558, 470], lg(0, 430, 0, 470, '#fff3a0', '#ffb300'), O, 4); arc(520, 444, 9, Math.PI * 0.5, Math.PI * 1.5, O, 4); arc(568, 444, 9, Math.PI * 1.5, Math.PI * 0.5, O, 4); text('BINGO', 544, 452, 11, '#a85c00', null, 0, BODY);
      rr(610, 440, 44, 30, 6, '#e0245e', O, 4); circ(690, 440, 22, '#4caf50', O, 4); circ(676, 426, 14, '#66c96a', O, 3); rr(676, 452, 28, 18, 4, '#c98a4b', O, 3);
      // ring light + tripod phone
      line(96, 420, 96, 700, O, 12); line(96, 420, 96, 700, '#2a1a40', 7); line(96, 700, 56, 736, O, 9); line(96, 700, 136, 736, O, 9); circ(96, 330, 78, null, 'rgba(255,255,255,.18)', 34); circ(96, 330, 78, null, O, 18); circ(96, 330, 78, null, '#fff', 11);
      line(668, 560, 640, 748, O, 9); line(668, 560, 700, 748, O, 9); line(668, 560, 668, 752, O, 9); rr(640, 500, 56, 92, 10, '#1b1030', O, 5); rr(646, 508, 44, 70, 5, '#ff5fa2'); circ(668, 520, 5, '#fff');
    });
    tex('deck_tall', 740, 764, (w, h) => {
      X.fillStyle = lg(0, 0, 0, 470, '#3a1a8c', '#a03fc8', '#ff5fa2', '#ffb86b'); X.fillRect(0, 0, w, 470); circ(540, 452, 110, rg(540, 452, 14, 110, '#fff6c2', '#ffd24a'));
      X.fillStyle = lg(0, 440, 0, 600, '#2fb6d6', '#1570a8'); X.fillRect(0, 440, w, 160); for (let i = 0; i < 12; i++) line(440 + i * 5 - i * i, 452 + i * 9, 640 - i * 5 + i * i, 452 + i * 9, 'rgba(255,240,180,.3)', 3);
      seed = 3; for (let i = 0; i < 46; i++) arc(rnd() * w, 450 + rnd() * 130, 9, Math.PI * 1.15, Math.PI * 1.85, 'rgba(255,255,255,.5)', 2.5);
      X.fillStyle = lg(0, 590, 0, h, '#c98a4b', '#8a5628'); X.fillRect(0, 590, w, h - 590); for (let i = 0; i < 12; i++) line(0, 604 + i * 14, w, 604 + i * 14, 'rgba(60,30,10,.32)', 2.5);
      line(0, 450, w, 450, O, 14); line(0, 450, w, 450, '#fff', 8); line(0, 520, w, 520, '#fff', 5); for (let i = 0; i < 8; i++) { line(30 + i * 100, 450, 30 + i * 100, 596, O, 12); line(30 + i * 100, 450, 30 + i * 100, 596, '#fff', 7); }
      X.beginPath(); X.moveTo(0, 96); for (let i = 0; i < 8; i++) X.quadraticCurveTo(i * 96 + 48, 150, (i + 1) * 96, 96); fs(null, '#3a2260', 3); for (let i = 0; i < 16; i++) circ(Math.floor(i / 2) * 96 + (i % 2 ? 72 : 24), 114, 8, ['#ffe27a', '#5ff0d9', '#ff8fc0', '#fff'][i % 4], O, 2.5);
      circ(130, 520, 34, '#fff', O, 5); circ(130, 520, 17, '#2fb6d6', O, 4); for (let i = 0; i < 4; i++) { X.beginPath(); X.arc(130, 520, 34, i * 1.571 + 0.4, i * 1.571 + 1.17); X.arc(130, 520, 17, i * 1.571 + 1.17, i * 1.571 + 0.4, true); X.closePath(); fs('#ff2e4d'); }
    });

    ['smile', 'blink', 'laugh', 'gasp', 'wink', 'smirk'].forEach(e => tex('dot_head_' + e, 260, 300, () => nanFace(130, 180, 82, Object.assign({}, NANS.DOTTIE, { expr: e }))));
    tex('dot_shades', 260, 300, () => { const s = 82, cx = 130, ey = 180 - 0.06 * s; [-1, 1].forEach(sx => { const x = cx + sx * 0.36 * s; rr(x - 0.34 * s, ey - 0.26 * s, 0.68 * s, 0.5 * s, [8, 8, 24, 24], '#1b1030', '#ffe27a', 5); line(x - 0.2 * s, ey - 0.14 * s, x - 0.05 * s, ey - 0.14 * s, 'rgba(255,255,255,.6)', 5); }); line(cx - 6, ey - 8, cx + 6, ey - 8, '#ffe27a', 5);
      ell(130, 98, 124, 26, '#fff3c4', O, 5); rr(72, 30, 116, 70, [40, 40, 6, 6], '#fff3c4', O, 5); rr(72, 78, 116, 20, 4, '#ff5fa2', O, 4); });
    tex('mug', 100, 80, () => { arc(78, 40, 13, -1.3, 1.3, O, 11); arc(78, 40, 13, -1.3, 1.3, '#ff8fc0', 5); rr(8, 12, 68, 60, [6, 6, 16, 16], lg(8, 0, 76, 0, '#ffb3d6', '#ff6fae'), O, 5); heart(42, 42, 12, '#8e5cf0', O, 3); ell(42, 14, 32, 7, '#a8643a', O, 4); });

    /* ---- backdrops ---- */
    tex('room', 688, 300, (w, h) => {
      X.fillStyle = lg(0, 0, 0, h, '#6a3fb0', '#4a2a86'); X.fillRect(0, 0, w, h);
      for (let i = 0; i < 18; i++) { X.fillStyle = i % 2 ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.06)'; X.fillRect(i * 40, 0, 20, h); }
      seed = 5; for (let i = 0; i < 26; i++) { const x = rnd() * w, y = rnd() * 200; for (let k = 0; k < 5; k++) circ(x + Math.cos(k * 1.257) * 6, y + Math.sin(k * 1.257) * 6, 4, 'rgba(255,143,192,.35)'); circ(x, y, 3, 'rgba(255,226,122,.5)'); }
      // ring light
      circ(70, 120, 52, null, 'rgba(255,255,255,.18)', 26); circ(70, 120, 52, null, '#fff', 9); line(70, 172, 70, 300, '#2a1a40', 7);
      // cat picture
      rr(330, 24, 84, 96, 6, '#ffe27a', O, 5); rr(340, 34, 64, 76, 3, '#8debdc', O, 3); circ(372, 82, 20, '#ff9d5c', O, 3.5); poly([354, 72, 358, 52, 368, 66], '#ff9d5c', O, 3.5); poly([390, 72, 386, 52, 376, 66], '#ff9d5c', O, 3.5); circ(365, 80, 2.6, O); circ(379, 80, 2.6, O); arc(372, 86, 5, 0.2, 2.9, O, 2.5);
      X.fillStyle = '#2a1648'; X.fillRect(0, 262, w, 38); X.fillStyle = '#3a2260'; X.fillRect(0, 258, w, 6);
    });
    tex('desk', 440, 150, () => {
      rr(0, 86, 440, 64, [14, 14, 0, 0], lg(0, 86, 0, 150, '#b0703c', '#7a4520'), O, 5); line(8, 102, 432, 102, 'rgba(255,255,255,.18)', 3);
      rr(120, 66, 150, 26, 6, '#2a1a40', O, 4); for (let i = 0; i < 9; i++) rr(127 + i * 15.5, 71, 12, 7, 2, i % 3 ? '#b79cf2' : '#ff8fc0'); for (let i = 0; i < 9; i++) rr(127 + i * 15.5, 81, 12, 7, 2, '#d9c6ff');
      rr(300, 50, 70, 42, 8, '#e0245e', O, 4); ell(335, 50, 35, 9, '#ff5f8a', O, 4); text('BISCUITS', 335, 73, 12, '#fff', null, 0, BODY);
      line(52, 92, 52, 30, O, 12); line(52, 92, 52, 30, '#555066', 6); line(52, 30, 96, 8, O, 12); line(52, 30, 96, 8, '#555066', 6);
      X.save(); X.translate(108, 6); X.rotate(0.5); rr(-12, -8, 52, 30, 14, '#2a2438', O, 4); for (let i = 0; i < 4; i++) line(-2 + i * 10, -4, -2 + i * 10, 18, '#8a84a0', 2.5); X.restore(); ell(52, 94, 30, 8, '#2a2438', O, 4);
    });
    tex('deck', 688, 300, (w, h) => {
      X.fillStyle = lg(0, 0, 0, 190, '#5b2aa8', '#ff5fa2', '#ffb86b'); X.fillRect(0, 0, w, 190);
      circ(500, 178, 70, rg(500, 178, 10, 70, '#fff6c2', '#ffd24a')); X.fillStyle = lg(0, 170, 0, 240, '#2fb6d6', '#1570a8'); X.fillRect(0, 170, w, 80);
      for (let i = 0; i < 9; i++) line(430 + i * 4 - i * i, 178 + i * 7, 570 - i * 4 + i * i, 178 + i * 7, 'rgba(255,240,180,.35)', 3);
      seed = 3; for (let i = 0; i < 30; i++) { const x = rnd() * w, y = 176 + rnd() * 60; arc(x, y, 8, Math.PI * 1.15, Math.PI * 1.85, 'rgba(255,255,255,.5)', 2.5); }
      X.fillStyle = lg(0, 236, 0, 300, '#c98a4b', '#8a5628'); X.fillRect(0, 236, w, 64); for (let i = 0; i < 8; i++) line(0, 244 + i * 9, w, 244 + i * 9, 'rgba(60,30,10,.35)', 2);
      line(0, 150, w, 150, O, 12); line(0, 150, w, 150, '#fff', 7); line(0, 196, w, 196, '#fff', 4); for (let i = 0; i < 8; i++) { line(20 + i * 94, 150, 20 + i * 94, 240, O, 10); line(20 + i * 94, 150, 20 + i * 94, 240, '#fff', 6); }
      X.beginPath(); X.moveTo(0, 14); for (let i = 0; i < 8; i++) X.quadraticCurveTo(i * 90 + 45, 60, (i + 1) * 90, 14); fs(null, '#3a2260', 3);
      for (let i = 0; i < 16; i++) { const t = (i % 2) ? 0.75 : 0.25, bx = Math.floor(i / 2) * 90 + t * 90; circ(bx, 30, 7, ['#ffe27a', '#5ff0d9', '#ff8fc0', '#fff'][i % 4], O, 2); }
      circ(114, 196, 28, '#fff', O, 4); circ(114, 196, 14, '#2fb6d6', O, 4); for (let i = 0; i < 4; i++) { X.beginPath(); X.arc(114, 196, 28, i * 1.571 + 0.4, i * 1.571 + 1.17); X.arc(114, 196, 14, i * 1.571 + 1.17, i * 1.571 + 0.4, true); X.closePath(); fs('#ff2e4d'); }
    });
    tex('sky', 360, 640, (w, h) => { X.fillStyle = lg(0, 0, 0, h, '#3a1a8c', '#a03fc8', '#ff5fa2', '#ffb86b', '#ffe6a0'); X.fillRect(0, 0, w, h); });
    tex('curtain', 360, 640, (w, h) => { X.fillStyle = lg(0, 0, 0, h, '#8a1038', '#4a0a2a'); X.fillRect(0, 0, w, h); for (let i = 0; i < 12; i++) { X.fillStyle = lg(i * 30, 0, i * 30 + 30, 0, 'rgba(0,0,0,.28)', 'rgba(255,255,255,.08)', 'rgba(0,0,0,.28)'); X.fillRect(i * 30, 0, 30, h); } });
    tex('wave', 240, 70, w => { X.beginPath(); X.moveTo(0, 70); X.lineTo(0, 26); for (let i = 0; i < 4; i++) X.quadraticCurveTo(i * 60 + 30, -8, (i + 1) * 60, 26); X.lineTo(240, 70); X.closePath(); fs('#fff'); X.beginPath(); X.moveTo(0, 70); X.lineTo(0, 32); for (let i = 0; i < 4; i++) X.quadraticCurveTo(i * 60 + 30, 0, (i + 1) * 60, 32); X.lineTo(240, 70); X.closePath(); fs('#dff6ff'); });
    tex('cloud', 220, 100, () => { [[60, 62, 36], [104, 46, 44], [152, 58, 38], [110, 70, 40]].forEach(c => circ(c[0], c[1], c[2], 'rgba(255,255,255,.92)')); });
    tex('sun', 260, 260, () => { circ(130, 130, 128, rg(130, 130, 40, 128, 'rgba(255,240,170,.9)', 'rgba(255,220,120,0)')); circ(130, 130, 70, rg(130, 130, 10, 70, '#fffbe0', '#ffd24a')); });
    tex('ship', 600, 300, () => {
      rr(190, 30, 46, 90, 8, lg(190, 0, 236, 0, '#ff8fc0', '#ff3d8b'), O, 6); rr(190, 30, 46, 20, 6, '#3a2260', O, 5); heart(213, 84, 13, '#fff', O, 3);
      rr(300, 44, 46, 76, 8, lg(300, 0, 346, 0, '#ff8fc0', '#ff3d8b'), O, 6); rr(300, 44, 46, 20, 6, '#3a2260', O, 5); heart(323, 92, 13, '#fff', O, 3);
      rr(150, 110, 260, 44, 8, '#fff', O, 6); rr(100, 148, 380, 46, 8, '#fff', O, 6);
      for (let i = 0; i < 7; i++) rr(168 + i * 33, 122, 20, 20, 4, '#5fd1ff', O, 3); for (let i = 0; i < 11; i++) circ(124 + i * 33, 171, 9, '#5fd1ff', O, 3);
      X.beginPath(); X.moveTo(20, 190); X.lineTo(586, 190); X.quadraticCurveTo(560, 270, 500, 286); X.lineTo(90, 286); X.quadraticCurveTo(40, 260, 20, 190); fs(lg(0, 190, 0, 286, '#5a3fc8', '#2e1a78'), O, 6);
      line(30, 212, 574, 212, '#ff2e4d', 9); text('HMS SAUCY SUE', 290, 246, 30, '#ffe27a', O, 5);
      line(100, 148, 30, 190, O, 5); line(480, 148, 560, 100, O, 4); line(560, 100, 560, 190, O, 6);
      for (let i = 0; i < 9; i++) poly([486 + i * 8.5, 142 - i * 4.6, 496 + i * 8.5, 137 - i * 4.6, 492 + i * 8.5, 154 - i * 4.6], ['#ffe27a', '#5ff0d9', '#ff8fc0'][i % 3], O, 2);
    });
    // full-body nans (conga + cruise)
    const fullNan = (key, o, zimmer) => tex(key, 170, 260, () => {
      ell(62, 250, 22, 9, '#ff8fc0', O, 4); ell(104, 250, 22, 9, '#ff8fc0', O, 4);
      line(66, 196, 64, 244, O, 16); line(66, 196, 64, 244, '#c9a58f', 9); line(100, 196, 102, 244, O, 16); line(100, 196, 102, 244, '#c9a58f', 9);
      const p = () => { X.beginPath(); X.moveTo(36, 206); X.quadraticCurveTo(30, 120, 62, 104); X.lineTo(104, 104); X.quadraticCurveTo(136, 120, 130, 206); X.closePath(); };
      if (o.top === 'leopard') { X.save(); p(); X.clip(); leopard(20, 96, 130, 120); X.restore(); p(); fs(null, O, 5); } else { p(); fs(o.top, O, 5); for (let i = 0; i < 4; i++) circ(83, 124 + i * 20, 4, '#fff', O, 2); }
      line(112, 126, 148, 150, O, 18); line(112, 126, 148, 150, o.top === 'leopard' ? '#e0a23c' : o.top, 11); circ(150, 152, 10, o.skin, O, 4);
      if (zimmer) { line(150, 150, 150, 252, O, 9); line(150, 150, 150, 252, '#cfd3e0', 5); line(120, 168, 120, 252, O, 9); line(120, 168, 120, 252, '#cfd3e0', 5); line(120, 172, 150, 160, O, 9); line(120, 172, 150, 160, '#cfd3e0', 5); line(120, 214, 150, 214, '#cfd3e0', 4); }
      nanFace(83, 66, 34, Object.assign({}, o, { expr: 'laugh' }));
    });
    ['MABEL', 'BRENDA', 'VIOLET', 'GLADYS', 'DOTTIE'].forEach(n => fullNan('full_' + n, NANS[n], true)); fullNan('full_DORIS', NANS.DORIS, false);
    tex('scooter', 340, 260, () => {
      line(250, 96, 262, 196, O, 12); line(250, 96, 262, 196, '#555066', 6); line(232, 92, 268, 100, O, 12); line(232, 92, 268, 100, '#2a2438', 7);
      rr(262, 130, 56, 44, 8, '#e8b878', O, 4); for (let i = 0; i < 4; i++) line(272 + i * 12, 132, 272 + i * 12, 172, '#a8703a', 2.5);
      rr(60, 176, 220, 36, 16, lg(0, 176, 0, 212, '#ff5f6e', '#c81a3a'), O, 6); rr(46, 110, 26, 80, 8, '#3a2260', O, 5); rr(52, 150, 110, 30, 10, '#3a2260', O, 5);
      circ(92, 222, 30, '#2a2438', O, 6); circ(92, 222, 12, '#cfd3e0', O, 4); circ(252, 222, 30, '#2a2438', O, 6); circ(252, 222, 12, '#cfd3e0', O, 4);
      // dottie
      X.save(); X.beginPath(); X.moveTo(70, 160); X.quadraticCurveTo(64, 88, 110, 84); X.quadraticCurveTo(158, 88, 160, 160); X.closePath(); X.clip(); leopard(60, 80, 110, 90); X.restore(); X.beginPath(); X.moveTo(70, 160); X.quadraticCurveTo(64, 88, 110, 84); X.quadraticCurveTo(158, 88, 160, 160); X.closePath(); fs(null, O, 5);
      line(148, 110, 236, 98, O, 18); line(148, 110, 236, 98, '#e0a23c', 11); circ(238, 98, 10, NANS.DOTTIE.skin, O, 4);
      rr(128, 154, 70, 22, 10, '#c9a58f', O, 4); ell(204, 172, 20, 9, '#ff8fc0', O, 4);
      nanFace(112, 52, 34, Object.assign({}, NANS.DOTTIE, { expr: 'laugh', chain: 0 }));
      X.beginPath(); X.moveTo(84, 88); X.bezierCurveTo(40, 80, 30, 110, 4, 92); fs(null, O, 14); X.beginPath(); X.moveTo(84, 88); X.bezierCurveTo(40, 80, 30, 110, 4, 92); fs(null, '#ff5fa2', 8);
    });
    tex('rocker', 280, 300, () => {
      X.beginPath(); X.moveTo(20, 268); X.quadraticCurveTo(140, 312, 262, 262); fs(null, O, 16); X.beginPath(); X.moveTo(20, 268); X.quadraticCurveTo(140, 312, 262, 262); fs(null, '#b0703c', 9);
      rr(52, 60, 22, 216, 8, '#b0703c', O, 5); rr(206, 150, 20, 126, 8, '#b0703c', O, 5); rr(52, 190, 174, 22, 8, '#b0703c', O, 5); rr(56, 56, 110, 26, 10, '#c98a4b', O, 5);
      for (let i = 0; i < 3; i++) rr(84 + i * 26, 80, 12, 110, 4, '#c98a4b', O, 4);
      X.save(); X.beginPath(); X.moveTo(78, 200); X.quadraticCurveTo(72, 128, 124, 122); X.quadraticCurveTo(178, 128, 182, 200); X.closePath(); X.clip(); leopard(70, 118, 120, 90); X.restore(); X.beginPath(); X.moveTo(78, 200); X.quadraticCurveTo(72, 128, 124, 122); X.quadraticCurveTo(178, 128, 182, 200); X.closePath(); fs(null, O, 5);
      rr(128, 190, 86, 24, 10, '#c9a58f', O, 4); line(212, 204, 216, 250, O, 16); line(212, 204, 216, 250, '#c9a58f', 9); ell(224, 256, 22, 9, '#ff8fc0', O, 4);
      circ(196, 172, 20, rg(190, 166, 2, 22, '#7ff3e2', '#19b8a8'), O, 4); line(150, 150, 206, 186, O, 7); line(150, 150, 206, 186, '#e8b878', 3.5); line(158, 186, 210, 152, O, 7); line(158, 186, 210, 152, '#e8b878', 3.5);
      nanFace(126, 84, 38, Object.assign({}, NANS.DOTTIE, { expr: 'laugh' }));
    });
    tex('steve', 260, 300, () => {
      X.beginPath(); X.moveTo(20, 300); X.quadraticCurveTo(20, 196, 100, 184); X.lineTo(160, 184); X.quadraticCurveTo(240, 196, 240, 300); X.closePath(); fs('#f2c9a8', O, 6);
      X.beginPath(); X.moveTo(72, 300); X.lineTo(84, 190); X.quadraticCurveTo(130, 232, 176, 190); X.lineTo(188, 300); X.closePath(); fs('#fff', O, 5);
      arc(130, 196, 38, 0.25, Math.PI - 0.25, '#ffc94a', 6);
      rr(108, 150, 44, 46, 14, '#f2c9a8', O, 5);
      ell(130, 104, 70, 78, '#f2c9a8', O, 6); circ(60, 110, 14, '#f2c9a8', O, 5); circ(200, 110, 14, '#f2c9a8', O, 5);
      X.save(); X.beginPath(); X.ellipse(130, 104, 68, 76, 0, 0, TAU); X.clip(); seed = 9; for (let i = 0; i < 240; i++) { const x = 66 + rnd() * 128, y = 120 + rnd() * 62; if (Math.hypot(x - 130, (y - 96) * 0.9) > 44) circ(x, y, 1.6, 'rgba(60,40,40,.5)'); } X.restore();
      X.beginPath(); X.arc(130, 78, 72, Math.PI, TAU); X.lineTo(202, 84); X.lineTo(58, 84); X.closePath(); fs('#27407a', O, 6); rr(40, 64, 60, 24, 10, '#1b2c58', O, 5); rr(150, 30, 40, 22, 6, '#fff', O, 3); text('LAD', 170, 42, 14, '#27407a', null, 0, BODY);
      ell(104, 104, 13, 15, '#fff', O, 4); circ(107, 106, 6, O); arc(158, 106, 13, Math.PI * 0.1, Math.PI * 0.9, O, 5);
      line(88, 82, 120, 86, O, 6); line(142, 84, 176, 78, O, 6);
      arc(132, 126, 9, Math.PI * 0.1, Math.PI, '#c4755a', 4);
      X.beginPath(); X.moveTo(98, 146); X.quadraticCurveTo(134, 180, 168, 140); X.closePath(); fs('#5a1030', O, 5); rr(108, 146, 50, 9, 3, '#fff'); rr(128, 146, 9, 9, 1, '#ffc94a');
    });
    tex('teapot', 260, 210, () => {
      X.beginPath(); X.moveTo(70, 120); X.bezierCurveTo(30, 110, 40, 60, 6, 50); X.lineTo(22, 40); X.bezierCurveTo(60, 50, 60, 84, 84, 92); X.closePath(); fs('#ff8fc0', O, 6);
      arc(206, 110, 34, -1.3, 1.3, O, 20); arc(206, 110, 34, -1.3, 1.3, '#ff8fc0', 10);
      ell(140, 118, 80, 70, lg(60, 0, 220, 0, '#ffc2de', '#ff6fae'), O, 6); ell(140, 54, 44, 12, '#ff5fa2', O, 5); circ(140, 38, 12, '#ffe27a', O, 4);
      heart(140, 120, 26, '#8e5cf0', O, 4); ell(104, 86, 16, 9, 'rgba(255,255,255,.6)', null, 0, -0.6); ell(140, 190, 54, 10, '#ff5fa2', O, 5);
    });
    tex('disco', 150, 150, () => { circ(75, 75, 68, rg(55, 50, 6, 80, '#fff', '#b9c4e8', '#6a70a0'), O, 5); X.save(); X.beginPath(); X.arc(75, 75, 66, 0, TAU); X.clip(); for (let i = 0; i < 9; i++) { line(0, i * 17, 150, i * 17, 'rgba(36,18,58,.45)', 2); X.beginPath(); X.ellipse(75, 75, Math.abs(4 - i) * 17 + 2, 68, 0, 0, TAU); fs(null, 'rgba(36,18,58,.45)', 2); } seed = 21; for (let i = 0; i < 16; i++) rr(rnd() * 130, rnd() * 130, 14, 14, 2, ['rgba(255,95,162,.6)', 'rgba(95,240,217,.6)', 'rgba(255,226,122,.7)', 'rgba(255,255,255,.8)'][i % 4]); X.restore(); });
    tex('sausage', 120, 56, () => { rr(6, 10, 108, 36, 18, lg(0, 10, 0, 46, '#d98a4e', '#9c4a22'), O, 5); line(24, 20, 90, 20, 'rgba(255,255,255,.4)', 5); });
    tex('egg', 110, 90, () => { X.beginPath(); X.moveTo(20, 50); X.bezierCurveTo(0, 10, 50, 0, 66, 14); X.bezierCurveTo(110, 4, 116, 60, 86, 72); X.bezierCurveTo(60, 96, 20, 86, 20, 50); fs('#fff', O, 5); circ(58, 46, 20, rg(52, 40, 2, 20, '#ffe27a', '#ff9d00'), O, 4); circ(51, 39, 5, 'rgba(255,255,255,.8)'); });
    tex('beans', 100, 70, () => { ell(50, 40, 44, 26, '#ff7a2e', O, 5); seed = 4; for (let i = 0; i < 9; i++) ell(22 + rnd() * 56, 28 + rnd() * 24, 9, 6, '#ffb070', O, 2.5, rnd() * 3); });
    tex('toast', 96, 96, () => { rr(10, 14, 76, 74, [26, 26, 8, 8], '#b0703c', O, 5); rr(18, 22, 60, 58, [20, 20, 5, 5], '#ffd88a'); rr(34, 36, 28, 22, 6, '#ffe27a'); });
    tex('bacon', 130, 50, () => { X.beginPath(); X.moveTo(6, 16); for (let i = 0; i < 6; i++) X.quadraticCurveTo(16 + i * 20, i % 2 ? 22 : 4, 26 + i * 20, 14); X.lineTo(124, 38); for (let i = 5; i >= 0; i--) X.quadraticCurveTo(16 + i * 20, i % 2 ? 46 : 28, 6 + i * 20, 38); X.closePath(); fs('#d8425a', O, 5); X.beginPath(); X.moveTo(10, 27); for (let i = 0; i < 6; i++) X.quadraticCurveTo(16 + i * 20, i % 2 ? 34 : 16, 26 + i * 20, 26); fs(null, '#ffd6c0', 5); });
    tex('crown', 160, 110, () => { poly([14, 96, 6, 30, 46, 62, 80, 10, 114, 62, 154, 30, 146, 96], lg(0, 10, 0, 96, '#fff3a0', '#ffb300'), O, 6); rr(12, 84, 136, 20, 6, '#ff9d00', O, 5);[[6, 30], [80, 10], [154, 30]].forEach(p => circ(p[0], p[1], 9, '#ff2e7e', O, 3.5)); circ(80, 94, 6, '#5fd1ff', O, 2.5); circ(46, 94, 5, '#ff5fa2', O, 2.5); circ(114, 94, 5, '#ff5fa2', O, 2.5); });
    tex('coin', 60, 60, () => { circ(30, 30, 26, rg(22, 22, 2, 28, '#fff6b0', '#ffc21a', '#e08a00'), O, 4); circ(30, 30, 18, null, 'rgba(160,90,0,.6)', 2.5); text('£', 30, 32, 24, '#a85c00'); });
    tex('heart', 56, 56, () => { heart(28, 27, 20, lg(0, 4, 0, 50, '#ff9fd0', '#ff2e7e'), O, 4); ell(19, 18, 6, 4, 'rgba(255,255,255,.7)', null, 0, -0.6); });
    tex('star', 56, 56, () => star(28, 29, 24, lg(0, 4, 0, 52, '#fff6b0', '#ffb300'), O, 4));
    tex('thumb', 56, 56, () => { rr(8, 24, 14, 26, 4, '#5fd1ff', O, 3.5); X.beginPath(); X.moveTo(22, 26); X.lineTo(30, 8); X.quadraticCurveTo(40, 8, 36, 24); X.lineTo(48, 24); X.quadraticCurveTo(52, 38, 44, 50); X.lineTo(22, 50); X.closePath(); fs('#ffd9c2', O, 3.5); });
    tex('puff', 128, 128, () => circ(64, 64, 62, rg(64, 64, 6, 62, 'rgba(255,255,255,.95)', 'rgba(255,255,255,.55)', 'rgba(255,255,255,0)')));
    tex('spark', 32, 32, () => circ(16, 16, 15, rg(16, 16, 1, 15, '#fff', 'rgba(255,255,255,.7)', 'rgba(255,255,255,0)')));
    tex('glow', 256, 256, () => circ(128, 128, 126, rg(128, 128, 10, 126, 'rgba(255,255,255,.9)', 'rgba(255,255,255,.3)', 'rgba(255,255,255,0)')));
    tex('drop', 24, 30, () => { X.beginPath(); X.moveTo(12, 2); X.quadraticCurveTo(24, 20, 12, 28); X.quadraticCurveTo(0, 20, 12, 2); fs('#b8703c', O, 2.5); });
    tex('confetti', 16, 10, () => rr(0, 0, 16, 10, 2, '#fff'));
    tex('px', 4, 4, () => { X.fillStyle = '#fff'; X.fillRect(0, 0, 4, 4); });
    tex('rays', 512, 512, () => { for (let i = 0; i < 14; i++) { X.beginPath(); X.moveTo(256, 256); X.arc(256, 256, 256, i * TAU / 14, i * TAU / 14 + TAU / 28); X.closePath(); fs(rg(256, 256, 20, 256, 'rgba(255,255,255,.55)', 'rgba(255,255,255,0)')); } });
    tex('bg', 360, 640, (w, h) => { X.fillStyle = lg(0, 0, 0, h, '#2a1258', '#1a0b38', '#120726'); X.fillRect(0, 0, w, h); seed = 31; for (let i = 0; i < 40; i++) { const x = rnd() * w, y = rnd() * h, r = 10 + rnd() * 38; circ(x, y, r, rg(x, y, 1, r, 'rgba(183,156,242,.16)', 'rgba(183,156,242,0)')); } });
    tex('btn_spin', 190, 190, () => { circ(95, 95, 90, lg(0, 0, 0, 190, '#ffe27a', '#ff9d00'), O, 6); circ(95, 95, 76, lg(0, 20, 0, 170, '#ff7ab8', '#e01f7a', '#8a2be0'), O, 5); X.beginPath(); X.ellipse(95, 62, 58, 30, 0, 0, TAU); fs('rgba(255,255,255,.18)');
      arc(95, 97, 36, -0.5, Math.PI * 1.45, O, 20); arc(95, 97, 36, -0.5, Math.PI * 1.45, '#fff', 11); poly([128, 52, 142, 98, 100, 84], '#fff', O, 5); });
    tex('btn_stop', 190, 190, () => { circ(95, 95, 90, lg(0, 0, 0, 190, '#d9c6ff', '#8e5cf0'), O, 6); circ(95, 95, 76, lg(0, 20, 0, 170, '#6a3fb0', '#3a1c78'), O, 5); rr(68, 68, 54, 54, 10, '#fff', O, 5); });
    tex('btn_sm', 96, 96, () => { circ(48, 48, 44, lg(0, 0, 0, 96, '#b79cf2', '#6a35d9'), O, 5); circ(48, 48, 35, lg(0, 12, 0, 84, '#5a2fb0', '#3a1c78')); X.beginPath(); X.ellipse(48, 32, 28, 14, 0, 0, TAU); fs('rgba(255,255,255,.14)'); });
    tex('btn_on', 96, 96, () => { circ(48, 48, 44, lg(0, 0, 0, 96, '#ffe27a', '#ff9d00'), O, 5); circ(48, 48, 35, lg(0, 12, 0, 84, '#ff5fa2', '#c2185b')); });
    tex('pill', 240, 64, () => rr(3, 3, 234, 58, 29, lg(0, 0, 0, 64, '#ffe27a', '#ff9d00'), O, 5));
    tex('pill_p', 240, 64, () => rr(3, 3, 234, 58, 29, lg(0, 0, 0, 64, '#b79cf2', '#6a35d9'), O, 5));
    tex('bubble', 300, 120, () => { rr(6, 6, 288, 84, 26, '#fff', O, 5); poly([60, 86, 44, 114, 92, 88], '#fff', O, 5); X.fillStyle = '#fff'; X.fillRect(58, 78, 38, 10); });
  }
  const _build = build;
  build = function (scene) { _build(scene); const ext = (key, src, w, h, pad) => { if (!scene.textures.exists(src)) return; const img = scene.textures.get(src).getSourceImage(); scene.textures.remove(key); const t = scene.textures.createCanvas(key, w, h), c = t.context; c.imageSmoothingQuality = 'high'; c.drawImage(img, pad, pad, w - 2 * pad, h - 2 * pad); t.refresh(); };
    ext('sym_TEA', 'x_low_bill', 160, 160, 6); ext('sym_DENT', 'x_low_cherries', 160, 160, 6); ext('sym_BINGO', 'x_low_champagne', 160, 160, 4); ext('sym_YARN', 'x_low_cuffs', 160, 160, 6); ext('sym_MULT', 'x_wild_live', 160, 160, 2);
    ext('room', 'room_strip', 688, 300, 0); ext('studio', 'room_studio', 740, 764, 0); ext('bg', 'bg_port', 360, 640, 0);
    // Generated character assets
    ext('sym_MABEL', 'x_mabel', 160, 160, 10);
    ext('sym_BRENDA', 'x_brenda', 160, 160, 10);
    ext('sym_VIOLET', 'x_violet', 160, 160, 10);
    ext('sym_GLADYS', 'x_gladys', 160, 160, 10);
    ext('sym_DOTTIE', 'x_dottie', 160, 160, 8);
    ext('big_MABEL', 'x_mabel', 260, 260, 15);
    ext('big_BRENDA', 'x_brenda', 260, 260, 15);
    ext('big_VIOLET', 'x_violet', 260, 260, 15);
    ext('big_GLADYS', 'x_gladys', 260, 260, 15);
    ext('big_DOTTIE', 'x_dottie', 320, 320, 20);
    ext('big_DORIS', 'x_doris_full', 260, 260, 10);
    ext('full_DORIS', 'x_doris_full', 170, 260, 5);
    ext('full_MABEL', 'x_mabel_full', 170, 260, 5);
    ext('sym_YARN', 'x_yarn', 160, 160, 8);
    ext('sym_TEA', 'x_teacup', 160, 160, 8);
    ext('sym_WILD_one', 'x_cucumber', 160, 160, 4);
    ext('sym_WILD_top', 'x_cucumber', 160, 160, 4);
  };
  g.Art = { build, DISP, BODY, O };
})(window);
