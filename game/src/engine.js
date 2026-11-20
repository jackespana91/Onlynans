/* DOTTIE GOES LIVE — demo maths engine. Pure logic, no DOM. Produces a full event list per round. */
(function (g) {
  const COLS = 6, ROWS = 5;
  const LOWS = ['TEA', 'DENT', 'BINGO', 'YARN'];
  const HIGHS = ['MABEL', 'BRENDA', 'VIOLET', 'GLADYS', 'DOTTIE'];
  const PAY_SYMS = LOWS.concat(HIGHS);
  // pays (x total bet) for 8-9 / 10-11 / 12+ anywhere
  const PAYS = {
    TEA: [0.2, 0.6, 1.6], DENT: [0.3, 0.7, 3.2], BINGO: [0.4, 0.8, 4], YARN: [0.6, 1, 6.5],
    MABEL: [0.8, 1.2, 8], BRENDA: [1.2, 1.6, 9.5], VIOLET: [1.6, 4, 12], GLADYS: [2, 8, 20], DOTTIE: [8, 20, 40]
  };
  const SCAT_PAY = { 4: 3, 5: 5, 6: 100 };
  const FS_AWARD = { 4: 10, 5: 12, 6: 15 };
  const W = {
    base: { TEA: 19, DENT: 17, BINGO: 15, YARN: 14, MABEL: 12, BRENDA: 11, VIOLET: 9, GLADYS: 8, DOTTIE: 6, SCAT: 1.95, MULT: 0.82, BONUS: 1.25 },
    free: { TEA: 24, DENT: 20, BINGO: 16, YARN: 13, MABEL: 10, BRENDA: 8, VIOLET: 7, GLADYS: 6, DOTTIE: 5, SCAT: 1.6, MULT: 0.9, BONUS: 0 }
  };
  const MULT_VALS = [[2, 300], [3, 220], [4, 160], [5, 120], [6, 80], [8, 60], [10, 45], [12, 25], [15, 18], [20, 10], [25, 6], [50, 3], [100, 1]];
  const VIRAL = { 3: 2, 5: 3, 7: 5 };           // added to the spin multiplier at Nth consecutive tumble
  const BOOST_CHANCE = 1 / 50;
  const BONUS_PRIZES = [[5, 30], [8, 24], [10, 18], [15, 12], [20, 8], [30, 5], [50, 2.5], [100, 0.5]];
  const BONUS_FS_CHANCE = 0.12;
  const MAX_WIN = 10000, TIP_GOAL = 400, TEXT_CHANCE = 1 / 45, NANS4 = ['MABEL', 'BRENDA', 'VIOLET', 'GLADYS'];
  let DORIS_BASE = 1 / 58, DORIS_FREE = 1 / 18, FREE_BOOST = 1 / 8, FREE_TEXT = 1 / 20; const DORIS_H = [[1, 26], [2, 28], [3, 24], [4, 14], [5, 8]];

  let rnd = Math.random;
  const ri = n => Math.floor(rnd() * n);
  function pickW(pairs) { let t = 0; for (const p of pairs) t += p[1]; let r = rnd() * t; for (const p of pairs) { r -= p[1]; if (r < 0) return p[0]; } return pairs[pairs.length - 1][0]; }
  const BOOSTS = { cruise: { cost: 1.25, scat: 2.44 }, chat: { cost: 1.5, chance: 1 / 8.2 } };
  const BUYS = { spin: 27, cruise: 100, filthy: 300 };
  const FILTHY = { spins: 15, jar: 17 };
  W.baseC = Object.assign({}, W.base, { SCAT: BOOSTS.cruise.scat });
  W.hen = Object.assign({}, W.free, { TEA: 0, DENT: 0, SCAT: 0 });
  const tables = {}; let cur = 'base';
  for (const m in W) tables[m] = Object.entries(W[m]).filter(e => e[1] > 0);
  function cell(mode, only) {
    const s = only ? only[ri(only.length)] : pickW(tables[cur]);
    return s === 'MULT' ? { s, v: pickW(MULT_VALS) } : { s };
  }
  const copy = grid => grid.map(col => col.map(c => Object.assign({}, c)));
  function newGrid(mode) { const gr = []; for (let c = 0; c < COLS; c++) { gr.push([]); for (let r = 0; r < ROWS; r++) gr[c].push(cell(mode)); } return gr; }
  function count(grid, s) { let n = 0; for (const col of grid) for (const c of col) if (c.s === s) n++; return n; }
  function positions(grid, pred) { const out = []; for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) if (pred(grid[c][r])) out.push([c, r]); return out; }
  function evaluate(grid) {
    const wins = [];
    const wild = positions(grid, c => c.s === 'WILD');
    for (const s of PAY_SYMS) {
      const own = positions(grid, c => c.s === s), n = own.length + wild.length;
      if (own.length && n >= 8) { const tier = n >= 12 ? 2 : n >= 10 ? 1 : 0; wins.push({ sym: s, count: n, positions: own.concat(wild), pay: PAYS[s][tier] }); }
    }
    return wins;
  }
  function removeAndFill(grid, removed, mode, only) {
    const kill = {}; removed.forEach(p => kill[p[0] + '_' + p[1]] = 1);
    const fills = [];
    for (let c = 0; c < COLS; c++) {
      const keep = grid[c].filter((x, r) => !kill[c + '_' + r]);
      const n = ROWS - keep.length, f = [];
      for (let i = 0; i < n; i++) f.push(cell(mode, only));
      fills.push(f); grid[c] = f.concat(keep);
    }
    return fills;
  }
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = ri(i + 1);[a[i], a[j]] = [a[j], a[i]]; } return a; }

  function applyBoost(grid, mode, events, force) {
    const hasWin = evaluate(grid).length > 0;
    let kind = force || (hasWin ? 'STEVE' : pickW([['TEAPOT', 4], ['DENTURES', 3], ['CIGGIE', 3]]));
    if (kind === 'TEAPOT') {
      const from = LOWS.slice().sort((a, b) => count(grid, b) - count(grid, a))[0];
      const to = pickW([['MABEL', 5], ['BRENDA', 4], ['VIOLET', 3], ['GLADYS', 2], ['DOTTIE', 1]]);
      const pos = positions(grid, c => c.s === from);
      if (!pos.length) return;
      pos.forEach(p => grid[p[0]][p[1]] = { s: to });
      events.push({ type: 'boost', kind, from, to, positions: pos, grid: copy(grid) });
    } else if (kind === 'DENTURES') {
      const pos = positions(grid, c => c.s === 'TEA' || c.s === 'DENT');
      if (!pos.length) return;
      const fills = removeAndFill(grid, pos, mode, ['MABEL', 'MABEL', 'BRENDA', 'BRENDA', 'VIOLET', 'GLADYS', 'YARN', 'YARN', 'BINGO', 'BINGO']);
      events.push({ type: 'boost', kind, removed: pos, fills, grid: copy(grid) });
    } else if (kind === 'CIGGIE') {
      const to = pickW([['TEA', 6], ['DENT', 6], ['BINGO', 5], ['YARN', 5], ['MABEL', 4], ['BRENDA', 3], ['VIOLET', 2.5], ['GLADYS', 2], ['DOTTIE', 1]]);
      const cand = shuffle(positions(grid, c => PAY_SYMS.includes(c.s) && c.s !== to));
      const need = Math.max(0, 8 + ri(4) - count(grid, to));
      const pos = cand.slice(0, need);
      pos.forEach(p => grid[p[0]][p[1]] = { s: to });
      events.push({ type: 'boost', kind, to, positions: pos, grid: copy(grid) });
    } else if (kind === 'STEVE') {
      const win = {}; evaluate(grid).forEach(w => w.positions.forEach(p => win[p[0] + '_' + p[1]] = 1));
      const cand = shuffle(positions(grid, c => PAY_SYMS.includes(c.s) && !win[c.s] && !win[0]));
      const safe = cand.filter(p => !win[p[0] + '_' + p[1]]);
      const pos = safe.slice(0, 2 + ri(3)), vals = [];
      pos.forEach(p => { const v = pickW(MULT_VALS); vals.push(v); grid[p[0]][p[1]] = { s: 'MULT', v }; });
      if (!pos.length) return;
      events.push({ type: 'boost', kind, positions: pos, values: vals, grid: copy(grid) });
    }
  }

  function doris(grid, events, force) {
    const h = typeof force === 'number' ? force : pickW(DORIS_H), cols = shuffle([0, 1, 2, 3, 4, 5]);
    const col = cols.find(c => { for (let i = 0; i < h; i++) if (!PAY_SYMS.includes(grid[c][ROWS - 1 - i].s)) return false; return true; });
    if (col === undefined) return; const pos = [];
    for (let i = 0; i < h; i++) { const r = ROWS - 1 - i; grid[col][r] = { s: 'WILD', part: h === 1 ? 'one' : i === 0 ? 'bot' : i === h - 1 ? 'top' : 'mid' }; pos.push([col, r]); }
    events.push({ type: 'doris', col, h, positions: pos, grid: copy(grid) });
  }

  // one spin (base or free). Returns {events, win, scat, bonus, jar, tips, extra, got}
  function spinOnce(mode, jar, opt) {
    opt = opt || {}; cur = opt.table || mode;
    const events = []; let grid = newGrid(mode);
    if (opt.forceScat) {
      positions(grid, c => c.s === 'SCAT' || c.s === 'BONUS').forEach(p => grid[p[0]][p[1]] = cell(mode, PAY_SYMS));
      shuffle(positions(grid, () => true)).slice(0, opt.forceScat).forEach(p => grid[p[0]][p[1]] = { s: 'SCAT' });
    }
    if (opt.forceBonus) shuffle(positions(grid, c => c.s !== 'SCAT')).slice(0, 3).forEach(p => grid[p[0]][p[1]] = { s: 'BONUS' });
    events.push({ type: 'reveal', grid: copy(grid) });
    let extraMult = 0, respin = false;
    if (mode === 'base' && !opt.forceScat) {
      if (opt.forceBoost) [].concat(opt.forceBoost).forEach(k => applyBoost(grid, mode, events, k));
      else if (opt.forceText || rnd() < TEXT_CHANCE) {
        const reward = opt.forceText && opt.forceText !== true ? opt.forceText : pickW([['boost', 4], ['mult', 4], ['respin', 3]]);
        const value = reward === 'mult' ? pickW([[3, 4], [5, 4], [8, 3], [10, 2], [15, 1]]) : 0;
        events.push({ type: 'text', reward, value, decoys: ['boost', 'mult', 'respin'].filter(r => r !== reward) });
        if (reward === 'boost') applyBoost(grid, mode, events); else if (reward === 'mult') extraMult = value; else respin = true;
      } else if (opt.forceDoris || rnd() < DORIS_BASE) doris(grid, events, opt.forceDoris);
      else if (rnd() < (opt.chance || BOOST_CHANCE)) applyBoost(grid, mode, events);
    }
    let total = 0, tumbles = 0, viral = 0, extra = 0, dbl = false; const got = [];
    if (mode === 'free') NANS4.concat('DOTTIE').forEach(nm => {
      if (count(grid, nm) < 5) return; got.push(nm);
      if (nm === 'MABEL') { jar += 1; events.push({ type: 'power', nan: nm, jar }); }
      else if (nm === 'VIOLET') { extra++; events.push({ type: 'power', nan: nm }); }
      else if (nm === 'GLADYS') { dbl = true; events.push({ type: 'power', nan: nm }); }
      else if (nm === 'BRENDA') { const c = shuffle(positions(grid, x => LOWS.includes(x.s)))[0]; if (c) { const v = pickW(MULT_VALS); grid[c[0]][c[1]] = { s: 'MULT', v }; events.push({ type: 'power', nan: nm, pos: c, v, grid: copy(grid) }); } }
      else events.push({ type: 'power', nan: nm });
    });
    if (mode === 'free') {
      const r = rnd();
      if (r < DORIS_FREE) doris(grid, events);
      else if (r < DORIS_FREE + FREE_TEXT) {
        const reward = pickW([['boost', 4], ['mult', 4], ['respin', 3]]), value = reward === 'mult' ? pickW([[3, 4], [5, 4], [8, 3], [10, 2], [15, 1]]) : 0;
        events.push({ type: 'text', reward, value, decoys: ['boost', 'mult', 'respin'].filter(x => x !== reward) });
        if (reward === 'boost') applyBoost(grid, mode, events); else if (reward === 'mult') extraMult = value; else respin = true;
      } else if (r < DORIS_FREE + FREE_TEXT + FREE_BOOST) applyBoost(grid, mode, events);
    }
    for (; ;) {
      for (; ;) {
        const wins = evaluate(grid); if (!wins.length) break;
        let step = 0; wins.forEach(w => step += w.pay); total += step; tumbles++;
        events.push({ type: 'win', wins, stepWin: step, total, tumble: tumbles });
        const removed = []; wins.forEach(w => w.positions.forEach(p => removed.push(p)));
        const fills = removeAndFill(grid, removed, mode);
        events.push({ type: 'tumble', removed, fills, grid: copy(grid) });
        if (VIRAL[tumbles]) { viral += VIRAL[tumbles]; events.push({ type: 'viral', level: tumbles === 3 ? 1 : tumbles === 5 ? 2 : 3, add: VIRAL[tumbles], viral }); }
      }
      if (respin && total === 0) { respin = false; grid = newGrid(mode); events.push({ type: 'respin' }); events.push({ type: 'reveal', grid: copy(grid) }); continue; }
      break;
    }
    const hearts = positions(grid, c => c.s === 'MULT').map(p => ({ pos: p, v: grid[p[0]][p[1]].v }));
    let tips = 0; hearts.forEach(h => tips += h.v);
    let sum = viral + extraMult + tips;
    if (total > 0 && sum > 0) {
      const before = total; let add = sum;
      if (mode === 'free') { if (dbl) add *= 2; jar += add; total *= jar; } else total *= sum;
      events.push({ type: 'mults', hearts, viral: viral + extraMult, sum, add, dbl: mode === 'free' && dbl, jar: mode === 'free' ? jar : null, applied: mode === 'free' ? jar : sum, before, after: total });
    }
    const scat = count(grid, 'SCAT'), bonus = count(grid, 'BONUS');
    return { events, win: total, scat, bonus, jar, tips, extra, got, scatPos: positions(grid, c => c.s === 'SCAT'), bonusPos: positions(grid, c => c.s === 'BONUS') };
  }

  function freeRound(n, jar0, forceHen) {
    const spins = []; let jar = jar0 || 0, total = 0, left = n, hen = 0, henDone = false; const have = {}; if (forceHen) NANS4.forEach(x => have[x] = 1);
    while (left > 0 && total < MAX_WIN) {
      left--;
      const isHen = hen > 0; if (isHen) hen--;
      const r = spinOnce('free', jar, isHen ? { table: 'hen' } : {}); jar = r.jar; total += r.win;
      const sp = { events: r.events, win: r.win, jar, retrigger: 0, extra: r.extra, scatPos: r.scatPos, hen: isHen, henStart: false, got: [] };
      r.got.forEach(nm => { if (nm === 'DOTTIE') nm = NANS4.filter(x => !have[x])[0]; if (nm && !have[nm]) { have[nm] = 1; sp.got.push(nm); } });
      left += r.extra;
      if (r.scat >= 3) { sp.retrigger = 5; left += 5; }
      if (!henDone && NANS4.every(x => have[x])) { henDone = true; hen = 3; left += 3; sp.henStart = true; }
      sp.left = left; sp.running = Math.min(total, MAX_WIN); spins.push(sp);
    }
    return { spins, total: Math.min(total, MAX_WIN), awarded: n };
  }

  // a full paid round. opt: {buy:'spin'|'cruise'|'filthy', boost:'cruise'|'chat', forceBoost, forceBonus, forceScat}
  function costOf(opt) { opt = opt || {}; return opt.buy ? BUYS[opt.buy] : opt.boost ? BOOSTS[opt.boost].cost : 1; }
  function play(opt) {
    opt = opt || {}; if (opt.buy === true) opt.buy = 'cruise';
    const o = { forceBoost: opt.forceBoost, forceBonus: opt.forceBonus, forceScat: opt.forceScat };
    if (opt.buy === 'cruise' || opt.buy === 'filthy') o.forceScat = 4 + (rnd() < 0.08 ? 1 : 0);
    if (opt.buy === 'spin') o.forceBoost = ['CIGGIE', 'STEVE'];
    o.forceText = opt.forceText; o.forceDoris = opt.forceDoris; let tip = opt.tip || 0, goal = false; const plain = !opt.buy && !opt.forceBoost && !opt.forceScat && !opt.forceBonus && !opt.forceText && !opt.forceHen && !opt.forceDoris;
    if (plain && tip >= TIP_GOAL) { goal = true; tip = 0; o.forceBoost = ['CIGGIE', 'STEVE']; }
    if (!opt.buy && opt.boost === 'cruise') o.table = 'baseC';
    if (!opt.buy && opt.boost === 'chat') o.chance = BOOSTS.chat.chance;
    const b = spinOnce('base', 0, o);
    const round = { cost: costOf(opt), goal, tip: plain && !goal ? tip + b.tips : tip, events: b.events, baseWin: b.win, scatPos: b.scatPos, bonusPos: b.bonusPos, scatPay: 0, bonus: null, free: null };
    let total = b.win;
    if (b.bonus >= 3) {
      const prize = pickW(BONUS_PRIZES), fs = rnd() < BONUS_FS_CHANCE;
      const decoys = []; while (decoys.length < 3) { const d = pickW(BONUS_PRIZES); if (d !== prize) decoys.push(d); }
      if (!fs && rnd() < 0.5) decoys[0] = 'CRUISE';
      round.bonus = { prize: fs ? 'CRUISE' : prize, win: fs ? 0 : prize, decoys };
      total += round.bonus.win;
    }
    let fsN = 0;
    if (b.scat >= 4) { const k = Math.min(b.scat, 6); round.scatPay = SCAT_PAY[k]; total += round.scatPay; fsN = FS_AWARD[k]; }
    if (round.bonus && round.bonus.prize === 'CRUISE') fsN += 10;
    const filthy = opt.buy === 'filthy' || opt.filthy;
    if (fsN) { round.free = freeRound(filthy ? Math.max(fsN, FILTHY.spins) : fsN, filthy ? FILTHY.jar : 0, opt.forceHen); round.free.jar0 = filthy ? FILTHY.jar : 0; total += round.free.total; }
    round.total = Math.min(total, MAX_WIN);
    return round;
  }

  g.Engine = { COLS, ROWS, LOWS, HIGHS, PAY_SYMS, PAYS, SCAT_PAY, FS_AWARD, MULT_VALS, VIRAL, MAX_WIN, TIP_GOAL, BUYS, BOOSTS, FILTHY, costOf, play, spinOnce, freeRound, setRng: f => rnd = f, _doris: (b, f) => { DORIS_BASE = b; DORIS_FREE = f; }, _free: (b, t) => { FREE_BOOST = b; FREE_TEXT = t; } };
})(typeof window !== 'undefined' ? window : globalThis);
