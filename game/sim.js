require('./src/engine.js');
const E = globalThis.Engine;
const N = +process.argv[2] || 1e6;
let base = 0, fs = 0, bonus = 0, scat = 0, hits = 0, fsN = 0, bonN = 0, boosts = 0, viral = [0, 0, 0, 0], max = 0, big = [0, 0, 0, 0];
for (let i = 0; i < N; i++) {
  const r = E.play();
  base += r.baseWin; scat += r.scatPay; if (r.free) { fs += r.free.total; fsN++; } if (r.bonus) { bonus += r.bonus.win; bonN++; }
  if (r.total > 0) hits++; if (r.total > max) max = r.total;
  r.events.forEach(e => { if (e.type === 'boost') boosts++; if (e.type === 'viral') viral[e.level]++; });
  if (r.total >= 100) big[3]++; else if (r.total >= 50) big[2]++; else if (r.total >= 25) big[1]++; else if (r.total >= 10) big[0]++;
}
const p = x => (100 * x / N).toFixed(2) + '%';
console.log('RTP', p(base + fs + bonus + scat), '| base', p(base), 'fs', p(fs), 'bonus', p(bonus), 'scat', p(scat));
console.log('hit', p(hits), '| FS 1 in', (N / fsN).toFixed(0), 'avg', (fs / fsN).toFixed(1), '| bonus 1 in', (N / bonN).toFixed(0), '| boost 1 in', (N / boosts).toFixed(1));
console.log('viral 1 in', viral.slice(1).map(v => (N / v).toFixed(0)).join(' / '), '| max', max.toFixed(0), '| big/mega/epic/full 1 in', big.map(v => (N / v).toFixed(0)).join(' / '));
let b = 0; const M = 20000; for (let i = 0; i < M; i++) b += E.play({ buy: true }).total;
console.log('buy avg', (b / M).toFixed(1), 'x for', E.BUY_COST);
