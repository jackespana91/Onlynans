/* Tip goal, dirty texts, nan powers, outfits, streak gags, extra clips. Mixed into Game.prototype. */
(function () {
  const { W, H, GY, CH, money, pick, BODY, INK, USERS } = GameConst, P = Game.prototype, E = Engine;
  const OUTFIT_NAMES_L = ['LEOPARD TWO-PIECE', 'PINK SEQUINS', 'GOLD LAME', 'BINGO QUEEN'], OUTFIT_NAMES = ['LEOPARD GOWN', 'PINK SEQUINS', 'GOLD LAME', 'BINGO QUEEN'];

  P.buildExtras = function () {
    const s = this.stream, SP = this.SP;
    // tip goal bar
    const t = this.add.container(SP.tip[0], SP.tip[1]); this.tipBar = t; const bg = this.add.graphics(); bg.fillStyle(0x120726, 0.9).fillRoundedRect(0, 0, 400, 28, 14).lineStyle(3, 0xff7ab8).strokeRoundedRect(0, 0, 400, 28, 14);
    this.tipFill = this.add.image(4, 14, 'px').setOrigin(0, 0.5).setTint(0xff5fa2).setDisplaySize(1, 20); this.tipTxt = this.tx(200, 14, '', 15, '#fff', { st: 3 }); t.add([bg, this.tipFill, this.add.image(16, 14, 'heart').setScale(0.36), this.tipTxt]); s.add(t); this.setTip(0, true);
    // hen do row (cruise only)
    const h = this.add.container(SP.hen[0], SP.hen[1]).setVisible(false); this.henRow = h; const hb = this.add.graphics(); hb.fillStyle(0x120726, 0.9).fillRoundedRect(0, -8, 300, 44, 16).lineStyle(3, 0x5ff0d9).strokeRoundedRect(0, -8, 300, 44, 16); h.add([hb, this.tx(12, 14, 'HEN DO', 17, '#5ff0d9', { ox: 0, st: 3 })]);
    ['MABEL', 'BRENDA', 'VIOLET', 'GLADYS'].forEach((n, i) => { const im = this.add.image(126 + i * 46, 14, 'sym_' + n).setScale(0.25).setTint(0x30204a); im.nan = n; h.add(im); }); s.add(h);
    // sleep + buffering
    this.zz = this.tx(SP.zz[0], SP.zz[1], 'Zzz', 40, '#fff', { st: 6 }).setVisible(false); s.add(this.zz); this.tweens.add({ targets: this.zz, y: SP.zz[1] - 20, alpha: { from: 1, to: 0.4 }, duration: 1100, yoyo: true, repeat: -1 });
    const b = this.add.container(0, 0).setVisible(false); this.buf = b; const ring = this.add.graphics(); ring.lineStyle(10, 0xffffff, 0.9).beginPath().arc(0, 0, 34, 0, 4.4).strokePath(); ring.setPosition(SP.w / 2, SP.h / 2 - 40); this.tweens.add({ targets: ring, angle: 360, duration: 800, repeat: -1 });
    b.add([this.add.rectangle(SP.w / 2, SP.h / 2, SP.w, SP.h, 0x0a0418, 0.72), ring, this.tx(SP.w / 2, SP.h / 2 + 30, 'BUFFERING...', 30, '#fff', { st: 6 }), this.tx(SP.w / 2, SP.h / 2 + 66, 'Dottie has sat on the router', 17, '#b79cf2', { font: BODY, st: 0 })]); s.add(b);
  };
  P.setTip = function (v, instant) { const w = Math.max(1, Math.min(1, v / E.TIP_GOAL) * 392); this.tipTxt.setText(`TIP GOAL  ${Math.min(v, E.TIP_GOAL)} / ${E.TIP_GOAL}`); if (instant) this.tipFill.setDisplaySize(w, 20); else this.tweens.add({ targets: this.tipFill, displayWidth: w, duration: 350 }); };
  P.tipGoalFx = async function () {
    Sfx.fanfare(3); this.cheer(true); this.chat('TIPS OUT FOR THE LADS'); this.chat('she has earned it the hard way'); this.bumpViewers(900);
    const t = this.tx(360, GY + 250, 'TIP GOAL SMASHED!\nFREE QUICKIE', 60, '#ff7ab8', { st: 12, ls: -8 }).setDepth(46).setScale(0); this.burst('coin', 360, GY + 300, 30); this.burst('heart', ...this.dotPos(), 20);
    await this.tw(t, { scale: 1 }, 300, 'Back.out'); await this.wait(900); await this.tw(t, { scale: 0 }, 200); t.destroy(); this.setTip(0);
  };

  /* ---------- outfits + streaks ---------- */
  P.setOutfit = function (l) {
    if (l === this.outfit) return; const up = l > this.outfit; this.outfit = l;
    this.dBody.setTexture(this.bodyKey + l); if (this.land) this.dArmL.setTexture(l ? 'dot_arm_' + l : 'arm_bare'); else { this.dArmL.setTexture('dot_arm_' + l); this.dArmR.setTexture('dot_arm_' + l); }
    this.burst('puff', ...this.dotPos(), 6, 0xffffff); if (!up) return;
    this.burst('star', ...this.dotPos(-10), 16); Sfx.viral(1); this.chat(pick(['new outfit alert', 'ooh she has changed', 'PHWOAR, ' + OUTFIT_NAMES[l], 'who dressed you Dot, give them a raise']));
    const t = this.tx(this.SP.lab[0], this.SP.lab[1], (this.land ? OUTFIT_NAMES_L : OUTFIT_NAMES)[l], 24, '#ffe27a', { st: 5 }).setScale(0); this.stream.add(t); this.tweens.add({ targets: t, scale: 1, duration: 220, ease: 'Back.out' }); this.tweens.add({ targets: t, alpha: 0, y: this.SP.lab[1] - 30, delay: 1400, duration: 300, onComplete: () => t.destroy() });
  };
  P.wake = function () { if (!this.asleep) return; this.asleep = false; this.exprLock = false; this.zz.setVisible(false); this.dot.setAngle(0); this.dFace.setTexture('dot_head_gasp'); this.time.delayedCall(700, () => { if (!this.exprLock && !this.asleep) this.dFace.setTexture('dot_head_smile'); }); this.say('I was resting me eyes!'); };
  P.afterBase = function (w, feature) {
    if (w > 0 || feature) {
      this.wake(); if (this.lossStreak >= 5) { this.chat("she's back, the dirty mare"); this.bumpViewers(700); } this.lossStreak = 0;
      const x = w / this.bet; if (x >= 50) this.setOutfit(3); else if (x >= 10) this.setOutfit(Math.max(this.outfit, 2)); else if (x >= 2) this.setOutfit(Math.max(this.outfit, 1)); return;
    }
    const s = ++this.lossStreak; if (s % 3 === 0 && this.outfit > 0) this.setOutfit(this.outfit - 1);
    if (s > 4) this.setViewers(this.viewers - 120 - Math.round(Math.random() * 220));
    if (s === 5) { this.buf.setVisible(true); this.chat('buffering... like my bladder'); this.chat('STREAM IS KNACKERED'); this.time.delayedCall(1700, () => this.buf.setVisible(false)); }
    if (s === 8) { this.asleep = true; this.exprLock = true; this.dFace.setTexture('dot_head_blink'); this.dot.setAngle(9); this.zz.setVisible(true); this.chat('WAKE UP DOT'); this.chat('she has gone. again.'); }
    if (s >= 11 && s % 3 === 2) this.chat('has left the chat. limp.', pick(USERS), '#8a7ab0');
  };

  /* ---------- dirty text ---------- */
  const TEXTS = [['RandyRon', 'u up? xx'], ['BigBarry', "Wife's at her sister's. Bring your teeth. Or don't."], ['HornyHarry69', 'Saw you on the stream. I have my own hip and a full tank.'], ['LittleBluePillPhil', 'Taken my tablet. Clock is ticking, Dot.'], ['FruityFrank', 'I have warmed the Volvo. And myself.']];
  const REPLIES = ['Come round. Bring biscuits and a doctor.', 'Send a picture of your... pension book.', 'Not tonight. Curlers in, teeth out.', 'Back door is on the latch, you animal.', 'Only if you do the bins after.'];
  P.dirtyText = async function (ev) {
    const k = this.add.container(360, H + 520).setDepth(60), g2 = this.add.graphics(), msg = pick(TEXTS); Sfx.ding(); Sfx.boing(); this.expr('smirk', 2500); this.chat('who is texting her?? jealous');
    g2.fillStyle(0x1b1030).fillRoundedRect(-240, -300, 480, 600, 44).lineStyle(6, 0xffc94a).strokeRoundedRect(-240, -300, 480, 600, 44); g2.fillStyle(0xf4eefc).fillRoundedRect(-216, -270, 432, 540, 26); g2.fillStyle(0x6a35d9).fillRoundedRect(-216, -270, 432, 58, { tl: 26, tr: 26, bl: 0, br: 0 }); g2.fillStyle(0xe2d8f5).fillRoundedRect(-196, -196, 360, 104, 18);
    k.add([g2, this.tx(0, -241, 'DIRTY TEXT', 28, '#fff', { st: 5 }), this.tx(-184, -182, msg[0], 16, '#6a35d9', { font: BODY, st: 0, ox: 0, oy: 0 }).setFontStyle('bold'), this.tx(-184, -158, msg[1], 18, INK, { font: BODY, st: 0, ox: 0, oy: 0, wrap: 336, align: 'left' }), this.tx(0, -66, 'PICK A REPLY', 22, '#ff2e7e', { st: 0 })]);
    const reps = Phaser.Utils.Array.Shuffle(REPLIES.slice()).slice(0, 3), btns = [];
    reps.forEach((r, i) => { const b = this.add.container(0, -6 + i * 88), bg = this.add.graphics(); bg.fillStyle(0xff5fa2).fillRoundedRect(-196, -36, 392, 72, 20).lineStyle(4, 0x24123a).strokeRoundedRect(-196, -36, 392, 72, 20); const z = this.add.rectangle(0, 0, 392, 72, 0, 0.001).setInteractive({ useHandCursor: true }); const t = this.tx(0, 0, r, 17, '#fff', { font: BODY, st: 0, wrap: 360 }).setFontStyle('bold'); b.add([bg, t, z]); b.bg = bg; b.t = t; b.z = z; k.add(b); btns.push(b); });
    this.tweens.add({ targets: k, angle: { from: -3, to: 3 }, duration: 70, yoyo: true, repeat: 5, onComplete: () => k.setAngle(0) }); await this.tw(k, { y: GY + 285 }, 380, 'Back.out');
    const idx = await new Promise(res => { let d = false; const fin = i => { if (!d) { d = true; res(i); } }; btns.forEach((b, i) => b.z.on('pointerdown', () => fin(i))); this.time.delayedCall(this.auto ? 1800 : 10000, () => fin(Math.floor(Math.random() * 3))); });
    const lab = (r, v) => r === 'boost' ? 'SUPERCHAT BOOST' : r === 'mult' ? `+x${v} SPIN MULTIPLIER` : 'FREE RESPIN IF IT FLOPS'; let di = 0; Sfx.click();
    btns.forEach((b, i) => { const win = i === idx, r = win ? ev.reward : ev.decoys[di++]; b.bg.clear().fillStyle(win ? 0xffc21a : 0x8a7ab0).fillRoundedRect(-196, -36, 392, 72, 20).lineStyle(4, 0x24123a).strokeRoundedRect(-196, -36, 392, 72, 20); b.t.setText(lab(r, win ? ev.value : pick([5, 8, 15]))).setFontFamily(GameConst.DISP).setFontSize('24px').setStroke('#24123a', 5); if (!win) b.setAlpha(0.6); else this.tweens.add({ targets: b, scale: 1.1, duration: 200, yoyo: true, repeat: 1 }); });
    Sfx.fanfare(1); this.burst('heart', 360, GY + 285, 14); await this.wait(1300); await this.tw(k, { y: H + 520 }, 300, 'Back.in'); k.destroy();
    if (ev.reward === 'mult') { this.viralTxt.setText('x' + ev.value).setColor('#ffe27a'); this.tweens.add({ targets: this.viralTxt, scale: { from: 2, to: 1 }, duration: 300 }); }
    if (ev.reward === 'respin') this.say('If it flops, we go again. Story of my life.');
  };
  P.respinFx = async function () { const t = this.tx(360, GY + 270, 'IT FLOPPED.\nFREE RESPIN!', 62, '#5ff0d9', { st: 12, ls: -8 }).setDepth(46).setScale(0); Sfx.boing(); await this.tw(t, { scale: 1 }, 260, 'Back.out'); await this.wait(650); await this.tw(t, { scale: 0 }, 180); t.destroy(); };

  /* ---------- nan powers + hen do ---------- */
  const CAP = { MABEL: 'MABEL TOPS UP THE JAR\n+1', BRENDA: 'BRENDA SLIPS YOU A TIP', VIOLET: 'VIOLET WANTS ANOTHER GO\n+1 SPIN', GLADYS: 'GLADYS GOES DOUBLE\nJAR ADD x2', DOTTIE: 'DOTTIE VOUCHES FOR A MATE' };
  P.nanPower = async function (ev) {
    const k = this.add.container(W + 260, GY + 200).setDepth(60), im = this.add.image(0, 0, 'big_' + ev.nan).setScale(ev.nan === 'DOTTIE' ? 0.62 : 0.76), t = this.tx(0, 142, CAP[ev.nan], 34, '#fff', { st: 8, ls: -6 }); k.add([this.add.image(0, 0, 'glow').setScale(2).setTint(0xffe27a).setAlpha(0.6), im, t]);
    Sfx.viral(1); Sfx.boing(); this.cells.forEach(col => col.forEach(c => { if (c && c.d.s === ev.nan) this.tweens.add({ targets: c, scale: 1.25, duration: 150, yoyo: true, repeat: 1 }); }));
    await this.tw(k, { x: 360 }, this.ms(300), 'Back.out'); this.burst('star', 360, GY + 200, 14);
    if (ev.nan === 'MABEL') { this.multTxt.setText('x' + ev.jar); this.tweens.add({ targets: this.multBadge, scale: { from: 1.6, to: 1 }, duration: 250 }); Sfx.mult(4); }
    if (ev.nan === 'BRENDA') { const c = this.cells[ev.pos[0]][ev.pos[1]], h = this.add.image(360, GY + 200, 'heart').setDepth(61).setScale(1.3); await this.tw(h, { x: c.x, y: c.y }, this.ms(300), 'Quad.in'); h.destroy(); this.setCell(c, ev.grid[ev.pos[0]][ev.pos[1]]); Sfx.mult(ev.v); this.burst('heart', c.x, c.y, 8); this.tweens.add({ targets: c, scale: { from: 1.7, to: 1 }, duration: 300, ease: 'Back.out' }); }
    await this.wait(this.ms(850)); await this.tw(k, { x: -260 }, this.ms(260), 'Back.in'); k.destroy();
  };
  const SIZE = ['', 'A tiddler. Bless.', "Seen bigger. Had bigger.", 'Respectable. Firm.', 'Ooh, hello. That is a handful.', 'PRIZE WINNER. Mind your eyes!'];
  P.dorisFx = async function (ev) {
    const x = GameConst.cx(ev.col), left = ev.col < 3, d = this.add.image(left ? -120 : W + 120, GY + CH * 5 + 6, 'full_DORIS').setOrigin(0.5, 1).setDepth(60).setScale(1.5).setFlipX(left), tr = this.add.image(0, 0, 'trowel').setDepth(61).setVisible(false);
    Sfx.boing(); this.chat('DORIS IS HERE. hide your veg'); this.expr('gasp', 2200);
    const wob = this.tweens.add({ targets: d, angle: { from: -6, to: 6 }, duration: 120, yoyo: true, repeat: -1 }); await this.tw(d, { x: x + (left ? 100 : -100) }, this.ms(620), 'Sine.out'); wob.stop(); d.setAngle(0);
    const t = this.tx(360, GY + 70, "DIRTY DORIS\nLOOK AT THE SIZE OF IT", 44, '#a5e86b', { st: 10, ls: -6 }).setDepth(61).setScale(0); this.tw(t, { scale: 1 }, 240, 'Back.out');
    tr.setPosition(x + (left ? 44 : -44), GY + CH * 5 - 60).setVisible(true).setFlipX(left); this.tweens.add({ targets: tr, angle: left ? -40 : 40, y: tr.y + 30, duration: 110, yoyo: true, repeat: 3 }); for (let i = 0; i < 3; i++) this.time.delayedCall(i * 120, () => { Sfx.chomp(); this.burst('drop', x, GY + CH * 5 - 10, 5); }); await this.wait(this.ms(450)); tr.destroy();
    const ord = ev.positions.slice().sort((a, b) => b[1] - a[1]);
    for (let i = 0; i < ord.length; i++) { const p = ord[i], c = this.cells[p[0]][p[1]]; this.setCell(c, ev.grid[p[0]][p[1]]); this.cellLayer.bringToTop(c); c.setScale(1, 0.1); c.y += 50; Sfx.pop(2 + i * 2); this.burst('spark', c.x, c.y, 8, 0x4fc04a); this.tweens.add({ targets: c, scaleY: 1, y: c.y - 50, duration: 200, ease: 'Back.out' }); this.tweens.add({ targets: d, y: d.y - 14, duration: 90, yoyo: true }); await this.wait(this.ms(190)); }
    this.shake(120 + ev.h * 40, 0.003 + ev.h * 0.002); if (ev.h >= 4) { Sfx.slam(); this.burst('star', x, GY + CH * (5 - ev.h / 2), 20); this.chat(pick(['LOOK AT THE SIZE OF THAT', 'she grew that herself, the mucky mare', 'I have never felt so inadequate'])); this.bumpViewers(400 * ev.h); }
    this.say(SIZE[ev.h]); const s = this.tx(x, GY + CH * (5 - ev.h) - 26, ev.h + ' HIGH', 34, '#ffe27a', { st: 7 }).setDepth(61).setScale(0); this.tw(s, { scale: 1 }, 200, 'Back.out');
    await this.wait(this.ms(900)); this.tw(t, { scale: 0 }, 180).then(() => t.destroy()); this.tw(s, { alpha: 0 }, 250).then(() => s.destroy()); d.setFlipX(!left); this.tw(d, { x: left ? -140 : W + 140 }, this.ms(420), 'Sine.in').then(() => d.destroy());
  };
  P.lightHens = function (got) { (got || []).forEach(n => { const im = this.henRow.list.find(o => o.nan === n); if (im) { im.clearTint(); Sfx.ding(); this.tweens.add({ targets: im, scale: { from: 0.6, to: 0.25 }, duration: 400, ease: 'Back.out' }); } }); };
  P.stowaway = async function (n) {
    const st = this.add.image(360, GY + CH * 5 + 320, 'steve').setDepth(60).setScale(1.5), t = this.tx(360, GY + 120, `STOWAWAY STEVE!\n+${n} FREE SPINS`, 60, '#5ff0d9', { st: 12, ls: -8 }).setDepth(61).setScale(0);
    Sfx.horn(); Sfx.boing(); this.chat('STEVE YOU DIRTY STOP-OUT'); this.say('Room for a little one, Steve?'); this.tw(t, { scale: 1 }, 300, 'Back.out'); await this.tw(st, { y: GY + 400 }, 420, 'Back.out');
    this.tweens.add({ targets: st, angle: { from: -5, to: 5 }, duration: 160, yoyo: true, repeat: 3 }); this.burst('confetti', 360, GY + 300, 50); await this.wait(1300);
    this.tw(t, { scale: 0 }, 200).then(() => t.destroy()); await this.tw(st, { y: GY + CH * 5 + 340 }, 320, 'Back.in'); st.destroy();
  };
  P.henDo = async function () {
    const k = this.cine(); k.add(this.add.image(0, 0, 'curtain').setOrigin(0).setScale(2).setTint(0xff7ab8)); k.bars(); Sfx.music('bonus');
    const d = this.add.image(360, -100, 'disco').setScale(1.3); k.add(d); this.tweens.add({ targets: d, y: 170, duration: 600, ease: 'Bounce.out' }); this.tweens.add({ targets: d, angle: { from: -8, to: 8 }, duration: 600, yoyo: true, repeat: -1 });
    const title = this.tx(360, 400, 'HEN DO!', 150, '#ffe27a', { st: 22 }); title.setShadow(0, 9, '#ff2e7e', 0, true, false); k.add(title); await this.slam(title); Sfx.fanfare(5); this.burst('confetti', 360, 600, 90);
    k.add(this.tx(360, 520, '3 extra spins. No small fry. Only nans.', 28, '#fff', { font: BODY, st: 4 }));
    ['MABEL', 'BRENDA', 'DOTTIE', 'VIOLET', 'GLADYS'].forEach((n, i) => { const a = this.add.image(88 + i * 136, 1500, 'full_' + n).setOrigin(0.5, 1).setScale(n === 'DOTTIE' ? 1.4 : 1.15); k.add(a); this.tweens.add({ targets: a, y: 1130, duration: 420, delay: i * 90, ease: 'Back.out', onComplete: () => this.tweens.add({ targets: a, y: 1090, angle: { from: -9, to: 9 }, duration: 210 + i * 12, yoyo: true, repeat: -1, ease: 'Sine.inOut' }) }); const sash = this.tx(88 + i * 136, 830, ['BRIDE', 'MAID', 'CHIEF', 'TROUBLE', 'DRIVER'][i], 20, '#ff2e7e', { st: 4 }).setAngle(-12).setAlpha(0); k.add(sash); this.tweens.add({ targets: sash, alpha: 1, delay: 700 + i * 90, duration: 200 }); });
    ['L-PLATES ON, KNICKERS OPTIONAL', 'lock up your grandsons', 'WAHEYYYY'].forEach((m, i) => this.time.delayedCall(400 + i * 400, () => this.chat(m)));
    await this.wait(2600); Sfx.music('free'); await this.cineEnd(k);
  };
  P.maxWin = async function (total) {
    await this.driveOff(); const k = this.cine(false); k.canSkip = false; k.add(this.add.rectangle(W / 2, H / 2, W, H, 0x000000)); const noise = [];
    for (let i = 0; i < 70; i++) { const r = this.add.rectangle(Math.random() * W, Math.random() * H, 40 + Math.random() * 260, 3 + Math.random() * 9, 0xffffff, 0.2 + Math.random() * 0.5); k.add(r); noise.push(r); }
    const nz = this.time.addEvent({ delay: 60, loop: true, callback: () => noise.forEach(r => r.setPosition(Math.random() * W, Math.random() * H)) }); Sfx.whoosh(); this.shake(900, 0.02);
    const v = this.tx(360, 240, 'VIEWERS: ' + this.viewers.toLocaleString('en-GB'), 44, '#fff', { st: 8 }); k.add(v); const o = { n: this.viewers }; const tk = this.time.addEvent({ delay: 60, loop: true, callback: () => Sfx.tick() });
    await this.tw(o, { n: 1000000, onUpdate: () => v.setText('VIEWERS: ' + Math.round(o.n).toLocaleString('en-GB')) }, 1600, 'Cubic.in'); tk.remove(); nz.remove(); noise.forEach(r => r.destroy());
    const rays = this.add.image(360, 620, 'rays').setScale(3.2).setAlpha(0.6).setTint(0xffc21a); k.add(rays); this.rays = rays;
    const t1 = this.tx(360, 360, 'DOTTIE BROKE\nTHE INTERNET', 80, '#ff7ab8', { st: 15, ls: -12 }); k.add(t1); await this.slam(t1); Sfx.fanfare(6);
    const dq = this.add.image(360, 980, 'big_DOTTIE').setScale(1.2), cr = this.add.image(360, -100, 'crown').setScale(1.5); k.add([dq, cr]); this.tweens.add({ targets: cr, y: 770, duration: 700, ease: 'Bounce.out' }); this.tweens.add({ targets: dq, scale: 1.28, duration: 300, yoyo: true, repeat: -1 });
    const t2 = this.tx(360, 560, `MAX WIN ${E.MAX_WIN.toLocaleString('en-GB')}x`, 70, '#ffe27a', { st: 14 }), t3 = this.tx(360, 660, money(total), 84, '#fff', { st: 16 }); k.add([t2, t3]); await this.slam(t2, 2.5);
    const coins = this.time.addEvent({ delay: 90, loop: true, callback: () => { this.burst('coin', Math.random() * W, 900, 4); this.burst('confetti', Math.random() * W, 700, 6); } });
    const st = this.add.container(360, 1150).setAngle(-10).setScale(3).setAlpha(0); st.add([this.add.rectangle(0, 0, 520, 96, 0xe0245e).setStrokeStyle(6, 0xffffff), this.tx(0, 0, 'BANNED FOR LIFE', 54, '#fff', { st: 0 })]); k.add(st); await this.wait(900); await this.tw(st, { scale: 1, alpha: 1 }, 200, 'Cubic.in'); Sfx.slam(); this.shake(300, 0.015);
    ['THE INTERNET IS DOWN', 'she has killed the wifi', 'I SAW EVERYTHING', 'worth it'].forEach((m, i) => this.time.delayedCall(i * 250, () => this.chat(m)));
    await this.wait(3200); coins.remove(); await this.cineEnd(k); this.driveBack();
  };
})();
