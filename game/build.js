const fs = require('fs'), p = f => fs.readFileSync(__dirname + '/' + f, 'utf8');
const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<title>Dottie Goes Live</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;700&family=Luckiest+Guy&display=swap" rel="stylesheet">
<style>html,body{margin:0;height:100%;background:#120726;overflow:hidden;touch-action:manipulation;-webkit-user-select:none;user-select:none}#game{width:100vw;height:100vh;height:100dvh}canvas{display:block}</style>
</head><body><div id="game"></div>
<script>${p('node_modules/phaser/dist/phaser.min.js').replace(/<\/script/g, '<\\/script')}</script>
<script>${['i18n', 'engine', 'art', 'audio', 'game', 'layout', 'features', 'peggy', 'clips'].map(f => p('src/' + f + '.js')).join('\n')}</script>
</body></html>`;
fs.mkdirSync(__dirname + '/dist', { recursive: true }); fs.writeFileSync(__dirname + '/dist/index.html', html);
console.log('built', (html.length / 1024).toFixed(0) + ' KB');
