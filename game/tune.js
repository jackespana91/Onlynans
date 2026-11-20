require('./src/engine.js');const E=Engine;const n=+process.argv[2]||40000;
function buy(k){let t=0,ev=0,sp=0;for(let i=0;i<n;i++){const r=E.play({buy:k});t+=r.total;r.free.spins.forEach(s=>{sp++;if(s.events.some(e=>['boost','text','doris','power'].includes(e.type)))ev++})}return (t/n).toFixed(1)+' ('+(100*ev/sp).toFixed(0)+'% of spins have a feature, '+(sp/n).toFixed(1)+' spins)'}
console.log('weekend',buy('cruise'));console.log('fortnight',buy('filthy'));
