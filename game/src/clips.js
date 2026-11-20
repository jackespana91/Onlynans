/* Story clips: splash, cruise intro/outro, bingo pick, win tiers. Mixed into Game.prototype. */
(function (g) {
  const { W, H, GY, money, pick, CHAT, BODY, INK } = GameConst, P = Game.prototype;

  P.cine = function (hint) {
    this.ovOn(); const k = this.add.container(3000, 0).setDepth(100); const z = this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.001).setInteractive(); k.add(z); k.canSkip = true;
    z.on('pointerdown', () => { if (k.onTap) k.onTap(); else if (k.canSkip) this.fast(true); });
    k.bars = () => { const a = this.add.rectangle(W / 2, -40, W, 80, 0x0a0418), b = this.add.rectangle(W / 2, H + 40, W, 80, 0x0a0418), t = this.tx(W / 2, H + 40, hint === false ? '' : 'TAP TO SKIP', 18, '#b79cf2', { st: 3 }); k.add([a, b, t]); this.tweens.add({ targets: a, y: 40, duration: 300 }); this.tweens.add({ targets: [b, t], y: H - 40, duration: 300 }); };
    k.setAlpha(0); this.tweens.add({ targets: k, alpha: 1, duration: 220 });
    return k;
  };
  P.cineEnd = async function (k) { await this.tw(k, { alpha: 0 }, 260); this.fast(false); this.ovOff(); k.list.forEach(o => this.tweens.killTweensOf(o)); k.destroy(); this.scrollers = this.scrollers.filter(s => s.o.active); if (this.rays && !this.rays.active) this.rays = null; };
  P.slam = async function (t, from) { t.setScale(from || 3.5).setAlpha(0); await this.tw(t, { scale: 1, alpha: 1 }, 240, 'Cubic.in'); Sfx.slam(); this.shake(220, 0.01); this.tweens.add({ targets: t, scale: 1.05, duration: 600, yoyo: true, repeat: -1, ease: 'Sine.inOut' }); };

  /* ---------- splash / going live ---------- */
  P.splash = function () {
    const k = this.cine(false); k.canSkip = false; k.setAlpha(1);
    k.add(this.add.image(0, 0, 'bg').setOrigin(0).setScale(2)); const rays = this.add.image(360, 560, 'rays').setScale(2.6).setAlpha(0.25).setTint(0xff5fa2); k.add(rays); this.rays = rays;
    const av = this.add.image(360, 580, 'big_DOTTIE').setScale(1.25); k.add(av); this.tweens.add({ targets: av, y: 560, angle: { from: -3, to: 3 }, duration: 1500, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    const a = this.tx(360, 190, 'DOTTIE', 130, '#ffe27a', { st: 18 }), b = this.tx(360, 300, 'GOES LIVE', 78, '#ff7ab8', { st: 14 }); a.setShadow(0, 8, '#ff9d00', 0, true, false); b.setShadow(0, 6, '#8a2be0', 0, true, false); k.add([a, b]);
    this.tweens.add({ targets: a, scale: 1.04, duration: 1100, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    k.add(this.tx(360, 860, 'Filthy nans. Tumbling wins.\nOne very dodgy livestream.', 30, '#fff', { font: BODY, st: 0, ls: 6 }));
    const go = this.tx(360, 1010, 'TAP TO GO LIVE', 58, '#fff', { st: 12 }); k.add(go); this.tweens.add({ targets: go, scale: 1.12, duration: 520, yoyo: true, repeat: -1 });
    k.add(this.tx(360, 1200, 'ONLY NANS. ONLY RUDE. ONLY WINS.  |  18+  |  DEMO', 18, '#b79cf2', { st: 3 }));
    const hearts = this.time.addEvent({ delay: 260, loop: true, callback: () => this.burst('heart', Math.random() * W, 700 + Math.random() * 400, 1) });
    let started = false;
    k.onTap = async (fast) => {
      if (started) return; started = true; Sfx.init(); hearts.remove(); this.tweens.killTweensOf(go);
      if (!fast) {
        go.setText('GOING LIVE IN').setScale(1);
        const n = this.tx(360, 1110, '3', 120, '#ffe27a', { st: 16 }); k.add(n);
        for (let i = 3; i > 0; i--) { n.setText(i).setScale(2); Sfx.tick(); Sfx.boing(); await this.tw(n, { scale: 1 }, 380, 'Back.out'); await this.wait(120); }
        n.destroy(); go.setText('LIVE!').setColor('#ff2e4d').setFontSize('130px'); Sfx.slam(); Sfx.fanfare(2); this.shake(250, 0.012); this.burst('confetti', 360, 1000, 60); this.burst('heart', 360, 600, 24);
        await this.wait(700);
      }
      Sfx.music('base'); await this.cineEnd(k); this.live = true;
      this._pgT = this.time.now + 3000; Sfx.play('sfx_tv_on', 0.5); Sfx.play('vo_hello');
      this.setViewers(12); this.bumpViewers(4687); this.say('Evening, you dirty sods!'); this.cheer(false);
      CHAT.hello.forEach((m, i) => this.time.delayedCall(250 + i * 380, () => this.chat(m)));
    };
    this.time.delayedCall(250, () => { if (!started) k.onTap(true); });
  };

  /* ---------- sea scene shared by cruise clips ---------- */
  P.seaScene = function (k, sunY) {
    k.add(this.add.image(0, 0, 'sky').setOrigin(0).setScale(2)); const sun = this.add.image(360, sunY, 'sun').setScale(2.4); k.add(sun); this.tweens.add({ targets: sun, scale: 2.6, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    [[120, 180, 1.2, 60000], [520, 300, 0.9, 80000], [300, 90, 0.7, 70000]].forEach(c => { const cl = this.add.image(c[0], c[1], 'cloud').setScale(c[2]); k.add(cl); this.tweens.add({ targets: cl, x: c[0] + 200, duration: c[3] / 6, yoyo: true, repeat: -1 }); });
    const wave = (y, tint, v, sc) => { const t = this.add.tileSprite(360, y, 720 / sc, 70, 'wave').setScale(sc).setTint(tint); k.add(t); this.scrollers.push({ o: t, v }); this.tweens.add({ targets: t, y: y + 8, duration: 900 + v * 4, yoyo: true, repeat: -1, ease: 'Sine.inOut' }); return t; };
    wave(835, 0x7fdcf5, 30, 1);
    const ship = this.add.container(W + 460, 905); const hull = this.add.image(0, 0, 'ship').setOrigin(0.5, 1).setScale(1.08); ship.add(hull);
    ['MABEL', 'BRENDA', 'VIOLET', 'GLADYS'].forEach((n, i) => { const a = this.add.image(-150 + i * 100, -236, 'sym_' + n).setScale(0.46); ship.add(a); ship.sendToBack(a); this.tweens.add({ targets: a, y: -252, duration: 300 + i * 40, yoyo: true, repeat: -1, ease: 'Sine.inOut' }); });
    k.add(ship); this.tweens.add({ targets: hull, angle: { from: -1.2, to: 1.2 }, duration: 1300, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    const smoke = this.time.addEvent({ delay: 170, loop: true, callback: () => { if (ship.active) this.burst('puff', ship.x - 90 + Math.random() * 130, ship.y - 300, 1, 0xffffff); } }); k.smoke = smoke;
    wave(900, 0x2fb6d6, -55, 1.15); k.add(this.add.rectangle(360, 1120, W, 380, 0x1e86bd)); wave(975, 0x1e86bd, 90, 1.4); wave(1090, 0x176a9c, -130, 1.8);
    return ship;
  };
  P.cruiseIntro = async function (n) {
    const k = this.cine(); const ship = this.seaScene(k, 620); k.bars(); Sfx.horn(); Sfx.music('free');
    const pier = this.add.graphics(); pier.fillStyle(0x8a5628).fillRect(0, 1010, 210, 26).lineStyle(4, 0x24123a).strokeRect(-4, 1010, 214, 26); pier.fillStyle(0x6a3f1c).fillRect(30, 1036, 18, 200).fillRect(160, 1036, 18, 200); k.add(pier);
    const dot = this.add.image(-90, 1014, 'full_DOTTIE').setOrigin(0.5, 1).setScale(1.05); k.add(dot);
    const wob = this.tweens.add({ targets: dot, angle: { from: -7, to: 7 }, duration: 130, yoyo: true, repeat: -1 });
    this.tw(ship, { x: 380 }, 1900, 'Cubic.out'); await this.tw(dot, { x: 130 }, 1300, 'Linear');
    const sh = this.tx(190, 760, 'WAIT FOR ME,\nYOU SLAGS!', 34, '#fff', { st: 7, ls: -4 }).setScale(0); k.add(sh); this.tw(sh, { scale: 1 }, 200, 'Back.out'); await this.wait(650);
    wob.stop(); dot.setAngle(-20); Sfx.boing(); this.tw(sh, { alpha: 0 }, 200);
    this.tweens.add({ targets: dot, y: 520, duration: 330, ease: 'Quad.out', yoyo: false, onComplete: () => this.tweens.add({ targets: dot, y: 702, duration: 300, ease: 'Quad.in' }) });
    await this.tw(dot, { x: 250, scale: 0.6, angle: 340 }, 640, 'Linear'); dot.setAngle(0); this.burst('heart', dot.x, dot.y - 80, 18); this.burst('star', dot.x, dot.y - 80, 10); Sfx.pop(6);
    this.tweens.add({ targets: dot, y: dot.y - 12, duration: 260, yoyo: true, repeat: -1 });
    const t1 = this.tx(360, 150, 'ALL ABOARD THE', 40, '#fff', { st: 8 }), t2 = this.tx(360, 268, 'NAUGHTY NANS\nCRUISE', 88, '#ffe27a', { st: 16, ls: -14 }), t3 = this.tx(360, 430, `${n} FREE SPINS`, 60, '#5ff0d9', { st: 12 }).setScale(0), t4 = this.tx(360, 500, 'What happens at sea needs ointment.', 26, '#fff', { font: BODY, st: 4 }).setAlpha(0);
    t2.setShadow(0, 7, '#ff9d00', 0, true, false); k.add([t1, t2, t3, t4]); t1.setAlpha(0); this.tw(t1, { alpha: 1 }, 200); await this.slam(t2); this.burst('confetti', 360, 500, 70);
    Sfx.fanfare(3); await this.tw(t3, { scale: 1 }, 320, 'Back.out'); this.tw(t4, { alpha: 1 }, 300); this.chat('ANCHORS AWAY, KNICKERS TOO'); await this.wait(2100);
    k.smoke.remove(); await this.cineEnd(k);
  };
  P.cruiseOutro = async function (total) {
    const k = this.cine(); const ship = this.seaScene(k, 800); ship.x = 380; k.bars(); const x = total / this.bet; Sfx.horn();
    this.tw(ship, { x: -520 }, 5200, 'Quad.in');
    const t1 = this.tx(360, 170, 'BACK ON DRY LAND', 52, '#fff', { st: 10 }), t2 = this.tx(360, 250, 'CRUISE WINNINGS', 34, '#5ff0d9', { st: 7 }), amt = this.tx(360, 370, money(0), 100, '#ffe27a', { st: 18 }); amt.setShadow(0, 7, '#ff9d00', 0, true, false);
    const q = this.tx(360, 480, x < 10 ? 'All she caught was a rash.' : x < 50 ? "That's the duty free and the penicillin sorted." : x < 150 ? 'The captain wants a word. And a cuddle.' : 'Dottie shagged the boat into her name.', 28, '#fff', { font: BODY, st: 4 }).setAlpha(0); k.add([t1, t2, amt, q]);
    await this.slam(t1, 2.5); const o = { v: 0 }; const tick = this.time.addEvent({ delay: 70, loop: true, callback: () => { Sfx.tick(); if (x >= 10) this.burst('coin', 360, 620, 2); } });
    await this.tw(o, { v: total, onUpdate: () => amt.setText(money(o.v)) }, Math.min(3200, 900 + x * 30), 'Cubic.out'); tick.remove(); amt.setText(money(total));
    Sfx.fanfare(x >= 50 ? 5 : 2); this.burst('confetti', 360, 520, x >= 10 ? 80 : 20); this.tweens.add({ targets: amt, scale: { from: 1.3, to: 1 }, duration: 300, ease: 'Back.out' }); this.tw(q, { alpha: 1 }, 250);
    await this.wait(2200); k.smoke.remove(); await this.cineEnd(k);
  };

  /* ---------- bingo pick me ---------- */
  P.bonusPick = async function (round) {
    const b = round.bonus; Sfx.scatter(5); this.expr('gasp', 1400); this.chat('EYES DOWN, TROUSERS UP');
    round.bonusPos.forEach(p => { const c = this.cells[p[0]][p[1]]; if (c) { this.cellLayer.bringToTop(c); this.tweens.add({ targets: c, scale: 1.45, angle: { from: -12, to: 12 }, duration: 180, yoyo: true, repeat: 3, onComplete: () => c.angle = 0 }); this.burst('star', c.x, c.y, 10); } });
    await this.wait(1400); await this.driveOff();
    const k = this.cine(false); k.canSkip = false; Sfx.music('bonus'); k.add(this.add.image(0, 0, 'curtain').setOrigin(0).setScale(2));
    const sp = this.add.image(360, 700, 'glow').setScale(5.5, 6.5).setAlpha(0.22).setTint(0xffe27a); k.add(sp);
    for (let i = 0; i < 12; i++) { const l = this.add.circle(40 + i * 58, 40, 12, [0xffe27a, 0xff5fa2, 0x5ff0d9][i % 3]).setStrokeStyle(3, 0x24123a); k.add(l); this.tweens.add({ targets: l, alpha: 0.25, duration: 300, delay: i * 90, yoyo: true, repeat: -1 }); }
    const title = this.tx(360, 150, 'BINGO PICK ME', 80, '#ffe27a', { st: 15 }); title.setShadow(0, 7, '#ff9d00', 0, true, false); k.add(title); await this.slam(title);
    const sub = this.tx(360, 232, 'Pick a nan. Win a prize. Or a rash.', 30, '#fff', { font: BODY, st: 4 }); k.add(sub);
    [44, 7, 88, 22, 11].forEach((nn, i) => { const ball = this.add.container(120 + i * 120, -80); ball.add([this.add.circle(0, 0, 40, [0xffc21a, 0xff5fa2, 0x5ff0d9, 0xb79cf2, 0xff8a5c][i]).setStrokeStyle(5, 0x24123a), this.add.circle(0, 0, 23, 0xffffff), this.tx(0, 1, nn, 26, INK, { st: 0 })]); k.add(ball); this.tw(ball, { y: 330 }, 700, 'Bounce.out', { delay: i * 90 }).then(() => this.tweens.add({ targets: ball, y: 318, angle: { from: -12, to: 12 }, duration: 500 + i * 60, yoyo: true, repeat: -1, ease: 'Sine.inOut' })); });
    const names = ['MABEL', 'BRENDA', 'VIOLET', 'GLADYS'], cards = [];
    for (let i = 0; i < 4; i++) { const c = this.add.container(196 + (i % 2) * 328, 620 + Math.floor(i / 2) * 350).setScale(0); const im = this.add.image(0, 0, 'big_' + names[i]).setInteractive({ useHandCursor: true }); const lab = this.tx(0, 142, 'PICK ME!', 34, '#fff', { st: 7 }); c.add([im, lab]); c.im = im; c.lab = lab; k.add(c); cards.push(c); Sfx.boing(); await this.tw(c, { scale: 1 }, 240, 'Back.out'); this.tweens.add({ targets: c, y: c.y - 14, angle: { from: -3, to: 3 }, duration: 600 + i * 70, yoyo: true, repeat: -1, ease: 'Sine.inOut' }); this.tweens.add({ targets: lab, scale: 1.15, duration: 400, yoyo: true, repeat: -1 }); }
    const idx = await new Promise(res => { let done = false; const fin = i => { if (!done) { done = true; res(i); } }; cards.forEach((c, i) => c.im.on('pointerdown', () => fin(i))); this.time.delayedCall(this.auto ? 2200 : 12000, () => fin(Math.floor(Math.random() * 4))); });
    const prizeTxt = p => p === 'CRUISE' ? 'CRUISE\nTICKET' : money(p * this.bet);
    const ch = cards[idx]; Sfx.click(); cards.forEach((c, i) => { this.tweens.killTweensOf(c); this.tweens.killTweensOf(c.lab); c.lab.setVisible(false); if (i !== idx) this.tweens.add({ targets: c, alpha: 0.45, scale: 0.85, duration: 200 }); });
    const roll = this.time.addEvent({ delay: 60, loop: true, callback: () => Sfx.tick() }); await this.tw(ch, { scale: 1.25, angle: { from: -8, to: 8 } }, 110, 'Sine.inOut', { yoyo: true, repeat: 4 }); roll.remove();
    const reveal = async (c, p, win) => { await this.tw(c, { scaleX: 0 }, 130); c.im.setVisible(false); const gph = this.add.graphics(); gph.fillStyle(win ? 0xffc21a : 0x4a2a86).fillRoundedRect(-120, -80, 240, 160, 26).lineStyle(6, 0x24123a).strokeRoundedRect(-120, -80, 240, 160, 26); c.add([gph, this.tx(0, 0, prizeTxt(p), p === 'CRUISE' ? 44 : 50, '#fff', { st: 9, ls: -6 })]); await this.tw(c, { scaleX: win ? 1.25 : 0.85 }, 200, 'Back.out'); };
    await reveal(ch, b.prize, true); Sfx.fanfare(b.prize === 'CRUISE' || b.prize >= 30 ? 5 : 1); this.burst('confetti', ch.x, ch.y, 60); this.burst('coin', ch.x, ch.y, 14);
    sub.setText(b.prize === 'CRUISE' ? 'Pack your knickers, love!' : b.prize >= 50 ? 'Top of the shop, you jammy tart!' : b.prize >= 15 ? 'Two fat ladies. Hello, girls!' : 'Legs eleven. Seen better. Had better.');
    let di = 0; for (let i = 0; i < 4; i++) if (i !== idx) reveal(cards[i], b.decoys[di++], false);
    await this.wait(2300); Sfx.music('base'); await this.cineEnd(k); this.driveBack(); return b.win * this.bet;
  };

  /* ---------- win tiers ---------- */
  const TIERS = [{ x: 10, name: 'CHEEKY WIN', col: '#ffe27a', quip: "Ooh, that's a big one. I've had bigger.", tint: 0xffc21a }, { x: 25, name: 'DIRTY WIN', col: '#ff7ab8', quip: 'Hold onto your teeth. And your trousers!', tint: 0xff5fa2 }, { x: 50, name: 'FILTHY WIN', col: '#5ff0d9', quip: 'Call the vicar. Then call me.', tint: 0x5ff0d9 }, { x: 100, name: 'THE FULL\nMONTY!', col: '#ffb070', quip: 'No shame. Only nans.', tint: 0xff8a2e }];
  P.bigWin = async function (amount) {
    const x = amount / this.bet; let top = -1; TIERS.forEach((t, i) => { if (x >= t.x) top = i; }); if (top < 0) return;
    await this.driveOff(); const k = this.cine(); k.add(this.add.rectangle(W / 2, H / 2, W, H, 0x0a0418, 0.86));
    const rays = this.add.image(360, 520, 'rays').setScale(3).setAlpha(0.5); k.add(rays); this.rays = rays;
    const stage = this.add.container(0, 0); k.add(stage);
    const title = this.tx(360, 380, '', 104, '#fff', { st: 18, ls: -18 }), amt = this.tx(360, 560, money(0), 88, '#fff', { st: 16 }), quip = this.tx(360, 660, '', 30, '#fff', { font: BODY, st: 5 }); k.add([title, amt, quip]); k.bars();
    const o = { v: 0 }; const tick = this.time.addEvent({ delay: 65, loop: true, callback: () => { Sfx.tick(); this.burst('coin', 120 + Math.random() * 480, 860, 1); } }); const rains = [];
    this.bumpViewers(3000 * (top + 1)); for (let i = 0; i < 4; i++) this.time.delayedCall(i * 300, () => this.chat(pick(CHAT.big)));
    for (let t = 0; t <= top; t++) {
      const T = TIERS[t]; this.tweens.killTweensOf(title); title.setText(T.name).setColor(T.col).setFontSize(t === 3 ? '92px' : '112px'); rays.setTint(T.tint); quip.setText(T.quip);
      Sfx.fanfare(t * 2); await this.slam(title); this.burst('confetti', 360, 900, 50 + t * 20);
      stage.list.slice().forEach(a => this.tweens.add({ targets: a, alpha: 0, y: a.y + 200, duration: 300, onComplete: () => { this.tweens.killTweensOf(a); a.destroy(); } }));
      if (t === 0) { const r = this.add.image(360, 1160, 'rocker').setOrigin(0.5, 1).setScale(1.5); stage.add(r); this.tweens.add({ targets: r, angle: { from: -16, to: 16 }, duration: 230, yoyo: true, repeat: -1, ease: 'Sine.inOut' }); const ev = this.time.addEvent({ delay: 240, loop: true, callback: () => { if (!r.active) return ev.remove(); const y = this.add.image(r.x, r.y - 260, 'sym_YARN').setScale(0.3); stage.add(y); this.tweens.add({ targets: y, x: 40 + Math.random() * 640, y: 1400, angle: 500, duration: 1300, ease: 'Quad.in', onComplete: () => y.destroy() }); this.tweens.add({ targets: y, scale: 0.55, duration: 400, yoyo: true }); } }); }
      if (t === 1) { const s = this.add.image(-240, 1090, 'scooter').setScale(1.35).setAngle(-14); stage.add(s); Sfx.engine(); const tr = this.time.addEvent({ delay: 45, loop: true, callback: () => { if (!s.active) return tr.remove(); this.burst('puff', s.x - 150 * (s.flipX ? -1 : 1), s.y + 80, 1, 0xffb070); this.burst('spark', s.x - 170 * (s.flipX ? -1 : 1), s.y + 90, 2, 0xff5f2e); } }); this.tweens.add({ targets: s, y: 1070, duration: 110, yoyo: true, repeat: -1 }); (async () => { for (let i = 0; i < 20 && s.active; i++) { s.setFlipX(i % 2 === 1).setAngle(i % 2 ? 14 : -14); await this.tw(s, { x: i % 2 ? -240 : W + 240 }, 1300, 'Sine.inOut'); if (s.active) Sfx.engine(); } })(); }
      if (t === 2) { const d = this.add.image(360, -100, 'disco').setScale(1.2); stage.add(d); this.tweens.add({ targets: d, y: 150, duration: 600, ease: 'Bounce.out' }); this.tweens.add({ targets: d, angle: { from: -8, to: 8 }, duration: 700, yoyo: true, repeat: -1 }); const fl = this.add.rectangle(W / 2, H / 2, W, H, 0xff5fa2, 0.12); stage.add(fl); let ci = 0; const fe = this.time.addEvent({ delay: 280, loop: true, callback: () => { if (!fl.active) return fe.remove(); fl.setFillStyle([0xff5fa2, 0x5ff0d9, 0xffe27a, 0xb79cf2][ci++ % 4], 0.14); this.burst('spark', d.x + (Math.random() - 0.5) * 500, d.y + Math.random() * 400, 3, 0xffffff); } });
        const line = this.add.container(W + 120, 1150); stage.add(line);['DOTTIE', 'MABEL', 'BRENDA', 'VIOLET', 'GLADYS'].forEach((n, i) => { const a = this.add.image(i * 150, 0, 'full_' + n).setOrigin(0.5, 1).setScale(1.15).setFlipX(true); line.add(a); this.tweens.add({ targets: a, y: -34, angle: { from: -8, to: 8 }, duration: 230, delay: i * 80, yoyo: true, repeat: -1, ease: 'Sine.inOut' }); }); this.tweens.add({ targets: line, x: -720, duration: 4600, repeat: -1 }); }
      if (t === 3) { const dq = this.add.image(360, 1010, 'big_DOTTIE').setScale(1.2); stage.add(dq); this.tweens.add({ targets: dq, scale: 1.28, angle: { from: -4, to: 4 }, duration: 300, yoyo: true, repeat: -1 }); const cr = this.add.image(360, -100, 'crown').setScale(1.5); stage.add(cr); this.tweens.add({ targets: cr, y: 800, duration: 800, ease: 'Bounce.out' });
        const cen = this.add.container(-500, 1090).setAngle(-6); cen.add([this.add.rectangle(0, 0, 460, 84, 0x000000).setStrokeStyle(5, 0xffffff), this.tx(0, 0, 'CENSORED', 60, '#fff', { st: 0 })]); stage.add(cen); this.tweens.add({ targets: cen, x: 360, duration: 500, delay: 900, ease: 'Back.out', onStart: () => Sfx.slam() }); this.time.delayedCall(1200, () => { this.chat('PUT IT AWAY DOT'); this.chat('MY EYES. MY BLOODY EYES'); this.chat('...do it again'); });
        ['sausage', 'egg', 'beans', 'toast', 'bacon'].forEach((f, i) => { const e = this.add.particles(0, 0, f, { x: { min: 0, max: W }, y: -60, speedY: { min: 380, max: 760 }, speedX: { min: -60, max: 60 }, rotate: { min: 0, max: 360 }, scale: { min: 0.7, max: 1.3 }, lifespan: 2600, frequency: 150 + i * 30 }); stage.add(e); stage.sendToBack(e); rains.push(e); }); }
      const from = o.v, to = t === top ? amount : TIERS[t + 1].x * this.bet;
      await this.tw(o, { v: to, onUpdate: () => amt.setText(money(o.v)) }, 2600, t === top ? 'Cubic.out' : 'Linear'); this.tweens.add({ targets: amt, scale: { from: 1.25, to: 1 }, duration: 250, ease: 'Back.out' });
    }
    tick.remove(); amt.setText(money(amount)); Sfx.slam(); this.burst('coin', 360, 900, 40); this.burst('confetti', 360, 900, 90); this.cheer(true); this.say(pick(["Ooh, that's a big one. I've had bigger.", 'Bugger me, that was lovely.', 'More action than my wedding night!']), 2600);
    await this.wait(1900); rains.forEach(e => e.stop()); await this.cineEnd(k); this.driveBack();
  };
})(window);

/* ---------- boot ---------- */
(function () {
  ['pointerdown', 'touchend', 'keydown'].forEach(e => document.addEventListener(e, () => Sfx.init(), { passive: true }));
  const _st = Phaser.GameObjects.Text.prototype.setText;
  Phaser.GameObjects.Text.prototype.setText = function (v) { const r = _st.call(this, typeof v === 'string' ? I18N.tr(v) : v); if (I18N.lang === 'es' && !this.style.wordWrapWidth && this.width > 690) { const fs = parseInt(this.style.fontSize, 10); if (fs > 14) this.setFontSize(Math.floor(fs * 690 / this.width) + 'px'); } return r; };
  window.__setLang = l => { try { localStorage.setItem('dgl_lang', l); } catch (e) { } const s = window.__game; I18N.lang = l; if (!s) return; window.__keep = { live: s.live, balance: s.balance, betIdx: s.betIdx, tips: s.tips, betBoost: s.betBoost }; window.__game = null; s.game.destroy(true); setTimeout(start, 120); };
  const wide = () => window.innerWidth / Math.max(1, window.innerHeight) > 1.15;
  var start = () => { const game = new Phaser.Game({ type: /canvas/.test(location.hash) ? Phaser.CANVAS : Phaser.AUTO, parent: 'game', width: wide() ? 1600 : 720, height: wide() ? 900 : 1280, backgroundColor: '#120726', scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH }, scene: [Game], render: { antialias: true } }); let t; const relay = () => { const s = window.__game; if (!s || wide() === s.land) return; if (s.busy || s.modal || s.ov > 0) { t = setTimeout(relay, 400); return; } s.registry.set('keep', { live: s.live, balance: s.balance, betIdx: s.betIdx, tips: s.tips, betBoost: s.betBoost }); s.auto = false; s.scale.setGameSize(wide() ? 1600 : 720, wide() ? 900 : 1280); s.scale.refresh(); s.tweens.killAll(); s.time.removeAllEvents(); s.scene.restart(); }; window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(relay, 200); }); };
  window.__dottieStart = start;
  const fonts = (document.fonts && document.fonts.load) ? Promise.all([document.fonts.load('20px "Luckiest Guy"'), document.fonts.load('bold 20px "Fredoka"')]) : Promise.resolve();
  Promise.race([fonts, new Promise(r => setTimeout(r, 2500))]).then(start, start);
})();
