# Dottie Goes Live: art handover

Prototype 6x5 tumble slot (Phaser 3). Everything not listed under "Already final-style art" is drawn in code as a placeholder and needs real art.

## Run it
- Play: serve `dist/` over http (`cd dist && python3 -m http.server 8000`, open http://localhost:8000). Add `#es` for the Argentine version.
- Rebuild after changes: `npm install` once, then `node build.js` (writes `dist/index.html`).
- INFO > CLIPS inside the game triggers every feature and clip for free.

## Where art lives
- `dist/assets/` and `dist/snd/`: image and audio files loaded at runtime (from the GILF Live package). Replace a file with the same name and size and it shows up, no code change.
- `src/art.js`: every placeholder, drawn in code. Each `tex('name', width, height, ...)` is one texture. To replace one with a file, load it in `src/peggy.js` `preload` and add an `ext('name', 'loadedKey', w, h, 0)` line at the bottom of `src/art.js` (see the existing lines for the low symbols).
- `tools/pack.py`: rebuilds `dist/assets` and `dist/snd` from the GILF Live demo folder.

## Already final-style art (from GILF Live)
- Peggy streamer: stills `pg_base`, `pg_live`, `pg_u1` (each with `-h` half-blink and `-c` closed-eye versions), 349x450 px each.
- Peggy animation sheets `pg_<clip>.webp`: 349x450 frames, 8 per row, played at 12 fps. Clips: rest-r1 (26 frames), rest-r2, rest-r3, rest-r4, live-topfan, live-viral, live-angry, l1-angry (53 each), live-l1 (52).
- Low symbols: envelope, cherries, champagne, cuffs. Tip multiplier: LIVE phone. Source 256x256.
- Bedroom: `room_strip` 688x300 (mobile stream panel), `room_studio` 740x764 (desktop), `bg_port` 720x1280 and `bg_land` 1600x900 (blurred backdrops).
- Unused but included: sym_high_bra, sym_high_camcorder, sym_high_clapper, sym_high_photo, sym_scatter_ringlight.

## Still placeholder: needs art
Sizes are the size drawn in code. Deliver at 2x or more, transparent PNG or WebP, same proportions.

Grid symbols (160x160 each, shown at about 106 px on mobile, 117 px on desktop)
- Four nan highs: sym_MABEL, sym_BRENDA, sym_VIOLET, sym_GLADYS (round avatar with name plate)
- sym_DOTTIE top symbol (currently Peggy's face in a code-drawn ring)
- sym_SCAT (cruise scatter), sym_BONUS (PICK ME sign)
- Doris wild, four tiles that join vertically: sym_WILD_top, sym_WILD_mid, sym_WILD_bot, sym_WILD_one. Body is 108 px wide, x 26 to 134. Mid runs edge to edge; top starts 30 px down; bottom ends 10 px above the edge.

Characters
- big_MABEL / BRENDA / VIOLET / GLADYS / DORIS avatars 260x260; big_DOTTIE 320x320 (bonus pick, power cards, win clips)
- full-body nans full_MABEL / BRENDA / VIOLET / GLADYS / DOTTIE / DORIS 170x260 (conga, Hen Do, cruise pier, Doris walk-on)
- steve 260x300 (head and shoulders)
- Peggy poses that do not exist yet: seated on mobility scooter (desktop drive-off), in the rocking chair (rocker 280x300), on the scooter for the win clip (scooter 340x260)

Scenes and backdrops
- deck 688x300 and deck_tall 740x764 (cruise stream background, mobile and desktop)
- sky 360x640, sun 260x260, cloud 220x100, wave 240x70 (tiles horizontally), ship 600x300 (cruise intro and outro)
- curtain 360x640 (bingo pick and Hen Do), rays 512x512, disco 150x150
- bg 360x640 fallback backdrop

Props
- teapot 260x210, dent_top and dent_bot 280x130 each (chomping dentures), trowel 90x150, crown 160x110
- Fry-up rain: sausage 120x56, egg 110x90, beans 100x70, toast 96x96, bacon 130x50
- Particles: coin 60x60, heart 56x56, star 56x56, thumb 56x56, puff 128x128, drop 24x30, confetti 16x10

UI
- btn_spin and btn_stop 190x190, btn_sm and btn_on 96x96, pill and pill_p 240x64, bubble 300x120 (speech bubble)
- All text is live text (Luckiest Guy and Fredoka from Google Fonts), including the logo, win tier titles and clip captions. Logo and win titles would benefit from drawn lettering.

Clips that are staged in code and would need animation or redrawn scenes
- Splash / going live, cruise intro, cruise outro, bingo pick, Hen Do, max win
- Win tiers: Cheeky (rocking chair), Dirty (scooter), Filthy (conga), The Full Monty (fry-up rain, CENSORED bar)
- Boosts: Tea's Up, Teeth Out, Ciggie Break, Steve; Dirty Text phone; Stowaway Steve; Doris planting

Audio
- Real: Peggy voice lines, two music tracks, effects in `dist/snd/` (English only).
- Placeholder: all other sounds are synthesised in `src/audio.js`. No Spanish voice lines.

## Layout numbers
- Mobile canvas 720x1280. Grid cells 112x112, grid origin (24, 440). Stream panel 688x300 at (16, 92).
- Desktop canvas 1600x900. Studio panel 740x764 on the left, grid scaled about 1.1x on the right, 120 px control bar along the bottom.
- Clips and menus play in a 720x1280 portrait panel on both layouts.

## Notes
- Name: game text says Dottie (Porota in Spanish); the streamer art is Peggy. Not yet reconciled.
- Maths in `src/engine.js` is demo maths, uncertified. `sim2.js` and `tune.js` re-run the RTP simulations.
- Not wired to Stake Engine.
