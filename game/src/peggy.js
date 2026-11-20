/* Nana Peggy (GILF LIVE art + audio) layered onto the game. Everything here is optional: if the asset files
   are missing the game falls back to the code-drawn character and synth sound. Clothed clips only. */
(function () {
  const P = Game.prototype, FW = 349, FH = 450;
  const N = { 'rest-r1': 26, 'rest-r2': 53, 'rest-r3': 53, 'rest-r4': 53, 'live-l1': 52, 'live-angry': 53, 'l1-angry': 53, 'live-topfan': 53, 'live-viral': 53 };
  const SND = ['music_base', 'music_live', 'sfx_brownie', 'sfx_cat', 'sfx_chime', 'sfx_fan', 'sfx_kiss', 'sfx_knitting_loop', 'sfx_slide_whistle', 'sfx_teacup', 'sfx_tin', 'sfx_tv_on', 'vo_bye', 'vo_cackle', 'vo_giggle', 'vo_hello', 'vo_hmph', 'vo_more', 'vo_mwah', 'vo_mwah_love', 'vo_oi', 'vo_ooh', 'vo_oops', 'vo_topfan', 'vo_viral', 'vo_yes'];
  const SYM = ['high_bra', 'high_camcorder', 'high_clapper', 'high_photo', 'low_bill', 'low_champagne', 'low_cherries', 'low_cuffs', 'scatter_ringlight', 'wild_live'];
  let alt = 0;
  const CUES = {   // frame -> sound, as in the source game
    'rest-r1': { 8: () => Sfx.play('vo_giggle', 0.35) }, 'rest-r2': { 22: () => Sfx.play(++alt % 2 ? 'vo_mwah' : 'vo_mwah_love', 0.8) }, 'rest-r3': { 20: () => Sfx.play('vo_cackle', 0.8) },
    'rest-r4': { 26: () => Sfx.play('sfx_slide_whistle', 0.6), 36: () => Sfx.play(++alt % 2 ? 'vo_yes' : 'vo_more') }, 'live-topfan': { 3: () => Sfx.play('vo_topfan'), 30: () => Sfx.play('sfx_kiss', 0.7) },
    'live-viral': { 6: () => Sfx.play('vo_ooh'), 24: () => Sfx.play('vo_viral') }, 'live-angry': { 18: () => Sfx.play('vo_oi') }, 'l1-angry': { 12: () => Sfx.play('vo_hmph') }, 'live-l1': { 22: () => Sfx.play('vo_more') }
  };
  let LRU = [];

  const assetRoot = () => {
    const path = window.location.pathname;
    const at = path.indexOf("/play/");
    if (at >= 0) return path.slice(0, at + "/play/".length);
    return (path.endsWith("/") ? path : path.replace(/[^/]*$/, "")) + "play/";
  };

  P.preload = function () {
    if (this.textures.exists('pg_base')) return;
    const A = assetRoot();
    const gs = this.scale.gameSize; this._ld = this.add.text(gs.width / 2, gs.height / 2, '0%', { fontFamily: 'Arial', fontSize: '40px', color: '#ffe27a' }).setOrigin(0.5);
    this.load.on('progress', v => { if (this._ld) this._ld.setText(Math.round(v * 100) + '%'); });
    ['base', 'live', 'u1'].forEach(s => ['', '-h', '-c'].forEach(x => this.load.image('pg_' + s + x, A + 'assets/pg_' + s + x + '.webp')));
    this.load.image('pg_bust', A + 'assets/pg_bust.webp');
    SYM.forEach(n => this.load.image('x_' + n, A + 'assets/sym_' + n + '.webp'));
    ['room_strip', 'room_studio', 'bg_port', 'bg_land'].forEach(n => this.load.image(n, A + 'assets/' + n + '.webp'));
    this.load.image('x_mabel', A + 'assets/custom/mabel_avatar.png');
    this.load.image('x_brenda', A + 'assets/custom/brenda_avatar.png');
    this.load.image('x_violet', A + 'assets/custom/violet_avatar.png');
    this.load.image('x_gladys', A + 'assets/custom/gladys_avatar.png');
    this.load.image('x_dottie', A + 'assets/custom/dottie_avatar.png');
    this.load.image('x_doris_full', A + 'assets/custom/doris_full.png');
    this.load.image('x_doris_full2', A + 'assets/custom/doris_full2.png');
    this.load.image('x_mabel_full', A + 'assets/custom/mabel_full.png');
    this.load.image('x_cucumber', A + 'assets/custom/cucumber.png');
    this.load.image('x_yarn', A + 'assets/custom/yarn.png');
    this.load.image('x_teacup', A + 'assets/custom/teacup.png');
    this.load.spritesheet('pg_rest-r1', A + 'assets/pg_rest-r1.webp', { frameWidth: FW, frameHeight: FH });
    SND.forEach(n => this.load.audio(n, A + 'snd/' + n + '.mp3'));
  };

  const oStream = P.buildStream;
  P.buildStream = function () {
    oStream.call(this); this.pgBusy = null; this.pgLoading = false; this._pgT = 0;
    this.hasPg = ['pg_base', 'pg_base-h', 'pg_base-c', 'pg_live', 'pg_u1'].every(k => this.textures.exists(k)); if (!this.hasPg) return;
    const L = this.land; this.dot.list.forEach(o => o.setVisible(false)); this.desk.setVisible(false); this.mug.setVisible(false);
    this.SP.dot = L ? [250, 704] : [122, 6]; this.dot.setScale(1).setPosition(this.SP.dot[0], this.SP.dot[1]); this.dotHome = this.SP.dot[1];
    this.pg = this.add.sprite(0, 0, 'pg_base').setOrigin(0.5, L ? 1 : 0).setScale(L ? 1.34 : 0.95); this.dot.add(this.pg);
    this.pg.on('animationcomplete', () => { this.pgBusy = null; this.pgStill(); });
    this.pg.on('animationupdate', (a, f) => { const c = CUES[this.pgBusy], fn = c && c[f.index - 1]; if (fn) fn(); });
    this.tweens.add({ targets: this.pg, scaleY: this.pg.scaleY * 1.012, duration: 1500, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    this.time.addEvent({ delay: 3300, loop: true, callback: () => { const ok = () => !this.pgBusy && !this.asleep && !this.away && this.pg.active; if (!ok()) return; const r = 'pg_' + this.pgRest(); this.pg.setTexture(r + '-h'); this.time.delayedCall(70, () => ok() && this.pg.setTexture(r + '-c')); this.time.delayedCall(150, () => ok() && this.pg.setTexture(r + '-h')); this.time.delayedCall(220, () => ok() && this.pgStill()); } });
    this.time.addEvent({ delay: 24000, loop: true, callback: () => { if (this.live && this.mode === 'base' && !this.busy && Math.random() < 0.35) Sfx.play('sfx_cat', 0.35); } });
  };
  P.pgRest = function () { return this.outfit >= 2 ? 'u1' : this.mode === 'free' ? 'live' : 'base'; };
  P.pgStill = function () { if (!this.hasPg || this.pgBusy) return; this.pg.setTexture('pg_' + this.pgRest() + (this.asleep ? '-c' : '')); };
  P.pgStop = function () { if (!this.hasPg) return; this.pg.anims.stop(); this.pgBusy = null; this.pgStill(); };
  P.pgPlay = function (clip, force) {
    if (!this.hasPg || this.away || this.asleep || (this.pgBusy && !force)) return;
    const key = 'pg_' + clip, ak = 'a_' + clip;
    const go = () => {
      if (!this.pg || !this.pg.active || this.away || this.asleep) return;
      if (!this.anims.exists(ak)) this.anims.create({ key: ak, frames: this.anims.generateFrameNumbers(key, { start: 0, end: N[clip] - 1 }), frameRate: 12 });
      LRU = LRU.filter(c => c !== clip && this.textures.exists('pg_' + c)); LRU.push(clip);
      while (LRU.length > 2) { const old = LRU.shift(); if (this.pg.texture.key === 'pg_' + old) { LRU.unshift(old); break; } this.anims.remove('a_' + old); this.textures.remove('pg_' + old); }
      this.pgBusy = clip; this.pg.play(ak);
    };
    if (this.textures.exists(key)) return go();
    if (this.pgLoading) return; this.pgLoading = true;
    this.load.spritesheet(key, assetRoot() + 'assets/' + key + '.webp', { frameWidth: FW, frameHeight: FH });
    this.load.once('complete', () => { this.pgLoading = false; if (this.textures.exists(key)) go(); }); this.load.start();
  };
  // kind: small | kiss | big | huge | viral | topfan | angry
  P.pgReact = function (kind, force) {
    if (!this.hasPg) return; const r = this.pgRest();
    if (r === 'u1') { if (kind === 'angry') this.pgPlay('l1-angry', force); return; }
    if (kind === 'small') { if (r !== 'base' || this.time.now < this._pgT || Math.random() < 0.4) return; this._pgT = this.time.now + 5000; return this.pgPlay('rest-r1', force); }
    const map = r === 'base' ? { kiss: 'rest-r2', big: 'rest-r3', huge: 'rest-r4', viral: 'live-viral', topfan: 'live-topfan', angry: 'live-angry' } : { kiss: 'live-topfan', big: 'live-viral', huge: 'live-viral', viral: 'live-viral', topfan: 'live-topfan', angry: 'live-angry' };
    if (map[kind]) { this._pgT = this.time.now + 5000; this.pgPlay(map[kind], force); }
  };

  const oDotPos = P.dotPos; P.dotPos = function (dy) { return this.hasPg ? [this.SP.x + this.dot.x, this.SP.y + this.dot.y + (this.land ? -330 : 150) + (dy || 0)] : oDotPos.call(this, dy); };
  const oTheme = P.setTheme; P.setTheme = function (m) { oTheme.call(this, m); if (!this.hasPg) return; this.desk.setVisible(false); this.mug.setVisible(false); this.dot.y = this.dotHome = this.SP.dot[1]; this.pgStop(); };
  const oCheer = P.cheer; P.cheer = function (big) { oCheer.call(this, big); this.pgReact(big ? 'big' : 'small', big); };
  const oOutfit = P.setOutfit; P.setOutfit = function (l) {
    if (!this.hasPg) return oOutfit.call(this, l); if (l === this.outfit) return; const was = this.outfit >= 2, now = l >= 2; this.outfit = l; if (was === now) return;
    this.burst('puff', ...this.dotPos(), 6, 0xffffff);
    if (now) { this.outfit = 0; this.pgStop(); this.outfit = l; this.burst('star', ...this.dotPos(-10), 16); Sfx.viral(1); this.chat(GameConst.pick(['coat off! here we go', 'ooh she has changed', 'who dressed you Dot, give them a raise'])); if (!this.pgBusy) this.pgPlay('live-l1', true); if (!this.pgBusy) this.pgStill(); }
    else this.pgStop();
  };
  const oWake = P.wake; P.wake = function () { const was = this.asleep; oWake.call(this); if (was) this.pgStill(); };
  const oAfter = P.afterBase; P.afterBase = function (w, feature) {
    const o = this.outfit >= 2; oAfter.call(this, w, feature); if (!this.hasPg) return; if ((this.outfit >= 2) !== o) return;
    const x = w / this.bet; if (x >= 40) this.pgReact('huge', true); else if (x >= 15) this.pgReact('big', true); else if (x >= 5) this.pgReact('kiss', true);
    if (!w && !feature) { if (this.lossStreak === 5) this.pgReact('angry', true); if (this.asleep) { this.pgBusy = null; this.pg.anims.stop(); this.pgStill(); } }
  };
  const oLeave = P.dotLeave; P.dotLeave = async function () {
    if (!this.hasPg || !this.land) { if (this.hasPg) this.pgStop(); return oLeave.call(this); } if (this.away) return; this.wake(); this.pgStop(); this.away = true;
    this.tweens.add({ targets: this.pg, y: -22, duration: 115, yoyo: true, repeat: 2 }); await this.tw(this.dot, { x: this.SP.w + 320 }, 720, 'Quad.in');
  };
  const oReturn = P.dotReturn; P.dotReturn = async function () {
    if (!this.hasPg || !this.land) return oReturn.call(this); if (!this.away) return; this.away = false; this.dot.x = -320; this.pgStill();
    this.tweens.add({ targets: this.pg, y: -18, duration: 130, yoyo: true, repeat: 2 }); await this.tw(this.dot, { x: this.SP.dot[0] }, 800, 'Cubic.out');
  };
  const wrap = (name, before) => { const o = P[name]; P[name] = function (...a) { try { before.apply(this, a); } catch (e) { } return o.apply(this, a); }; };
  wrap('boost', function (ev) { if (ev.kind === 'STEVE') this.pgReact('topfan', true); else if (ev.kind === 'TEAPOT') { Sfx.play('sfx_teacup', 0.8); this.pgReact('kiss', true); } else if (ev.kind === 'DENTURES') { Sfx.play('sfx_tin', 0.8); this.pgReact('kiss', true); } });
  wrap('viral', function () { Sfx.play('sfx_fan', 0.6); this.pgReact('viral', true); });
  wrap('dorisFx', function () { Sfx.play('sfx_slide_whistle', 0.6); });
  wrap('dirtyText', function () { Sfx.play('sfx_chime', 0.7); });
  wrap('cruiseOutro', function () { Sfx.play('vo_bye'); });
  wrap('bigWin', function (amt) { if (amt >= this.bet * 10) Sfx.play('vo_ooh'); });
  wrap('bonusPick', function () { Sfx.play('sfx_brownie', 0.7); });
})();
