# Only Nans

Dottie Goes Live — a Phaser 3 tumble slot.

## Source

Slot code is in `game/src`. Rebuild the single-file page with:

```bash
cd game
npm install
node build.js
```

That writes `game/dist/index.html`. Serve that folder over http and open it.

## Host

The preview shell loads `public/play/phaser.min.js` and `public/play/bundle.js` into `#game`.

Art and audio (webp, png, mp3) are loaded from `public/play/assets` and `public/play/snd`. Those binary files are added in follow-up commits when the GitHub file API will take them.
