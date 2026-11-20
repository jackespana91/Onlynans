/* Synthesised audio — no asset files. */
(function (g) {
  let ac = null, master = null, musicGain = null, muted = false, timer = null, step = 0, nextT = 0, mode = 'base';
  function init() { if (ac) { if (ac.state === 'suspended') ac.resume(); return; } try { ac = new (window.AudioContext || window.webkitAudioContext)(); master = ac.createGain(); master.gain.value = 0.55; master.connect(ac.destination); musicGain = ac.createGain(); musicGain.gain.value = 0.2; musicGain.connect(master); } catch (e) { ac = null; } }
  function tone(f, d, type, vol, when, dest, slide) { if (!ac) return; const t = (when || ac.currentTime), o = ac.createOscillator(), gn = ac.createGain(); o.type = type || 'sine'; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); gn.gain.setValueAtTime(0.0001, t); gn.gain.exponentialRampToValueAtTime(vol || 0.2, t + 0.012); gn.gain.exponentialRampToValueAtTime(0.0001, t + d); o.connect(gn); gn.connect(dest || master); o.start(t); o.stop(t + d + 0.03); }
  function noise(d, vol, hp, when, lp) { if (!ac) return; const t = when || ac.currentTime, n = Math.floor(ac.sampleRate * d), b = ac.createBuffer(1, n, ac.sampleRate), ch = b.getChannelData(0); for (let i = 0; i < n; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / n); const s = ac.createBufferSource(); s.buffer = b; const f = ac.createBiquadFilter(); f.type = lp ? 'lowpass' : 'highpass'; f.frequency.value = lp || hp || 1000; const gn = ac.createGain(); gn.gain.value = vol || 0.2; s.connect(f); f.connect(gn); gn.connect(master); s.start(t); }
  const N = n => 440 * Math.pow(2, (n - 69) / 12);
  const S = {
    init, get muted() { return muted; }, voice: false, ext: null, song: null, songObj: null,
    play(n, vol) { try { if (muted || !S.ext || !S.ext.game.cache.audio.exists(n)) return false; S.ext.play(n, { volume: vol === undefined ? 0.9 : vol }); return true; } catch (e) { return false; } },
    speak(t) { try { if (muted || !S.voice || !window.speechSynthesis) return; const u = new SpeechSynthesisUtterance(String(t).replace(/\.\.\./g, ', ')); const vs = speechSynthesis.getVoices(); const es = window.I18N && I18N.lang === 'es'; const v = es ? (vs.find(x => /es[-_]AR/i.test(x.lang)) || vs.find(x => /es[-_](419|MX|US|UY|CL)/i.test(x.lang)) || vs.find(x => /^es/i.test(x.lang))) : (vs.find(x => /en-GB/i.test(x.lang) && /female|kate|serena|martha|hazel|susan|libby|sonia|stephanie/i.test(x.name)) || vs.find(x => /en-GB/i.test(x.lang))); if (v) u.voice = v; u.lang = es ? 'es-AR' : 'en-GB'; u.pitch = 0.6; u.rate = 1.02; u.volume = 0.9; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (e) { } },
    setMute(m) { muted = m; try { if (S.ext) S.ext.mute = m; } catch (e) { } if (master) master.gain.value = muted ? 0 : 0.55; try { if (m && window.speechSynthesis) speechSynthesis.cancel(); } catch (e) { } },
    toggle() { muted = !muted; if (master) master.gain.value = muted ? 0 : 0.55; return muted; },
    click() { tone(660, 0.06, 'triangle', 0.15); },
    spin() { noise(0.25, 0.12, 600); tone(220, 0.2, 'sawtooth', 0.05, 0, null, 520); },
    land(i) { tone(120 + i * 8, 0.09, 'sine', 0.3, 0, null, 60); noise(0.05, 0.1, 2500); },
    scatter(n) { [0, 4, 7, 12].forEach((s, i) => tone(N(72 + n * 2 + s), 0.3, 'triangle', 0.22, ac && ac.currentTime + i * 0.05)); },
    tease() { tone(90, 0.5, 'sawtooth', 0.12, 0, null, 180); },
    win(k) { const b = 72 + Math.min(k, 8) * 2; [0, 4, 7].forEach((s, i) => tone(N(b + s), 0.22, 'square', 0.09, ac && ac.currentTime + i * 0.06)); },
    pop(k) { tone(N(60 + Math.min(k, 10) * 2), 0.12, 'triangle', 0.25, 0, null, N(84)); noise(0.12, 0.14, 1800); },
    coin() { tone(N(96), 0.08, 'square', 0.06); tone(N(101), 0.14, 'square', 0.06, ac && ac.currentTime + 0.05); },
    tick() { tone(1400, 0.03, 'square', 0.035); },
    mult(v) { const b = 76 + Math.min(12, Math.log2(v) * 2); tone(N(b), 0.35, 'triangle', 0.25); tone(N(b + 7), 0.4, 'sine', 0.2, ac && ac.currentTime + 0.07); },
    slam() { tone(70, 0.5, 'sine', 0.6, 0, null, 30); noise(0.3, 0.3, 0, 0, 500); },
    whoosh() { noise(0.4, 0.2, 400); },
    chomp() { noise(0.06, 0.3, 0, 0, 1500); tone(180, 0.06, 'square', 0.12); },
    pour() { for (let i = 0; i < 8; i++) tone(500 + Math.random() * 700, 0.07, 'sine', 0.07, ac && ac.currentTime + i * 0.05); },
    horn() { tone(98, 1.1, 'sawtooth', 0.22); tone(147, 1.1, 'sawtooth', 0.16); tone(196, 1.1, 'square', 0.05); },
    cough() { noise(0.12, 0.25, 0, 0, 900); noise(0.14, 0.22, 0, ac && ac.currentTime + 0.2, 800); },
    boing() { tone(200, 0.3, 'sine', 0.3, 0, null, 620); },
    ding() { tone(N(88), 0.6, 'sine', 0.25); tone(N(100), 0.5, 'sine', 0.08); },
    viral(l) { for (let i = 0; i < 6; i++) tone(N(72 + l * 3 + i * 2), 0.12, 'square', 0.08, ac && ac.currentTime + i * 0.05); },
    fanfare(t) { const r = 60 + t * 2; [[0, 0], [4, 0.12], [7, 0.24], [12, 0.36], [7, 0.52], [12, 0.64], [16, 0.9]].forEach(p => { tone(N(r + p[0]), 0.34, 'square', 0.1, ac && ac.currentTime + p[1]); tone(N(r + p[0] - 12), 0.34, 'triangle', 0.16, ac && ac.currentTime + p[1]); }); },
    engine() { tone(60, 1.4, 'sawtooth', 0.14, 0, null, 190); noise(1.2, 0.08, 0, 0, 400); },
    music(m) { mode = m || mode; try { if (S.ext && S.ext.game.cache.audio.exists('music_base')) { if (timer) { clearInterval(timer); timer = null; } const k = mode === 'base' ? 'music_base' : 'music_live'; if (S.song === k && S.songObj && S.songObj.isPlaying) return; if (S.songObj) { S.songObj.stop(); S.songObj.destroy(); } S.song = k; S.songObj = S.ext.add(k, { loop: true, volume: 0.32 }); S.songObj.play(); return; } } catch (e) { }
      if (!ac || timer) return; nextT = ac.currentTime + 0.1; step = 0; timer = setInterval(sched, 60); }
  };
  // cheeky music-hall oom-pah, 8 bars
  const CH = [[60, 64, 67], [60, 64, 67], [65, 69, 72], [60, 64, 67], [67, 71, 74], [65, 69, 72], [60, 64, 67], [67, 71, 74]];
  const MEL = [[76, 0, 79, 76, 72, 0, 74, 76], [79, 0, 76, 0, 72, 74, 76, 0], [77, 0, 81, 77, 72, 0, 74, 77], [76, 79, 76, 72, 0, 0, 67, 72], [74, 0, 79, 74, 71, 0, 74, 79], [77, 76, 74, 72, 69, 0, 72, 74], [76, 0, 72, 76, 79, 0, 84, 0], [83, 79, 74, 71, 67, 0, 0, 0]];
  function sched() {
    if (!ac) return; const bpm = mode === 'free' ? 148 : mode === 'bonus' ? 160 : 124, sp = 60 / bpm / 2, tr = mode === 'free' ? 2 : mode === 'bonus' ? 5 : 0;
    while (nextT < ac.currentTime + 0.25) {
      const bar = Math.floor(step / 8) % 8, s = step % 8, c = CH[bar];
      if (s % 4 === 0) tone(N(c[0] - 24 + tr), sp * 1.6, 'triangle', 0.5, nextT, musicGain); if (s % 4 === 2) tone(N(c[2] - 24 + tr - (s === 6 ? 12 : 0)), sp * 1.4, 'triangle', 0.4, nextT, musicGain);
      if (s % 2 === 1 || s % 4 === 2) c.forEach(n => tone(N(n + tr), sp * 0.5, 'square', 0.06, nextT, musicGain));
      const m = MEL[bar][s]; if (m) tone(N(m + tr), sp * 0.9, mode === 'free' ? 'sine' : 'triangle', 0.3, nextT, musicGain);
      if (mode !== 'base' && s % 2 === 0) { const t = nextT; noise(0.03, 0.03, 6000, t); }
      nextT += sp; step++;
    }
  }
  g.Sfx = S;
})(window);
