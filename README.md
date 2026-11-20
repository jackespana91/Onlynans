# Only Nans

Dottie Goes Live, a Phaser 3 tumble slot.

## Rebuild and play

```bash
cd game
npm install
node build.js
```

That writes `game/dist/index.html`. Serve that folder over http and open it. Add `#es` for the Argentine text.

The slot source is in `game/src`. Every file there matches the local build byte for byte.

## Art and audio

Peggy sprites, symbol art, and mp3s are not in this repo. This GitHub connection can only write text, and those files are about 40MB of images and sound. Without them the game still runs: Peggy falls back to the code-drawn character and the synth soundtrack in `game/src/audio.js`.

Drop the asset pack in `game/dist/assets` and `game/dist/snd` (same filenames as `game/src/peggy.js` loads) and they show up with no code change. See `game/ART_HANDOVER.md`.
