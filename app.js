// Canon Pro Config - offline simple app
const PRESETS_ES = {
  "Retrato humano": { modo:"M", apertura:"f/3.5 – f/5.6", velocidad:"1/125 – 1/250 s", iso:"100–800", wb:"5200–5600 K", af:"AF-S / Punto único", estilo:"Neutral", lente:"15–45mm (usar ~35–45mm para retratos)", consejos:"Acerca el sujeto, baja la apertura si quieres bokeh, Eye AF ON si está disponible" },
  "Paisaje": { modo:"M", apertura:"f/8 – f/11", velocidad:"1/125 – 1/250 s", iso:"100", wb:"5200–5600 K", af:"MF / Infinito", estilo:"Vivid", lente:"15mm – 24mm (gran angular)", consejos:"Trípode, polarizador para cielos y agua, enfoque hiperfocal" },
  "Arquitectura": { modo:"M", apertura:"f/8 – f/16", velocidad:"1/125 – 1/250 s", iso:"100", wb:"5200–5600 K", af:"AF-S / Wide", estilo:"Clear", lente:"15–24mm", consejos:"Nivela la cámara, corrige perspectivas en edición" },
  "Amanecer / Atardecer": { modo:"M", apertura:"f/5.6 – f/11", velocidad:"1/60 – 1/125 s", iso:"100–200", wb:"5600–6000 K", af:"AF-S / Punto flexible", estilo:"Vivid", lente:"15–45mm", consejos:"Dispara en RAW, usa trípode y captura reflejos" },
  "Noche urbana / ciudad": { modo:"M", apertura:"f/3.5 – f/5.6", velocidad:"1/10 – 1/60 s", iso:"400–1600", wb:"3200–4000 K", af:"MF / Peaking si necesario", estilo:"Neutral", lente:"15–45mm", consejos:"Trípode, evita ISO muy alto, usa balance frío para farolas" },
  "Luna llena / nocturno": { modo:"M", apertura:"f/5.6 – f/8", velocidad:"1/125 – 1/250 s", iso:"100", wb:"5200–5600 K", af:"MF / Peaking", estilo:"Neutral", lente:"Tele o recorte (G50 15-45 limit-> usar focal larga y crop)", consejos:"Trípode, ISO bajo, velocidad alta para no quemar la luna" },
  "Aves volando / animales mov.": { modo:"M", apertura:"f/5.6 – f/8", velocidad:"1/500 – 1/2000 s", iso:"400–1600", wb:"5200 K", af:"AF-C / Tracking", estilo:"Neutral", lente:"Tele (si tienes)", consejos:"Ráfaga rápida, seguimiento del ojo" },
  "Lagos / ríos / cascadas": { modo:"M", apertura:"f/8 – f/16", velocidad:"0.5 – 2 s", iso:"100", wb:"5200 K", af:"MF / Infinity", estilo:"Vivid", lente:"15–45mm", consejos:"Filtro ND, trípode, usa apertura alta para mayor DOF" }
};

const scenes = Object.keys(PRESETS_ES);
const grid = document.getElementById('sceneGrid');
const card = document.getElementById('card');
const cardTitle = document.getElementById('cardTitle');
const cardBody = document.getElementById('cardBody');
const closeBtn = document.getElementById('closeBtn');
const copyBtn = document.getElementById('copyBtn');
const favBtn = document.getElementById('favBtn');
const exportBtn = document.getElementById('exportBtn');
const langBtn = document.getElementById('langBtn');
const tutorial = document.getElementById('tutorial');
const tutorialOk = document.getElementById('tutorialOk');

let current = scenes[0];
let lang = localStorage.getItem('cpc_lang') || 'es';
let favorites = JSON.parse(localStorage.getItem('cpc_favs')||'[]');

function renderGrid(){
  grid.innerHTML = '';
  scenes.forEach(s=>{
    const btn = document.createElement('div');
    btn.className='scene-btn';
    btn.innerHTML = `<div class="scene-icon">📷</div><div class="scene-label">${s}</div>`;
    btn.onclick = ()=>openCard(s);
    grid.appendChild(btn);
  });
}

function openCard(s){
  current = s;
  cardTitle.textContent = s;
  cardBody.innerHTML='';
  const p = PRESETS_ES[s];
  for(const k of ['modo','apertura','velocidad','iso','wb','af','estilo','lente','consejos']){
    const node = document.createElement('div');
    node.className='preset-item';
    node.innerHTML = `<div class="k">${k.toUpperCase()}</div><div class="v">${p[k] || ''}</div>`;
    cardBody.appendChild(node);
  }
  card.classList.remove('hidden');
  window.scrollTo({top:0,behavior:'smooth'});
}

closeBtn.onclick = ()=>{ card.classList.add('hidden'); }
copyBtn.onclick = ()=>{
  const p = PRESETS_ES[current];
  const text = `Escena: ${current}
Modo: ${p.modo}
Apertura: ${p.apertura}
Velocidad: ${p.velocidad}
ISO: ${p.iso}
WB: ${p.wb}
AF: ${p.af}
Lente: ${p.lente}
Consejos: ${p.consejos}`;
  navigator.clipboard.writeText(text).then(()=>alert('Copiado al portapapeles'));
};
favBtn.onclick = ()=>{
  favorites.unshift({name:current, preset:PRESETS_ES[current]}); localStorage.setItem('cpc_favs',JSON.stringify(favorites)); alert('Guardado en Favoritos');
};
exportBtn.onclick = ()=>{
  const p = PRESETS_ES[current];
  const blob = new Blob([`Escena: ${current}
`+Object.keys(p).map(k=>`${k}: ${p[k]}`).join('
')],{type:'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download=`${current}.txt`; a.click(); URL.revokeObjectURL(url);
};

langBtn.onclick = ()=>{ lang = (lang==='es'?'en':'es'); localStorage.setItem('cpc_lang', lang); alert('Idioma cambiado (solo interfaz): '+lang); }

tutorialOk.onclick = ()=>{ tutorial.classList.add('hidden'); localStorage.setItem('cpc_seen_tutorial','1'); }

if(!localStorage.getItem('cpc_seen_tutorial')){ tutorial.classList.remove('hidden'); }

renderGrid();

if('serviceWorker' in navigator){ navigator.serviceWorker.register('sw.js').then(()=>console.log('SW registered')).catch(()=>{}); }
