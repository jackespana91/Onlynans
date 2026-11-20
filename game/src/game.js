/* DOTTIE GOES LIVE — core scene: layout, grid, spin flow, boosts, HUD. Clips live in clips.js */
(function (g) {
  const E = Engine, W = 720, H = 1280, GX = 24, GY = 440, CW = 112, CH = 112, COLS = 6, ROWS = 5;
  const DISP = Art.DISP, BODY = Art.BODY, INK = '#24123a';
  const BETS = [0.2, 0.4, 1, 2, 5, 10, 20, 50, 100];
  const money = v => I18N.cur() + v.toLocaleString(I18N.lang === 'es' ? 'es-AR' : 'en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const cx = c => GX + CW * c + CW / 2, cy = r => GY + CH * r + CH / 2;
  const SYMCOL = { WILD: 0x4fc04a, TEA: 0xff8fc0, DENT: 0xff6f9c, BINGO: 0xffc21a, YARN: 0x2fd6c3, MABEL: 0xff8fc0, BRENDA: 0xb79cf2, VIOLET: 0xffd24a, GLADYS: 0x5ff0d9, DOTTIE: 0xffe27a, SCAT: 0x5fd1ff, MULT: 0xff5fa2, BONUS: 0xffe1a8 };
  const USERS = ['HornyHarry69', 'DirtyDerek', 'PensionerPaul', 'RandyRon', 'SaucySandra', 'BigBarry', 'LittleBluePillPhil', 'KnackeredKen', 'FruityFrank', 'GobbyGeoff', 'TenaTrev', 'ShaggerShirley'];
  const UCOL = ['#ff8fc0', '#5ff0d9', '#ffe27a', '#b79cf2', '#7fd4ff', '#ffb070'];
  const CHAT = {
    idle: ['GET YER BAPS OUT DOT', 'LOVE YA NANS!', 'phwoar, look at the slippers on that', "I'd ruin my good hip for you Dot", 'fancy a shag? xx', 'wife thinks I am at the allotment', 'bollocks, wrong stream. staying though', 'Dot you filthy mare', 'is this the bingo?', 'MAUREEN IS THAT YOU', 'show us your bloomers', 'my teeth are in a glass and I am READY', 'who else is here in just socks', 'she can butter my crumpet', 'how do I turn this off. actually dont tell me'],
    win: ['GET IN, YOU DIRTY GIRL', 'jammy old tart', 'bloody hell Dot', "that's the gas bill sorted, you saucy cow", 'ooh she is getting frisky', 'winner winner, shag for dinner', 'go on, give it some'],
    big: ['SHAG ME SIDEWAYS', 'CALL THE VICAR. THEN CALL ME', "I've soiled me slacks", 'MY PACEMAKER', 'holy bollocks Dot', 'someone fetch my tablets, the blue ones', 'I need a lie down and a cigarette', 'SCREENSHOT IT MAUREEN'],
    lose: ['that was shite, Dot', 'seen more action in a hearse', 'limp. like Derek.', 'bugger all', 'arse.', 'my nan spins better and she is dead'],
    hello: ["she's on, trousers off lads", 'evening you saucy minx', 'first! ...as usual, says the wife', 'sound is quiet again Dot', 'new cardigan? take it off']
  };
  const SAY = {
    win: ['Ooh, you dirty sods!', "That's the spot.", 'Still got it. Still using it.', 'Ooh you are awful... harder!', 'Mind me knockers!'],
    big: ["Ooh, that's a big one. I've had bigger.", 'Hold onto your teeth. And your trousers!', 'More action than my wedding night!', "Bugger me, that's lovely."],
    lose: ['Bollocks.', 'Well, that was limp.', 'Hang on, me knickers have ridden up.', 'Arse.', "Tea first. Filth later."]
  };

  class Game extends Phaser.Scene {
    constructor() { super('game'); }
    /* ---------- helpers ---------- */
    tx(x, y, s, size, col, o) { o = o || {}; const t = this.add.text(x, y, s, { fontFamily: o.font || DISP, fontSize: size + 'px', color: col || '#fff', stroke: o.stroke === undefined ? INK : o.stroke, strokeThickness: o.st === undefined ? Math.max(3, Math.round(size * 0.17)) : o.st, align: o.align || 'center', wordWrap: o.wrap ? { width: o.wrap } : undefined, padding: { x: 4, y: 4 }, lineSpacing: o.ls || 0 }); t.setOrigin(o.ox === undefined ? 0.5 : o.ox, o.oy === undefined ? 0.5 : o.oy); return t; }
    tw(targets, props, duration, ease, extra) {
      return new Promise(res => { extra = extra || {}; const total = (extra.delay || 0) + duration * (extra.yoyo ? 2 : 1) * ((extra.repeat || 0) + 1) + 80; let done = false; const fin = () => { if (!done) { done = true; res(); } }; this.tweens.add(Object.assign({ targets, duration, ease: ease || 'Sine.out', onComplete: fin }, props, extra)); this.time.delayedCall(total, fin); });
    }
    wait(ms) { return new Promise(res => this.time.delayedCall(ms, res)); }
    ms(v) { return this.turbo ? v * 0.45 : v; }
    fast(on) { this.tweens.timeScale = on ? 5 : 1; this.time.timeScale = on ? 5 : 1; }
    burst(kind, x, y, n, tint) { const e = this.fx[kind]; if (!e) return; if (this.ov > 0) x += 3000; if (tint !== undefined) e.setParticleTint(tint); e.explode(n, x, y); }

    create() {
      if (this._ld) { this._ld.destroy(); this._ld = null; } if (Sfx.ext !== this.sound) { Sfx.ext = this.sound; Sfx.song = null; Sfx.songObj = null; this.sound.mute = Sfx.muted; }
      if (!this.textures.exists('bg')) Art.build(this);
      const R = this.registry.get('keep') || window.__keep || {}; window.__keep = null; this.land = this.scale.gameSize.width > this.scale.gameSize.height;
      this.betIdx = R.betIdx === undefined ? 2 : R.betIdx; this.bet = BETS[this.betIdx]; this.balance = R.balance === undefined ? 5000 : R.balance; this.busy = false; this.live = false; this.modal = false; this.asleep = false; this.exprLock = false; this.sipping = false; this.away = false; this.auto = false; this.turbo = false; this.cells = []; this.tips = R.tips || {}; this.lossStreak = 0; this.outfit = 0; this.betBoost = R.betBoost || null; this.viewers = 4699; this.scrollers = []; this.mode = 'base';
      this.bgImg = this.add.image(0, 0, 'bg').setOrigin(0).setScale(2); this.setupCams();
      this.add.particles(0, 0, 'heart', { x: { min: 0, max: W }, y: H + 30, speedY: { min: -70, max: -30 }, speedX: { min: -12, max: 12 }, scale: { min: 0.25, max: 0.7 }, alpha: { start: 0.28, end: 0 }, lifespan: 16000, frequency: 700, rotate: { min: -20, max: 20 } }).setDepth(1);
      if (!this.land) this.buildHeader(); this.buildStream(); this.buildMeter(); this.buildGrid(); this.buildHud(); this.buildFx(); this.buildExtras();
      this.input.keyboard && this.input.keyboard.on('keydown-SPACE', () => this.onSpinBtn());
      this.time.addEvent({ delay: 3800, loop: true, callback: () => { if (this.live && Math.random() < 0.7) this.chat(pick(CHAT.idle)); } });
      this.time.addEvent({ delay: 1300, loop: true, callback: () => { if (this.live) this.setViewers(this.viewers + Math.round((Math.random() - 0.45) * 14)); } });
      this.fillIdle(); this.refreshBet(); this.setTip(this.tips[this.betIdx] || 0, true); this.applyLayout(this.land);
      if (R.live) { this.live = true; Sfx.music('base'); } else this.splash();
      g.__game = this;
    }
    update(t, dt) { this.scrollers.forEach(s => { if (s.o.active) s.o.tilePositionX += s.v * dt / 1000 * this.tweens.timeScale; }); if (this.rays && this.rays.active) this.rays.angle += dt * 0.02; }

    /* ---------- layout ---------- */
    buildHeader() {
      const a = this.tx(214, 46, 'DOTTIE', 62, '#ffe27a', { st: 10 }), b = this.tx(486, 50, 'GOES LIVE', 46, '#ff7ab8', { st: 9 });
      a.setShadow(0, 5, '#ff9d00', 0, true, false); b.setShadow(0, 4, '#8a2be0', 0, true, false); this.logo = [a, b];
      this.tweens.add({ targets: a, angle: { from: -2, to: 2 }, duration: 2200, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      this.tweens.add({ targets: b, scale: { from: 1, to: 1.05 }, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    }
    buildStream() {
      const L = this.land, SP = this.SP = L
        ? { x: -12000, y: 0, w: 740, h: 764, dot: [330, 690], chat: [56, 96], live: [20, 104], bubble: [566, 470], sc: [20, 590], tip: [170, 722], hen: [220, 716], zz: [350, 150], sign: [330, 330], lab: [330, 650], cloud: [160, 170], room: 'studio', deck: 'deck_tall' }
        : { x: 16, y: 92, w: 688, h: 300, dot: [206, 302], chat: [0, 0], live: [14, 14], bubble: [300, 44], sc: [14, 226], tip: [14, 262], hen: [14, 262], zz: [300, 96], sign: [206, 150], lab: [206, 250], cloud: [120, 50], room: 'room', deck: 'deck' };
      const SX = SP.x, SY = SP.y, s = this.add.container(SX, SY).setDepth(10); this.stream = s;
      const mg = this.make.graphics(); mg.fillStyle(0xffffff); mg.fillRoundedRect(SX, SY, SP.w, SP.h, 22); s.setMask(mg.createGeometryMask());
      this.room = this.add.image(0, 0, SP.room).setOrigin(0); s.add(this.room);
      this.cloud = this.add.image(SP.cloud[0], SP.cloud[1], 'cloud').setScale(L ? 0.9 : 0.6).setVisible(false); s.add(this.cloud);
      this.tweens.add({ targets: this.cloud, x: SP.cloud[0] + 240, duration: 26000, yoyo: true, repeat: -1 });
      this.dFace = this.add.image(0, 0, 'dot_head_smile').setOrigin(0.5, 0.8); this.dShades = this.add.image(0, 0, 'dot_shades').setOrigin(0.5, 0.8).setVisible(false);
      let d;
      if (L) {
        const a = this.tx(230, 50, 'DOTTIE', 62, '#ffe27a', { st: 10 }), b = this.tx(510, 54, 'GOES LIVE', 46, '#ff7ab8', { st: 9 }); a.setShadow(0, 5, '#ff9d00', 0, true, false); b.setShadow(0, 4, '#8a2be0', 0, true, false); s.add([a, b]);
        this.tweens.add({ targets: a, angle: { from: -2, to: 2 }, duration: 2200, yoyo: true, repeat: -1, ease: 'Sine.inOut' }); this.tweens.add({ targets: b, scale: { from: 1, to: 1.05 }, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
        d = this.add.container(SP.dot[0], SP.dot[1]).setScale(1.12); this.armRest = [0.45, 0]; this.bodyKey = 'scoot_dot_';
        this.dArmL = this.add.image(-84, -292, 'arm_bare').setOrigin(0.5, 0.06).setRotation(0.45); this.dArmR = this.add.image(0, 0, 'px').setVisible(false);
        this.dBody = this.add.image(0, 0, 'scoot_dot_0').setOrigin(0.5, 1); this.wheels = [this.add.image(-140, -54, 'wheel'), this.add.image(160, -54, 'wheel')];
        this.dHead = this.add.container(-44, -322).setScale(0.6); this.dHead.add([this.dFace, this.dShades]); d.add([this.dArmL, this.dBody, this.wheels[0], this.wheels[1], this.dHead, this.dArmR]);
        this.tweens.add({ targets: this.dBody, y: -3, duration: 160, yoyo: true, repeat: -1 }); this.desk = this.add.image(0, 0, 'px').setVisible(false); this.mug = this.add.image(0, 0, 'px').setVisible(false); s.add([this.desk, this.mug]);
      } else {
        d = this.add.container(SP.dot[0], SP.dot[1]).setScale(0.72); this.armRest = [0.22, -0.22]; this.bodyKey = 'dot_body_';
        this.dArmL = this.add.image(-116, -128, 'dot_arm_0').setOrigin(0.5, 0.06).setRotation(0.22); this.dArmR = this.add.image(116, -128, 'dot_arm_0').setOrigin(0.5, 0.06).setRotation(-0.22).setFlipX(true);
        this.dBody = this.add.image(0, 0, 'dot_body_0').setOrigin(0.5, 1); this.dHead = this.add.container(0, -222); this.dHead.add([this.dFace, this.dShades]); d.add([this.dArmL, this.dArmR, this.dBody, this.dHead]);
        this.tweens.add({ targets: this.dBody, scaleY: { from: 1, to: 1.025 }, duration: 1300, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      }
      this.dot = d; this.dotHome = SP.dot[1]; s.add(d);
      this.tweens.add({ targets: this.dHead, angle: { from: -3, to: 3 }, duration: 1700, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      this.time.addEvent({ delay: 2900, loop: true, callback: () => { if (!this.exprLock) { this.dFace.setTexture('dot_head_blink'); this.time.delayedCall(130, () => { if (!this.exprLock) this.dFace.setTexture('dot_head_smile'); }); } } });
      if (!L) { this.desk = this.add.image(206, 300, 'desk').setOrigin(0.5, 1).setScale(0.92); s.add(this.desk); this.mug = this.add.image(318, 236, 'mug').setScale(0.6); s.add(this.mug); }
      // live badge
      const lv = this.add.container(SP.live[0], SP.live[1]), lb = this.add.graphics(); lb.fillStyle(0xff2e4d).fillRoundedRect(0, 0, 74, 30, 9).lineStyle(3, 0x24123a).strokeRoundedRect(0, 0, 74, 30, 9);
      const dotc = this.add.circle(16, 15, 6, 0xffffff); this.tweens.add({ targets: dotc, alpha: 0.2, duration: 600, yoyo: true, repeat: -1 }); lv.add([lb, dotc, this.tx(46, 15, 'LIVE', 19, '#fff', { st: 0 })]); s.add(lv);
      // chat panel
      const cc = this.add.container(SP.chat[0], SP.chat[1]); s.add(cc);
      const cg = this.add.graphics(); cg.fillStyle(0x120726, 0.78).fillRoundedRect(424, 10, 254, 280, 16).lineStyle(3, 0xb79cf2, 0.9).strokeRoundedRect(424, 10, 254, 280, 16); cg.fillStyle(0x6a35d9).fillRoundedRect(424, 10, 254, 36, { tl: 16, tr: 16, bl: 0, br: 0 });
      this.viewTxt = this.tx(612, 28, '4,699', 18, '#ffe27a', { ox: 0, st: 3 }); this.chatBox = this.add.container(0, 0);
      cc.add([cg, this.tx(436, 28, 'LIVE CHAT', 18, '#fff', { ox: 0, st: 3 }), this.add.image(598, 28, 'heart').setScale(0.4), this.viewTxt, this.chatBox]);
      const cm = this.make.graphics(); cm.fillStyle(0xffffff).fillRect(SX + SP.chat[0] + 424, SY + SP.chat[1] + 48, 254, 240); this.chatBox.setMask(cm.createGeometryMask()); this.chatLines = [];
      // speech bubble
      this.bubble = this.add.container(SP.bubble[0], SP.bubble[1]).setAlpha(0); const bi = this.add.image(0, 0, 'bubble').setScale(L ? 1.05 : 0.86).setFlipY(L); this.bubTxt = this.tx(0, L ? 12 : -10, '', L ? 20 : 17, INK, { font: BODY, st: 0, wrap: L ? 260 : 212 }); this.bubTxt.setFontStyle('bold'); this.bubble.add([bi, this.bubTxt]); s.add(this.bubble);
      // superchat banner
      this.sc = this.add.container(-420, SP.sc[1]); const sg = this.add.graphics(); sg.fillStyle(0xffc21a).fillRoundedRect(0, -24, 400, 48, 14).lineStyle(4, 0x24123a).strokeRoundedRect(0, -24, 400, 48, 14); this.scTxt = this.tx(52, 0, '', 16, INK, { font: BODY, st: 0, ox: 0, wrap: 340 }); this.scTxt.setFontStyle('bold'); this.sc.add([sg, this.add.image(26, 0, 'coin').setScale(0.7), this.scTxt]); s.add(this.sc);
      const fr = this.add.graphics().setDepth(11); fr.lineStyle(5, 0xffc94a).strokeRoundedRect(SX, SY, SP.w, SP.h, 22); fr.lineStyle(2, 0x24123a).strokeRoundedRect(SX - 3, SY - 3, SP.w + 6, SP.h + 6, 24);
    }
    dotPos(dy) { return [this.SP.x + this.dot.x, this.SP.y + this.dot.y - (this.land ? 260 : 60) + (dy || 0)]; }
    async dotLeave() { if (this.away) return; this.away = true; if (!this.land) return this.tw(this.dot, { y: this.dotHome + 300 }, 350, 'Back.in'); Sfx.engine(); this.wake && this.wake(); this.dot.setAngle(-7); this.tweens.add({ targets: this.wheels, angle: '+=1440', duration: 800 }); const p = this.time.addEvent({ delay: 60, repeat: 11, callback: () => this.burst('puff', this.SP.x + this.dot.x - 170, this.SP.y + this.dot.y - 40, 1, 0xffffff) }); await this.tw(this.dot, { x: this.SP.w + 460 }, 760, 'Quad.in'); p.remove(); }
    async dotReturn() { if (!this.away) return; this.away = false; if (!this.land) return this.tw(this.dot, { y: this.dotHome }, 350, 'Back.out'); Sfx.engine(); this.dot.setAngle(0); this.dot.x = -460; this.tweens.add({ targets: this.wheels, angle: '+=1080', duration: 900, ease: 'Cubic.out' }); await this.tw(this.dot, { x: this.SP.dot[0] }, 900, 'Cubic.out'); this.tweens.add({ targets: this.dot, angle: 4, duration: 120, yoyo: true }); }
    async driveOff() { if (this.land) await this.dotLeave(); }
    driveBack() { if (this.land) this.dotReturn(); }
    buildMeter() {
      const y = 410; this.tx(24, y, 'VIRAL', 20, '#ff7ab8', { ox: 0, st: 4 }); this.pips = [];
      const g2 = this.add.graphics().setDepth(12); g2.fillStyle(0x120726, 0.85).fillRoundedRect(104, y - 13, 470, 26, 13).lineStyle(3, 0xb79cf2).strokeRoundedRect(104, y - 13, 470, 26, 13);
      for (let i = 0; i < 7; i++) { const p = this.add.image(134 + i * 68, y, 'heart').setScale(0.42).setDepth(13).setTint(0x4a3a70); this.pips.push(p); if (E.VIRAL[i + 1]) this.tx(134 + i * 68, y - 1, '+x' + E.VIRAL[i + 1], 14, '#fff', { st: 3 }).setDepth(14); }
      this.viralTxt = this.tx(640, y, 'x0', 26, '#6a5a90', { st: 4 }).setDepth(13);
    }
    setMeter(n, viral) { this.pips.forEach((p, i) => { const on = i < n; if (on && p.tintTopLeft !== 0xffffff) { p.clearTint(); this.tweens.add({ targets: p, scale: { from: 0.9, to: 0.48 }, duration: 300, ease: 'Back.out' }); } if (!on) { p.setTint(0x4a3a70); p.setScale(0.42); } }); if (viral !== undefined) { this.viralTxt.setText('x' + viral).setColor(viral ? '#ffe27a' : '#6a5a90'); } }
    buildGrid() {
      this.frameG = this.add.graphics().setDepth(19); this.drawFrame(0xffc94a);
      this.cellLayer = this.add.container(0, 0).setDepth(20);
      const m = this.make.graphics(); m.fillStyle(0xffffff).fillRoundedRect(GX - 6, GY - 6, CW * COLS + 12, CH * ROWS + 12, 16); this.cellLayer.setMask(m.createGeometryMask());
      this.teaseG = this.add.rectangle(0, GY + CH * ROWS / 2, CW, CH * ROWS, 0xffe27a, 0.25).setDepth(21).setVisible(false);
    }
    drawFrame(col) { const f = this.frameG; f.clear(); f.fillStyle(0x0e0520, 0.82).fillRoundedRect(GX - 10, GY - 10, CW * COLS + 20, CH * ROWS + 20, 20); for (let c = 0; c < COLS; c++) if (c % 2) f.fillStyle(0xffffff, 0.035).fillRect(GX + c * CW, GY, CW, CH * ROWS); f.lineStyle(6, col).strokeRoundedRect(GX - 10, GY - 10, CW * COLS + 20, CH * ROWS + 20, 20); f.lineStyle(2, 0x24123a).strokeRoundedRect(GX - 14, GY - 14, CW * COLS + 28, CH * ROWS + 28, 23); }
    buildFx() {
      const mk = (tex, cfg) => this.add.particles(0, 0, tex, Object.assign({ emitting: false, speed: { min: 120, max: 360 }, angle: { min: 0, max: 360 }, lifespan: 650, gravityY: 600, rotate: { min: 0, max: 360 } }, cfg)).setDepth(150);
      this.fx = {
        spark: mk('spark', { scale: { start: 1.3, end: 0 }, gravityY: 200, blendMode: 'ADD' }),
        star: mk('star', { scale: { start: 0.6, end: 0 }, lifespan: 800 }),
        heart: mk('heart', { scale: { start: 0.7, end: 0.1 }, lifespan: 1000, gravityY: -200, speed: { min: 60, max: 240 } }),
        thumb: mk('thumb', { scale: { start: 0.7, end: 0.2 }, lifespan: 1300, gravityY: -260, speed: { min: 40, max: 200 }, rotate: { min: -20, max: 20 } }),
        coin: mk('coin', { scale: { min: 0.4, max: 0.8 }, lifespan: 1500, gravityY: 1100, speed: { min: 300, max: 760 }, angle: { min: 230, max: 310 } }),
        puff: mk('puff', { scale: { start: 0.3, end: 1.4 }, alpha: { start: 0.8, end: 0 }, lifespan: 700, gravityY: -40, speed: { min: 20, max: 120 } }),
        drop: mk('drop', { scale: { start: 0.9, end: 0.3 }, lifespan: 500, gravityY: 900, speed: { min: 80, max: 260 }, angle: { min: 200, max: 340 } }),
        confetti: mk('confetti', { scale: { min: 0.7, max: 1.4 }, lifespan: 2200, gravityY: 500, speed: { min: 200, max: 700 }, angle: { min: 220, max: 320 }, tint: [0xff5fa2, 0xffe27a, 0x5ff0d9, 0xb79cf2, 0xffffff] })
      };
    }
    btn(x, y, tex, label, cb, size, scale) { const k = this.add.container(x, y).setDepth(50); const im = this.add.image(0, 0, tex); k.add(im); k.im = im; if (label) { k.lab = this.tx(0, 1, label, size || 17, '#fff', { st: 4 }); k.add(k.lab); } if (scale) k.setScale(scale); k.base = scale || 1; im.setInteractive({ useHandCursor: true }); im.on('pointerdown', () => { if (this.modal && !k.modalOk) return; Sfx.init(); Sfx.click(); this.tweens.add({ targets: k, scale: k.base * 0.9, duration: 70, yoyo: true }); cb(); }); return k; }
    buildHud() {
      // win row
      this.winLab = this.tx(360, 1010, '', 20, '#b79cf2', { st: 4 }).setDepth(50); this.winTxt = this.tx(360, 1040, '', 42, '#ffe27a', { st: 8 }).setDepth(50); this.winVal = 0;
      this.buyBtn = this.btn(112, 1036, 'pill', '', () => this.openBuy(), 0, 0.82); this.buyLab = this.tx(0, 0, 'BUY BONUS', 22, '#fff', { st: 5 }); this.buyBtn.add(this.buyLab);
      this.boostBtn = this.btn(608, 1036, 'pill_p', '', () => this.openBoost(), 0, 0.82); this.boostLab = this.tx(0, 0, 'BET BOOST', 22, '#fff', { st: 5 }); this.boostBtn.add(this.boostLab);
      this.fsPanel = this.add.container(112, 1036).setDepth(50).setVisible(false); const fg = this.add.graphics(); fg.fillStyle(0x0e9c8c).fillRoundedRect(-96, -30, 192, 60, 18).lineStyle(4, 0x24123a).strokeRoundedRect(-96, -30, 192, 60, 18); this.fsTxt = this.tx(0, 0, '', 20, '#fff', { st: 4, ls: -4 }); this.fsPanel.add([fg, this.fsTxt]);
      this.multBadge = this.add.container(612, 1036).setDepth(50).setAlpha(0); this.multBadge.add([this.add.image(0, 0, 'sym_MULT').setScale(0.56), this.multTxt = this.tx(0, -2, 'x0', 28, '#fff', { st: 6 }), this.multLab = this.tx(0, 40, '', 14, '#ffb3d6', { st: 3 })]);
      // controls
      const D = this.land, HP = D ? { spin: [800, 1460, 0.6], info: [1076, 1460], turbo: [682, 1460], auto: [918, 1460], snd: [1164, 1460], buy: [300, 1460], boost: [508, 1460], balL: [40, 1438], bal: [40, 1470], betL: [1400, 1438], bet: [1400, 1470], minus: [1300, 1468], plus: [1500, 1468] } : { spin: [360, 1172, 1], info: [64, 1150], turbo: [166, 1150], auto: [554, 1150], snd: [656, 1150], buy: [112, 1036], boost: [608, 1036], balL: [24, 1226], bal: [24, 1252], betL: [596, 1226], bet: [596, 1252], minus: [508, 1250], plus: [686, 1250] };
      if (D) { const bar = this.add.graphics().setDepth(49); bar.fillStyle(0x0e0520, 0.9).fillRect(0, 1400, 1600, 120).lineStyle(4, 0xffc94a).lineBetween(0, 1402, 1600, 1402); }
      this.buyBtn.setPosition(HP.buy[0], HP.buy[1]); this.boostBtn.setPosition(HP.boost[0], HP.boost[1]);
      this.spinBtn = this.btn(HP.spin[0], HP.spin[1], 'btn_spin', '', () => this.onSpinBtn(), 0, HP.spin[2]);
      this.tweens.add({ targets: this.spinBtn.im, angle: 360, duration: 9000, repeat: -1 });
      this.btn(HP.info[0], HP.info[1], 'btn_sm', 'INFO', () => this.openInfo(), 18, 0.86);
      this.turboBtn = this.btn(HP.turbo[0], HP.turbo[1], 'btn_sm', 'TURBO', () => { this.turbo = !this.turbo; this.turboBtn.im.setTexture(this.turbo ? 'btn_on' : 'btn_sm'); }, 15, 0.86);
      this.autoBtn = this.btn(HP.auto[0], HP.auto[1], 'btn_sm', 'AUTO', () => { this.auto = !this.auto; this.autoBtn.im.setTexture(this.auto ? 'btn_on' : 'btn_sm'); if (this.auto && !this.busy) this.spin(); }, 17, 0.86);
      this.sndState = Sfx.muted ? 2 : Sfx.voice ? 0 : 1; this.sndBtn = this.btn(HP.snd[0], HP.snd[1], 'btn_sm', ['VOICE', 'SOUND', 'MUTED'][this.sndState], () => { this.sndState = (this.sndState + 1) % 3; Sfx.voice = this.sndState === 0; Sfx.setMute(this.sndState === 2); this.sndBtn.lab.setText(['VOICE', 'SOUND', 'MUTED'][this.sndState]); }, 14, 0.86);
      this.tx(HP.balL[0], HP.balL[1], 'DEMO BALANCE', 15, '#b79cf2', { ox: 0, st: 3 }).setDepth(50); this.balTxt = this.tx(HP.bal[0], HP.bal[1], money(this.balance), D ? 30 : 26, '#fff', { ox: 0, st: 5 }).setDepth(50);
      this.betLab = this.tx(HP.betL[0], HP.betL[1], 'BET', 15, '#b79cf2', { st: 3 }).setDepth(50); this.betTxt = this.tx(HP.bet[0], HP.bet[1], money(this.bet), D ? 30 : 26, '#fff', { st: 5 }).setDepth(50);
      this.btn(HP.minus[0], HP.minus[1], 'btn_sm', '–', () => this.changeBet(-1), 30, 0.5); this.btn(HP.plus[0], HP.plus[1], 'btn_sm', '+', () => this.changeBet(1), 30, 0.5);
    }
    changeBet(d) { if (this.busy) return; this.betIdx = Phaser.Math.Clamp(this.betIdx + d, 0, BETS.length - 1); this.bet = BETS[this.betIdx]; this.refreshBet(); this.setTip(this.tips[this.betIdx] || 0, true); }
    refreshBet() { const b = this.betBoost; this.betTxt.setText(money(this.bet * (b ? E.BOOSTS[b].cost : 1))); this.betLab.setText(b ? 'BET + BOOST' : 'BET').setColor(b ? '#ffe27a' : '#b79cf2'); this.boostLab.setText(b === 'cruise' ? 'FRISKY +25%' : b === 'chat' ? 'GOBBY +50%' : 'BET BOOST'); this.boostBtn.im.setTexture(b ? 'pill' : 'pill_p'); }
    setBal(v) { this.balance = v; this.balTxt.setText(money(v)); }
    setWin(v, dur, label) {
      if (label !== undefined) this.winLab.setText(label);
      if (!v) { this.winVal = 0; this.winTxt.setText(''); if (label === undefined) this.winLab.setText(''); return Promise.resolve(); }
      if (!this.winLab.text) this.winLab.setText('WIN');
      const o = { v: this.winVal }; this.winVal = v;
      this.tweens.add({ targets: this.winTxt, scale: { from: 1.3, to: 1 }, duration: 260, ease: 'Back.out' });
      if (!dur) { this.winTxt.setText(money(v)); return Promise.resolve(); }
      return this.tw(o, { v, onUpdate: () => this.winTxt.setText(money(o.v)) }, dur, 'Cubic.out').then(() => this.winTxt.setText(money(v)));
    }
    setViewers(v) { this.viewers = Math.max(900, v); this.viewTxt.setText(this.viewers.toLocaleString('en-GB')); }
    bumpViewers(n) { const o = { v: this.viewers }; this.tweens.add({ targets: o, v: this.viewers + n, duration: 800, onUpdate: () => this.setViewers(Math.round(o.v)) }); this.tweens.add({ targets: this.viewTxt, scale: { from: 1.5, to: 1 }, duration: 400 }); }

    /* ---------- chat + Dottie ---------- */
    chat(msg, user, col) {
      user = user || pick(USERS); col = col || UCOL[USERS.indexOf(user) % UCOL.length] || '#fff';
      const line = this.add.container(434, 0), n = this.tx(0, 0, user, 14, col, { font: BODY, st: 0, ox: 0, oy: 0 }); n.setFontStyle('bold');
      const m = this.tx(0, 17, msg, 15, '#fff', { font: BODY, st: 0, ox: 0, oy: 0, wrap: 232, align: 'left' }); line.add([n, m]); line.h = 17 + m.height + 5;
      this.chatBox.add(line); this.chatLines.push(line); let y = 288;
      for (let i = this.chatLines.length - 1; i >= 0; i--) { const l = this.chatLines[i]; y -= l.h; if (i === this.chatLines.length - 1) { l.y = y + 20; l.alpha = 0; this.tweens.add({ targets: l, y, alpha: 1, duration: 200 }); } else this.tweens.add({ targets: l, y, duration: 200 }); }
      while (this.chatLines.length > 7) { const l = this.chatLines.shift(); this.tweens.killTweensOf(l); l.destroy(); }
    }
    say(t, ms) { if (this.asleep) return; Sfx.speak(I18N.tr(t)); this.bubTxt.setText(t); this.tweens.killTweensOf(this.bubble); this.bubble.setAlpha(1).setScale(0.3); this.tweens.add({ targets: this.bubble, scale: 1, duration: 260, ease: 'Back.out' }); this.tweens.add({ targets: this.bubble, alpha: 0, delay: ms || 2000, duration: 250 }); }
    expr(e, ms) { if (this.asleep) return; this.exprLock = true; this.dFace.setTexture('dot_head_' + e); if (this._ex) this._ex.remove(); this._ex = this.time.delayedCall(ms || 1100, () => { this.exprLock = false; this.dFace.setTexture('dot_head_smile'); }); }
    cheer(big) { this.expr('laugh', big ? 1800 : 1000); this.tweens.add({ targets: this.dArmL, rotation: 2.6, duration: 180, yoyo: true, repeat: big ? 5 : 1, ease: 'Sine.inOut', onComplete: () => this.dArmL.setRotation(this.armRest[0]) }); this.tweens.add({ targets: this.dArmR, rotation: -2.6, duration: 180, yoyo: true, repeat: big ? 5 : 1, ease: 'Sine.inOut', onComplete: () => this.dArmR.setRotation(this.armRest[1]) }); this.tweens.add({ targets: this.dot, y: this.dotHome - (big ? 26 : 12), duration: 150, yoyo: true, repeat: big ? 5 : 1, onComplete: () => this.dot.y = this.dotHome }); }
    sip() { if (this.land || this.mode !== 'base' || this.sipping) return; this.sipping = true; this.expr('blink', 1500); this.tweens.add({ targets: this.mug, x: 232, y: 150, angle: -28, duration: 420, yoyo: true, hold: 600, ease: 'Sine.inOut', onComplete: () => this.sipping = false }); this.tweens.add({ targets: this.dArmR, rotation: 1.9, x: 96, duration: 420, yoyo: true, hold: 600 }); }
    async superchat(amount, user, msg) { this.scTxt.setText(`${user} sent ${amount}: "${msg}"`); Sfx.ding(); this.chat(`sent ${amount}! ${msg}`, user, '#ffe27a'); await this.tw(this.sc, { x: this.SP.sc[0] }, 320, 'Back.out'); this.time.delayedCall(2400, () => this.tweens.add({ targets: this.sc, x: -420, duration: 300 })); }
    setTheme(mode) {
      this.mode = mode; const free = mode === 'free';
      this.room.setTexture(free ? this.SP.deck : this.SP.room); this.desk.setVisible(!free && !this.land); this.mug.setVisible(!free && !this.land); this.dShades.setVisible(free); this.cloud.setVisible(free);
      this.dot.y = this.dotHome = this.land ? this.SP.dot[1] : free ? 352 : 302; this.drawFrame(free ? 0x5ff0d9 : 0xffc94a);
      this.buyBtn.setVisible(!free); this.boostBtn.setVisible(false); this.fsPanel.setVisible(free); this.tipBar.setVisible(!free); this.henRow.setVisible(free); if (free) this.henRow.list.forEach(o => { if (o.nan) o.setTint(0x30204a); }); Sfx.music(free ? 'free' : 'base');
    }

    /* ---------- cells ---------- */
    makeCell(c, r, d) {
      const k = this.add.container(cx(c), cy(r)); const wild = d.s === 'WILD', img = this.add.image(0, 0, wild ? 'sym_WILD_' + d.part : 'sym_' + d.s); img.setScale(wild ? 112 / 160 : 106 / 160); k.add(img); k.img = img; k.d = d;
      if (d.s === 'MULT') this.addMultTxt(k, d.v);
      this.cellLayer.add(k);
      const big = d.s === 'MULT' || d.s === 'SCAT' || d.s === 'BONUS';
      if (!wild) this.tweens.add({ targets: img, scale: (106 / 160) * (big ? 1.08 : 1.035), angle: big ? 0 : { from: -1.5, to: 1.5 }, duration: big ? 520 : 1100 + Math.random() * 500, delay: Math.random() * 800, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      return k;
    }
    addMultTxt(k, v) { k.txt = this.tx(0, -4, 'x' + v, v >= 100 ? 32 : 40, '#fff', { st: 8 }); k.add(k.txt); }
    setCell(k, d) { k.d = d; if (d.s === 'WILD') { this.tweens.killTweensOf(k.img); k.img.setAngle(0).setScale(112 / 160); } k.img.setTexture(d.s === 'WILD' ? 'sym_WILD_' + d.part : 'sym_' + d.s); if (k.txt) { k.txt.destroy(); k.txt = null; } if (d.s === 'MULT') this.addMultTxt(k, d.v); }
    killCell(k) { if (!k || !k.active) return; this.tweens.killTweensOf(k.img); this.tweens.killTweensOf(k); k.destroy(); }
    fillIdle() { const gr = E.spinOnce('base', 0).events[0].grid; for (let c = 0; c < COLS; c++) { this.cells[c] = []; for (let r = 0; r < ROWS; r++) { let d = gr[c][r]; if (!E.PAY_SYMS.includes(d.s)) d = { s: pick(E.PAY_SYMS) }; this.cells[c][r] = this.makeCell(c, r, d); } } }

    async reveal(grid) {
      Sfx.spin(); const old = this.cells; this.cells = [];
      for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) { const k = old[c] && old[c][r]; if (k) this.tw(k, { y: k.y + 700 }, this.ms(260), 'Quad.in', { delay: this.ms(c * 35 + (ROWS - 1 - r) * 16) }).then(() => this.killCell(k)); }
      await this.wait(this.ms(230));
      let scat = 0, delay = 0; const lands = [], need = this.mode === 'free' ? 2 : 3;
      for (let c = 0; c < COLS; c++) {
        this.cells[c] = []; const tease = scat >= need && c >= 2 && !this.turbo;
        if (tease) { const d0 = delay; this.time.delayedCall(d0, () => { Sfx.tease(); this.teaseG.setPosition(cx(c), GY + CH * ROWS / 2).setVisible(true).setAlpha(0.1); this.tweens.add({ targets: this.teaseG, alpha: 0.4, duration: 130, yoyo: true, repeat: 2 }); }); delay += 620; }
        let cs = 0;
        for (let r = 0; r < ROWS; r++) {
          const d = grid[c][r], k = this.makeCell(c, r, d); k.y = cy(r) - 740; this.cells[c][r] = k; if (d.s === 'SCAT') cs++;
          const idx = scat + cs;
          lands.push(this.tw(k, { y: cy(r) }, this.ms(430), 'Bounce.out', { delay: delay + this.ms((ROWS - 1 - r) * 26) }).then(() => { if (d.s === 'SCAT') { Sfx.scatter(idx); this.burst('spark', k.x, k.y, 14, 0x5fd1ff); this.tweens.add({ targets: k, scale: 1.3, duration: 160, yoyo: true }); } if (d.s === 'MULT') { Sfx.mult(d.v); this.burst('heart', k.x, k.y, 5); } if (d.s === 'BONUS') { Sfx.boing(); this.tweens.add({ targets: k, angle: { from: -14, to: 14 }, duration: 90, yoyo: true, repeat: 2, onComplete: () => k.angle = 0 }); } }));
        }
        this.time.delayedCall(delay + this.ms(200), () => { Sfx.land(c); if (tease) this.teaseG.setVisible(false); });
        scat += cs; delay += this.ms(80);
      }
      await Promise.all(lands);
    }
    async showWin(ev) {
      const hit = {}; ev.wins.forEach(w => w.positions.forEach(p => hit[p[0] + '_' + p[1]] = 1));
      for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) if (!hit[c + '_' + r] && this.cells[c][r]) this.cells[c][r].setAlpha(0.35);
      Sfx.win(ev.tumble); this.setMeter(ev.tumble);
      ev.wins.forEach((w, i) => {
        let sx = 0, sy = 0; w.positions.forEach(p => { const k = this.cells[p[0]][p[1]]; sx += k.x; sy += k.y; this.cellLayer.bringToTop(k); this.tweens.add({ targets: k, scale: 1.2, duration: this.ms(170), yoyo: true, repeat: 1, ease: 'Sine.inOut' }); this.tweens.add({ targets: k, angle: { from: -9, to: 9 }, duration: this.ms(85), yoyo: true, repeat: 3, onComplete: () => k.angle = 0 }); });
        const t = this.tx(Phaser.Math.Clamp(sx / w.count, 110, W - 110), sy / w.count + i * 46, `${w.count}x  ${money(w.pay * this.bet)}`, 34, '#fff', { st: 8 }).setDepth(45).setScale(0); t.setTint(0xffffff, 0xffffff, SYMCOL[w.sym], SYMCOL[w.sym]);
        this.tweens.add({ targets: t, scale: 1, duration: 220, ease: 'Back.out' }); this.tweens.add({ targets: t, y: t.y - 60, alpha: 0, delay: this.ms(650), duration: 350, onComplete: () => t.destroy() });
      });
      await this.wait(this.ms(700)); Sfx.pop(ev.tumble);
      ev.wins.forEach(w => w.positions.forEach(p => { const k = this.cells[p[0]][p[1]]; if (!k) return; this.cells[p[0]][p[1]] = null; this.burst('spark', k.x, k.y, 7, SYMCOL[w.sym]); this.burst('star', k.x, k.y, 2); this.tw(k, { scale: 0, angle: 200 }, this.ms(210), 'Back.in').then(() => this.killCell(k)); }));
      for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) if (this.cells[c][r]) this.cells[c][r].setAlpha(1);
      this.spinWin = ev.total * this.bet; this.setWin(this.baseShown + this.spinWin, 300);
      if (ev.tumble === 1) { this.cheer(false); if (Math.random() < 0.5) this.chat(pick(CHAT.win)); } else if (ev.tumble === 2) this.say(pick(SAY.win));
      this.bumpViewers(20 + ev.tumble * 30);
      await this.wait(this.ms(240));
    }
    async tumble(ev) {
      const ps = [];
      for (let c = 0; c < COLS; c++) {
        const keep = this.cells[c].filter(k => k), f = ev.fills[c];
        const news = f.map((d, i) => { const k = this.makeCell(c, 0, d); k.y = GY - CH * (f.length - i) + CH / 2 - 30; return k; });
        const col = news.concat(keep); this.cells[c] = col;
        col.forEach((k, r) => { if (Math.abs(k.y - cy(r)) > 1) ps.push(this.tw(k, { y: cy(r) }, this.ms(360), 'Bounce.out', { delay: this.ms(c * 30) }).then(() => { if (k.d.s === 'SCAT') { Sfx.scatter(3); this.burst('spark', k.x, k.y, 12, 0x5fd1ff); } if (k.d.s === 'MULT') { Sfx.mult(k.d.v); this.burst('heart', k.x, k.y, 5); } })); });
      }
      this.time.delayedCall(this.ms(220), () => Sfx.land(2));
      await Promise.all(ps);
    }
    async viral(ev) {
      const names = ['', 'TRENDING!', 'GONE VIRAL!', 'BANNED IN\n12 COUNTRIES!']; Sfx.viral(ev.level); this.setMeter(7 > ev.level * 2 + 1 ? ev.level * 2 + 1 : 7, ev.viral);
      const t = this.tx(360, GY + 250, `${names[ev.level]}\n+x${ev.add}`, 58, '#ffe27a', { st: 12, ls: -6 }).setDepth(46).setScale(0).setAngle(-6);
      this.shake(200, 0.006); this.expr('gasp', 1200); this.bumpViewers(800 * ev.level * ev.level);
      for (let i = 0; i < 16; i++) this.time.delayedCall(i * 45, () => { this.burst(i % 2 ? 'heart' : 'thumb', 40 + Math.random() * 60 + (i % 4 < 2 ? 0 : 580), H - 250 - Math.random() * 500, 2); });
      for (let i = 0; i < 3; i++) this.time.delayedCall(i * 180, () => this.chat(pick(CHAT.big)));
      await this.tw(t, { scale: 1 }, 320, 'Back.out'); await this.wait(this.ms(650)); await this.tw(t, { scale: 0, alpha: 0 }, 200); t.destroy();
    }
    async showMults(ev) {
      const free = ev.jar !== null; this.multLab.setText(free ? 'TIP JAR' : 'SPIN MULT');
      let sum = free ? ev.jar - ev.add : 0; this.multTxt.setText('x' + sum); this.tweens.add({ targets: this.multBadge, alpha: 1, duration: 150 });
      const fly = async (x, y, v) => { const t = this.tx(x, y, 'x' + v, 46, '#fff', { st: 9 }).setDepth(46); Sfx.mult(v); this.burst('heart', x, y, 6); await this.tw(t, { x: this.multBadge.x, y: this.multBadge.y, scale: 0.5 }, this.ms(380), 'Cubic.in'); t.destroy(); sum += v; this.multTxt.setText('x' + sum); this.tweens.add({ targets: this.multBadge, scale: { from: 1.5, to: 1 }, duration: 200 }); };
      for (const h of ev.hearts) { const k = this.cells[h.pos[0]][h.pos[1]]; this.tweens.add({ targets: k, scale: 1.35, duration: 150, yoyo: true }); await fly(k.x, k.y, h.v); }
      if (ev.viral) await fly(this.viralTxt.x, this.viralTxt.y, ev.viral);
      if (ev.dbl) { const d = this.tx(360, GY + 280, 'GLADYS DOUBLES IT!', 54, '#5ff0d9', { st: 11 }).setDepth(46).setScale(0); Sfx.viral(2); await this.tw(d, { scale: 1 }, 220, 'Back.out'); await this.wait(this.ms(450)); d.destroy(); this.multTxt.setText('x' + ev.jar); }
      await this.wait(this.ms(200));
      const big = this.tx(360, GY + 280, 'x' + ev.applied, 150, '#ff5fa2', { st: 18 }).setDepth(46).setScale(4).setAlpha(0);
      await this.tw(big, { scale: 1, alpha: 1 }, 260, 'Cubic.in'); Sfx.slam(); this.shake(260, 0.012); this.burst('star', 360, GY + 280, 24); this.cheer(true);
      this.spinWin = ev.after * this.bet; await this.setWin(this.baseShown + this.spinWin, this.ms(900));
      await this.tw(big, { scale: 0.2, alpha: 0, y: 1040 }, 260, 'Cubic.in'); big.destroy();
      if (!free) this.tweens.add({ targets: this.multBadge, alpha: 0, delay: 600, duration: 300 });
    }

    /* ---------- boosts ---------- */
    async flip(k, d) { await this.tw(k, { scaleX: 0 }, 90); this.setCell(k, d); this.burst('spark', k.x, k.y, 6, SYMCOL[d.s]); await this.tw(k, { scaleX: 1 }, 170, 'Back.out'); }
    async boost(ev) {
      const u = pick(USERS); this.bumpViewers(150);
      if (ev.kind === 'TEAPOT') {
        await this.superchat('£5', u, 'Get the kettle on, you saucy mare!'); this.say("Tea's up! Who wants a dunk?"); this.expr('wink', 1500);
        const pot = this.add.image(W + 180, GY - 40, 'teapot').setDepth(60); Sfx.whoosh();
        await this.tw(pot, { x: 590, y: GY + 20 }, 450, 'Back.out'); await this.tw(pot, { angle: -38 }, 200); Sfx.pour();
        const wob = this.tweens.add({ targets: pot, y: pot.y + 10, duration: 160, yoyo: true, repeat: -1 });
        const ps = ev.positions.map((p, i) => (async () => { await this.wait(i * 70); const k = this.cells[p[0]][p[1]], d = this.add.image(pot.x - 118, pot.y - 6, 'drop').setDepth(61).setScale(1.3); if (i % 3 === 0) Sfx.pour(); await this.tw(d, { x: k.x, y: k.y }, 230, 'Quad.in'); d.destroy(); this.burst('drop', k.x, k.y, 6); await this.flip(k, ev.grid[p[0]][p[1]]); })());
        await Promise.all(ps); wob.stop(); await this.tw(pot, { angle: 0 }, 150); this.tw(pot, { x: W + 200, y: GY - 80 }, 350, 'Back.in').then(() => pot.destroy());
      } else if (ev.kind === 'DENTURES') {
        await this.superchat('£10', u, 'Take your teeth out for us, Dot!'); this.say("Teeth out? That's extra, love."); this.expr('gasp', 1600);
        const d = this.add.container(-320, GY + CH * 2.5).setDepth(60).setScale(1.7), top = this.add.image(0, -60, 'dent_top'), bot = this.add.image(0, 60, 'dent_bot'); d.add([top, bot]);
        this.tweens.add({ targets: top, y: -10, angle: { from: -4, to: 4 }, duration: 75, yoyo: true, repeat: -1 }); this.tweens.add({ targets: bot, y: 10, duration: 75, yoyo: true, repeat: -1 });
        const ch = this.time.addEvent({ delay: 110, loop: true, callback: () => Sfx.chomp() }); const done = {};
        await this.tw(d, { x: W + 340, onUpdate: () => { ev.removed.forEach(p => { const key = p[0] + '_' + p[1]; if (!done[key] && d.x > cx(p[0]) - 60) { done[key] = 1; const k = this.cells[p[0]][p[1]]; this.cells[p[0]][p[1]] = null; this.burst('spark', k.x, k.y, 8, 0xffffff); this.tw(k, { scale: 0 }, 120).then(() => this.killCell(k)); } }); this.shake(60, 0.003); } }, 1500, 'Linear');
        ch.remove(); d.destroy(); await this.tumble(ev);
      } else if (ev.kind === 'CIGGIE') {
        await this.superchat('£2', u, 'Go have a ciggie, you are gagging'); this.say('Back in two ticks, you animals.', 900); await this.wait(600);
        this.dotLeave();
        const sign = this.add.container(this.SP.sign[0], this.SP.sign[1]).setScale(0); const sg = this.add.graphics(); sg.fillStyle(0xfff3d6).fillRoundedRect(-130, -46, 260, 92, 14).lineStyle(5, 0x24123a).strokeRoundedRect(-130, -46, 260, 92, 14); sign.add([sg, this.tx(0, 0, 'BRB\nCIGGIE BREAK', 28, '#e0245e', { st: 5, ls: -4 })]); this.stream.add(sign); this.tw(sign, { scale: 1 }, 300, 'Back.out');
        const puffs = []; Sfx.whoosh();
        for (let i = 0; i < 46; i++) { const p = this.add.image(GX + 30 + Math.random() * (CW * COLS - 60), GY + 30 + Math.random() * (CH * ROWS - 60), 'puff').setDepth(60).setScale(0.2).setAlpha(0).setTint(0xd8d0ea); puffs.push(p); this.tweens.add({ targets: p, scale: 1.5 + Math.random() * 1.2, alpha: 0.93, duration: 500, delay: i * 14 }); this.tweens.add({ targets: p, x: p.x + (Math.random() - 0.5) * 80, duration: 1500, yoyo: true, repeat: -1 }); }
        await this.wait(950); Sfx.cough(); ev.positions.forEach(p => this.setCell(this.cells[p[0]][p[1]], ev.grid[p[0]][p[1]])); await this.wait(550); Sfx.whoosh();
        puffs.forEach((p, i) => this.tweens.add({ targets: p, alpha: 0, y: p.y - 160, scale: 4, duration: 550, delay: i * 8, onComplete: () => { this.tweens.killTweensOf(p); p.destroy(); } }));
        ev.positions.forEach(p => { const k = this.cells[p[0]][p[1]]; this.tweens.add({ targets: k, scale: { from: 1.5, to: 1 }, duration: 400, delay: 250, ease: 'Back.out' }); });
        await this.wait(650); this.tw(sign, { scale: 0 }, 200).then(() => sign.destroy()); await this.dotReturn(); this.say('Right. Where were we, you filthy animals?'); this.expr('wink', 1400);
      } else if (ev.kind === 'STEVE') {
        await this.superchat('£1', u, 'Steve from next door is at the window with his top off again'); this.expr('smirk', 2400);
        const st = this.add.image(-170, GY + CH * 3.2, 'steve').setDepth(60).setAngle(14).setScale(1.05); Sfx.boing(); await this.tw(st, { x: 86 }, 380, 'Back.out');
        const b = this.add.container(270, GY + CH * 1.75).setDepth(61).setScale(0); const bg2 = this.add.graphics(); bg2.fillStyle(0xffffff).fillRoundedRect(-200, -48, 400, 96, 24).lineStyle(5, 0x24123a).strokeRoundedRect(-200, -48, 400, 96, 24); b.add([bg2, this.tx(0, 0, 'Alright Dot! Got something\nbig for you. Hur hur.', 24, INK, { font: BODY, st: 0 }).setFontStyle('bold')]); await this.tw(b, { scale: 1 }, 220, 'Back.out'); await this.wait(650);
        for (let i = 0; i < ev.positions.length; i++) { const p = ev.positions[i], k = this.cells[p[0]][p[1]], h = this.add.image(st.x + 40, st.y - 60, 'heart').setDepth(61).setScale(1.2); this.tweens.add({ targets: st, angle: 4, duration: 100, yoyo: true }); this.tweens.add({ targets: h, y: '-=140', duration: 190, yoyo: true, ease: 'Quad.out' }); await this.tw(h, { x: k.x, angle: 360 }, 380, 'Linear'); h.destroy(); Sfx.mult(ev.values[i]); this.setCell(k, ev.grid[p[0]][p[1]]); this.burst('heart', k.x, k.y, 8); this.tweens.add({ targets: k, scale: { from: 1.7, to: 1 }, duration: 300, ease: 'Back.out' }); }
        this.say("Ooh Steve, put it away... no, don't."); this.tw(b, { scale: 0 }, 180).then(() => b.destroy()); await this.wait(350); this.tw(st, { x: -190 }, 320, 'Back.in').then(() => st.destroy()); await this.wait(250);
      }
    }

    /* ---------- round flow ---------- */
    async playEvents(events) {
      this.spinWin = 0; this.setMeter(0, 0);
      for (const ev of events) {
        if (ev.type === 'reveal') await this.reveal(ev.grid);
        else if (ev.type === 'boost') await this.boost(ev);
        else if (ev.type === 'win') await this.showWin(ev);
        else if (ev.type === 'tumble') await this.tumble(ev);
        else if (ev.type === 'viral') await this.viral(ev);
        else if (ev.type === 'mults') await this.showMults(ev);
        else if (ev.type === 'text') await this.dirtyText(ev);
        else if (ev.type === 'respin') await this.respinFx();
        else if (ev.type === 'power') await this.nanPower(ev);
        else if (ev.type === 'doris') await this.dorisFx(ev);
      }
      return this.spinWin;
    }
    onSpinBtn() { if (this.modal || !this.live) return; if (this.busy) { this.fast(true); return; } this.spin(); }
    async spin(opt) {
      if (this.busy || this.modal || !this.live) return; opt = opt || {};
      if (!opt.buy && !opt.demo && this.betBoost) opt.boost = this.betBoost;
      const cost = opt.demo ? 0 : this.bet * E.costOf(opt);
      if (this.balance < cost) { this.say('Skint! Not a pot to piss in.'); this.auto = false; this.autoBtn.im.setTexture('btn_sm'); return; }
      this.busy = true; this.spinBtn.im.setTexture('btn_stop'); this.setBal(this.balance - cost); this.baseShown = 0; this.setWin(0); this.multBadge.setAlpha(0); this.boostBtn.setVisible(false);
      const plain = !opt.buy && !opt.demo; if (plain) opt.tip = this.tips[this.betIdx] || 0;
      const round = E.play(opt); let total = 0;
      try {
        if (round.goal) await this.tipGoalFx();
        const w = await this.playEvents(round.events); total += w;
        if (plain) { this.tips[this.betIdx] = round.tip; this.setTip(round.tip); }
        this.afterBase(w, !!(round.free || round.bonus));
        if (!w && !round.free && !round.bonus && this.lossStreak < 5) { const r = Math.random(); if (r < 0.14) this.chat(pick(CHAT.lose)); else if (r < 0.22) this.say(pick(SAY.lose)); else if (r < 0.34) this.sip(); }
        this.fast(false);
        if (w >= this.bet * 10) await this.bigWin(w);
        if (round.bonus) { const bw = await this.bonusPick(round); total += bw; this.baseShown = total; await this.setWin(total, 500, 'WIN'); }
        if (round.scatPay) { await this.scatterCelebrate(round.scatPos); total += round.scatPay * this.bet; await this.setWin(total, 400, 'WIN'); }
        if (round.free) total += await this.freeSpins(round.free, total);
      } catch (e) { console.error(e); }
      total = Math.min(total, E.MAX_WIN * this.bet);
      if (total >= E.MAX_WIN * this.bet) { try { await this.maxWin(total); } catch (e) { console.error(e); } }
      this.fast(false); this.setBal(this.balance + total); if (total > 0) { Sfx.coin(); this.setWin(total, 0, 'TOTAL WIN'); }
      this.busy = false; this.spinBtn.im.setTexture('btn_spin'); this.boostBtn.setVisible(true);
      if (this.auto) this.time.delayedCall(this.ms(total ? 900 : 350), () => { if (this.auto) this.spin(); });
    }
    async scatterCelebrate(pos) { Sfx.scatter(6); this.expr('gasp', 1500); pos.forEach(p => { const k = this.cells[p[0]][p[1]]; if (!k) return; this.cellLayer.bringToTop(k); this.tweens.add({ targets: k, scale: 1.45, angle: { from: -10, to: 10 }, duration: 200, yoyo: true, repeat: 3, onComplete: () => k.angle = 0 }); this.burst('spark', k.x, k.y, 20, 0x5fd1ff); }); this.chat('CRUISE! CRUISE! GET YER KIT OFF!'); await this.wait(1500); }
    async freeSpins(free, before) {
      await this.driveOff(); await this.cruiseIntro(free.awarded); this.setTheme('free'); this.driveBack(); this.multLab.setText('TIP JAR'); this.multTxt.setText('x' + (free.jar0 || 0)); this.multBadge.setAlpha(1);
      this.say(free.jar0 ? 'Jar is already full, you filthy lot!' : 'All aboard, you dirty sods!'); let run = before, left = free.awarded;
      for (const sp of free.spins) {
        left--; this.fsTxt.setText(`${sp.hen ? 'HEN DO' : 'FREE SPINS'}\n${left} LEFT`); this.baseShown = run; this.winLab.setText('TOTAL WIN');
        const w = await this.playEvents(sp.events); this.fast(false);
        run = before + sp.running * this.bet; this.setWin(run, 0, 'TOTAL WIN'); this.multTxt.setText('x' + sp.jar);
        if (w >= this.bet * 10) await this.bigWin(w);
        left += sp.extra || 0; this.lightHens(sp.got);
        if (run / this.bet >= 50) this.setOutfit(3); else if (run / this.bet >= 10) this.setOutfit(2); else if (w > 0) this.setOutfit(Math.max(this.outfit, 1));
        if (sp.retrigger) { left += sp.retrigger; await this.scatterCelebrate(sp.scatPos); await this.stowaway(sp.retrigger); }
        if (sp.henStart) { left += 3; await this.driveOff(); await this.henDo(); this.driveBack(); this.drawFrame(0xff5fa2); }
        this.fsTxt.setText(sp.hen || sp.henStart ? `HEN DO\n${left} LEFT` : `FREE SPINS\n${left} LEFT`);
        await this.wait(this.ms(350));
      }
      await this.driveOff(); await this.cruiseOutro(free.total * this.bet); this.setTheme('base'); this.driveBack(); this.multBadge.setAlpha(0); this.baseShown = 0;
      return free.total * this.bet;
    }

    /* ---------- modals ---------- */
    panel(w, h, title) {
      this.modal = true; this.ovOn(); const k = this.add.container(3000, 0).setDepth(200); const dim = this.add.rectangle(W / 2, H / 2, W, H, 0x0a0418, 0.82).setInteractive(); const gph = this.add.graphics(); const x = (W - w) / 2, y = (H - h) / 2;
      gph.fillStyle(0x2a1258).fillRoundedRect(x, y, w, h, 26).lineStyle(6, 0xffc94a).strokeRoundedRect(x, y, w, h, 26); k.add([dim, gph, this.tx(W / 2, y + 44, title, 40, '#ffe27a', { st: 8 })]);
      k.close = () => { this.modal = false; this.ovOff(); k.destroy(); }; k.px = x; k.py = y;
      k.b = (bx, by, tex, label, cb, sc, size) => { const b = this.btn(bx, by, tex, label, cb, size || 22, sc || 0.9); b.modalOk = true; b.setDepth(0); k.add(b); return b; };
      k.setScale(0.9).setAlpha(0); this.tweens.add({ targets: k, scale: 1, alpha: 1, duration: 160 }); k.setPosition(3000 + W * 0.05, H * 0.05); this.tweens.add({ targets: k, x: 3000, y: 0, duration: 160 });
      return k;
    }
    openBuy() {
      if (this.busy || this.modal || !this.live) return; const p = this.panel(680, 1010, 'BUY A BONUS'), X0 = p.px, Y0 = p.py;
      const opts = [['spin', 'sym_MULT', 'THE QUICKIE', 'One spin. A Ciggie Break guarantees a win,\nthen Steve lobs in 2-4 tip hearts.\nOver before you know it.'], ['cruise', 'sym_SCAT', 'THE DIRTY WEEKEND', '4+ scatters guaranteed.\n10+ free spins on the Naughty Nans Cruise\nwith the Tip Jar that never resets.'], ['filthy', 'sym_DOTTIE', 'THE FILTHY FORTNIGHT', `${E.FILTHY.spins}+ free spins and the Tip Jar\nstarts at x${E.FILTHY.jar}. Dottie comes back\nwalking funny.`]];
      opts.forEach((o, i) => { const y = Y0 + 110 + i * 270, gph = this.add.graphics(); gph.fillStyle(0x1a0b38).fillRoundedRect(X0 + 24, y, 632, 250, 20).lineStyle(3, 0xb79cf2).strokeRoundedRect(X0 + 24, y, 632, 250, 20); p.add(gph);
        p.add([this.add.image(X0 + 104, y + 96, o[1]).setScale(0.82), this.tx(X0 + 184, y + 40, o[2], 32, '#ffe27a', { ox: 0, st: 6 }), this.tx(X0 + 184, y + 112, o[3], 19, '#fff', { font: BODY, st: 0, ox: 0, align: 'left', ls: 2 })]);
        p.b(X0 + 500, y + 204, 'pill', `${E.BUYS[o[0]]}x  ${money(this.bet * E.BUYS[o[0]])}`, () => { p.close(); this.spin({ buy: o[0] }); }, 1.1, 20); });
      p.b(X0 + 110, Y0 + 958, 'pill_p', 'NAH, LOVE', () => p.close(), 0.8, 24);
    }
    openBoost() {
      if (this.busy || this.modal || !this.live) return; const p = this.panel(680, 900, 'BET BOOST'), X0 = p.px, Y0 = p.py;
      const opts = [[null, 'KEEP IT CLEAN', 'Plain old bet. Boring. Like Derek.', 'OFF'], ['cruise', 'FRISKY', 'Bet costs 25% more.\nThe cruise turns up nearly twice as often\n(about 1 in 175 spins, not 1 in 340).', '+25%'], ['chat', 'GOBBY', 'Bet costs 50% more.\nChat tips Dottie nearly three times as often,\nso far more superchat boosts.', '+50%']];
      opts.forEach((o, i) => { const y = Y0 + 110 + i * 240, on = this.betBoost === o[0], gph = this.add.graphics(); gph.fillStyle(on ? 0x4a1fa8 : 0x1a0b38).fillRoundedRect(X0 + 24, y, 632, 220, 20).lineStyle(on ? 6 : 3, on ? 0xffc94a : 0xb79cf2).strokeRoundedRect(X0 + 24, y, 632, 220, 20); p.add(gph);
        p.add([this.tx(X0 + 50, y + 42, o[1], 34, '#ffe27a', { ox: 0, st: 6 }), this.tx(X0 + 630, y + 42, o[3], 34, '#ff7ab8', { ox: 1, st: 6 }), this.tx(X0 + 50, y + 120, o[2], 19, '#fff', { font: BODY, st: 0, ox: 0, align: 'left', ls: 2 })]);
        p.b(X0 + 530, y + 176, on ? 'pill' : 'pill_p', on ? 'ON' : 'PICK', () => { this.betBoost = o[0]; this.refreshBet(); p.close(); }, 0.8, 24); });
      p.add(this.tx(W / 2, Y0 + 850, 'Wins are paid on the base bet. Boosts do not apply to bought bonuses.', 16, '#b79cf2', { font: BODY, st: 0 }));
    }
    openInfo(page) {
      if (this.busy || this.modal || !this.live) return; page = page || 0; const p = this.panel(680, 1120, ['PAYTABLE', 'FEATURES', "DIRECTOR'S CUT"][page]); const X0 = p.px, Y0 = p.py;
      const body = (s, y, size, col) => { const t = this.tx(W / 2, y, s, size || 20, col || '#fff', { font: BODY, st: 0, wrap: 610, oy: 0, ls: 3 }); p.add(t); return t; };
      if (page === 0) {
        const order = ['DOTTIE', 'GLADYS', 'VIOLET', 'BRENDA', 'MABEL', 'YARN', 'BINGO', 'DENT', 'TEA'];
        order.forEach((s, i) => { const cxx = X0 + 120 + (i % 3) * 220, cyy = Y0 + 160 + Math.floor(i / 3) * 190; p.add(this.add.image(cxx - 50, cyy, 'sym_' + s).setScale(0.62)); const py = E.PAYS[s];['12+', '10-11', '8-9'].forEach((l, j) => { p.add(this.tx(cxx + 8, cyy - 30 + j * 30, l, 17, '#b79cf2', { ox: 0, st: 3 })); p.add(this.tx(cxx + 112, cyy - 30 + j * 30, money(py[2 - j] * this.bet), 17, '#fff', { ox: 1, st: 3 })); }); });
        p.add(this.add.image(X0 + 70, Y0 + 770, 'sym_SCAT').setScale(0.55)); p.add(this.tx(X0 + 126, Y0 + 770, '4 / 5 / 6 CRUISE scatters pay 3x / 5x / 100x\nand award 10 / 12 / 15 free spins.', 19, '#fff', { font: BODY, st: 0, ox: 0, align: 'left' }));
        p.add(this.add.image(X0 + 70, Y0 + 862, 'sym_MULT').setScale(0.55)); p.add(this.tx(X0 + 126, Y0 + 862, 'TIP hearts x2 to x100. All tips on screen are\nadded together and multiply the spin win.', 19, '#fff', { font: BODY, st: 0, ox: 0, align: 'left' }));
        p.add(this.add.image(X0 + 70, Y0 + 954, 'sym_BONUS').setScale(0.55)); p.add(this.tx(X0 + 126, Y0 + 954, '3+ PICK ME signs start Bingo Pick Me:\npick a nan for up to 100x or a cruise ticket.', 19, '#fff', { font: BODY, st: 0, ox: 0, align: 'left' }));
      } else if (page === 1) {
        const H2 = (s, y) => body(s, y, 23, '#ffe27a').setFontFamily(DISP), P2 = (s, y) => body(s, y, 17);
        H2('HOW IT PAYS', Y0 + 88); P2('8+ matching symbols anywhere win, pop and tumble. 3rd, 5th and 7th tumble add +x2, +x3, +x5 (Viral Meter).', Y0 + 120);
        H2('SUPERCHATS AND DIRTY TEXTS', Y0 + 186); P2("Chat tips trigger Tea's Up, Teeth Out, Ciggie Break or Steve. A Dirty Text lets you pick a reply for a boost, a spin multiplier or a free respin.", Y0 + 218);
        H2('TIP GOAL', Y0 + 306); P2(`Every tip heart that lands in the base game fills the goal. At ${E.TIP_GOAL} the next spin is a free Quickie: guaranteed win plus 2-4 hearts. Saved per bet size.`, Y0 + 338);
        H2('NAUGHTY NANS CRUISE', Y0 + 426); P2('Free spins with a Tip Jar that never resets. 3+ scatters: Stowaway Steve adds 5 spins.', Y0 + 458);
        H2('NAN POWERS (CRUISE ONLY)', Y0 + 524); P2('Land 5+ of one nan: Mabel +1 jar. Brenda adds a tip heart. Violet +1 spin. Gladys doubles the jar add. Dottie counts as any nan. Wake all four for the HEN DO: 3 extra spins with the two lowest symbols removed.', Y0 + 556);
        H2('OUTFITS AND STREAKS', Y0 + 668); P2('Dottie dresses up as wins grow (2x, 10x, 50x) and dresses down on a cold run. Five dead spins and the stream buffers. Eight and she nods off.', Y0 + 700);
        H2('BUYS AND BOOSTS', Y0 + 788); P2(`The Quickie ${E.BUYS.spin}x, The Dirty Weekend ${E.BUYS.cruise}x, The Filthy Fortnight ${E.BUYS.filthy}x. Frisky boost +25%: cruise nearly twice as often. Gobby +50%: far more superchats.`, Y0 + 820);
        H2("DIRTY DORIS'S PRIZE MARROW", Y0 + 884); P2('Doris plants a stacked wild 1 to 5 high. It counts as every symbol. The bigger her marrow, the bigger the win.', Y0 + 916);
        body(`DEMO MATHS. Simulated RTP roughly 95-98% in every mode. Max win ${E.MAX_WIN.toLocaleString()}x. Not certified; prototype only.`, Y0 + 984, 15, '#b79cf2');
      } else {
        body('Jump straight to any clip. These are free demo triggers.', Y0 + 92, 20, '#b79cf2');
        const items = [['CRUISE FREE SPINS', () => this.spin({ demo: 1, buy: 'cruise' })], ['BINGO PICK ME', () => this.spin({ demo: 1, forceBonus: 1 })], ["TEA'S UP", () => this.spin({ demo: 1, forceBoost: 'TEAPOT' })], ['TEETH OUT', () => this.spin({ demo: 1, forceBoost: 'DENTURES' })], ['CIGGIE BREAK', () => this.spin({ demo: 1, forceBoost: 'CIGGIE' })], ['STEVE NEXT DOOR', () => this.spin({ demo: 1, forceBoost: 'STEVE' })], ['GONE VIRAL', () => this.demo(() => this.viral({ level: 2, add: 3, viral: 5 }))], ['CHEEKY WIN', () => this.demo(() => this.bigWin(this.bet * 14))], ['DIRTY WIN', () => this.demo(() => this.bigWin(this.bet * 32))], ['FILTHY WIN', () => this.demo(() => this.bigWin(this.bet * 68))], ['THE FULL MONTY', () => this.demo(() => this.bigWin(this.bet * 240))]];
        items.push(['THE QUICKIE', () => this.spin({ demo: 1, buy: 'spin' })], ['FILTHY FORTNIGHT', () => this.spin({ demo: 1, buy: 'filthy' })], ['DIRTY TEXT', () => this.spin({ demo: 1, forceText: true })], ['TIP GOAL', () => this.spin({ demo: 1, tip: E.TIP_GOAL, goalDemo: 1 })], ['HEN DO', () => this.spin({ demo: 1, buy: 'cruise', forceHen: 1 })], ['STOWAWAY STEVE', () => this.demo(() => this.stowaway(5))], ['NEXT OUTFIT', () => this.setOutfit((this.outfit + 1) % 4)], ['BUFFERING / NAP', () => this.demo(async () => { this.lossStreak = 4; this.afterBase(0); await this.wait(2200); this.lossStreak = 7; this.afterBase(0); })], ['MAX WIN', () => this.demo(() => this.maxWin(this.bet * E.MAX_WIN))], ["DORIS'S MARROW", () => this.spin({ demo: 1, forceDoris: 2 + Math.floor(Math.random() * 4) })]);
        items.forEach((it, i) => p.b(W / 2 + (i % 2 ? 150 : -150), Y0 + 160 + Math.floor(i / 2) * 82, i % 2 ? 'pill_p' : 'pill', it[0], () => { p.close(); it[1](); }, 1.05, 17));
      }
      ['PAYS', 'FEATURES', 'CLIPS'].forEach((l, i) => p.b(X0 + 96 + i * 140, Y0 + 1060, i === page ? 'pill' : 'pill_p', l, () => { p.close(); this.openInfo(i); }, 0.6, 26));
      p.b(X0 + 590, Y0 + 1060, 'btn_on', 'X', () => p.close(), 0.7, 34);
      p.b(X0 + 510, Y0 + 1060, 'btn_sm', I18N.lang === 'es' ? 'EN' : 'ES', () => { p.close(); window.__setLang(I18N.lang === 'es' ? 'en' : 'es'); }, 0.7, 26);
    }
    async demo(fn) { if (this.busy || !this.live) return; this.busy = true; try { await fn(); } catch (e) { console.error(e); } this.fast(false); this.busy = false; }
  }
  g.Game = Game; g.GameConst = { OX: 3000, W, H, GX, GY, CW, CH, money, pick, CHAT, DISP, BODY, INK, USERS, cx, cy };
})(window);
