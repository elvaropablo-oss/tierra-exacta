import { substrateCriteria, substrateProducts, verifiedAt } from './products/substrate-products.js';

const engine=window.CommerceEngine;
const form=document.querySelector('#bags-form');
if(!engine||!form)throw new Error('CommerceEngine o formulario de sacos no disponible');

const money=value=>new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR',maximumFractionDigits:2}).format(value);
const fmt=(value,digits=1)=>new Intl.NumberFormat('es-ES',{maximumFractionDigits:digits}).format(value);
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const number=name=>{const raw=String(form.elements.namedItem(name)?.value??'').replace(',','.');const parsed=Number.parseFloat(raw);return Number.isFinite(parsed)?parsed:0;};
let active=false;

function ensureStyles(){
  if(document.querySelector('link[data-commerce-style]'))return;
  const link=document.createElement('link');
  link.rel='stylesheet';
  link.href='/tierra-exacta/assets/commerce.css?v=20260912-2';
  link.dataset.commerceStyle='';
  document.head.appendChild(link);
}

function ensureSection(){
  let section=document.querySelector('#substrate-commerce');
  if(section)return section;
  section=document.createElement('section');
  section.id='substrate-commerce';
  section.className='commerce';
  section.setAttribute('aria-labelledby','substrate-commerce-title');
  section.innerHTML=`
    <div class="commerce-head">
      <div><p class="eyebrow">Compra comparada</p><h2 id="substrate-commerce-title">Sustratos reales para tu volumen</h2><p>Usamos los litros que acabas de calcular para comparar sacos reales: cuántos necesitas, coste total, sobrante e índice calidad-precio.</p></div>
      <label class="commerce-sort">Ordenar por<select data-commerce-sort><option value="value">Calidad-precio</option><option value="cost">Coste total</option><option value="waste">Menor sobrante</option><option value="technical">Índice técnico</option></select></label>
    </div>
    <div class="commerce-recommended" data-commerce-recommended hidden></div>
    <div class="commerce-summary" data-commerce-summary><div class="commerce-empty">Calcula los sacos para generar una comparación con tu volumen.</div></div>
    <div class="commerce-winners" data-commerce-winners></div>
    <div class="commerce-products" data-commerce-products></div>
    <div class="commerce-method">
      <details><summary>Cómo calculamos el índice calidad-precio</summary><p>La economía pesa un 55 % y el índice técnico un 45 %. El índice técnico usa solo datos declarados por la tienda o fabricante: uso universal, nutrientes, aireación/drenaje, gestión de humedad, ausencia de turba y aptitud ecológica. Si faltan demasiados datos, no mostramos nota de calidad-precio.</p></details>
      <p class="commerce-disclosure">Precios comprobados el ${verifiedAt.split('-').reverse().join('/')}; pueden cambiar y no incluyen transporte. Los enlaces son oficiales. Cuando exista afiliación activa, algunos podrán generar una comisión sin coste adicional y sin alterar el ranking. <a href="/afiliacion.html" target="_blank" rel="noopener noreferrer">Cómo funciona la afiliación</a>.</p>
    </div>`;
  document.querySelector('.calculator')?.insertAdjacentElement('afterend',section);
  section.querySelector('[data-commerce-sort]')?.addEventListener('change',()=>{if(active)render();});
  return section;
}

function readTarget(){
  const required=number('requiredLitres');
  const reserve=Math.max(0,number('reserve'));
  return required>0?{required,reserve,target:required*(1+reserve/100)}:null;
}

function sortRows(rows,mode){
  const copy=[...rows];
  if(mode==='cost')return copy.sort((a,b)=>a.purchase.projectCost-b.purchase.projectCost);
  if(mode==='waste')return copy.sort((a,b)=>a.purchase.waste-b.purchase.waste||a.purchase.projectCost-b.purchase.projectCost);
  if(mode==='technical')return copy.sort((a,b)=>(b.technical?.score??-1)-(a.technical?.score??-1)||a.purchase.projectCost-b.purchase.projectCost);
  return copy.sort((a,b)=>(b.valueScore??-1)-(a.valueScore??-1)||a.purchase.projectCost-b.purchase.projectCost);
}

function winnerCard(label,row,metric){
  if(!row)return'';
  return `<article><span>${esc(label)}</span><b>${esc(row.name)}</b><strong>${esc(metric)}</strong></article>`;
}

function knownSpecs(row){
  return substrateCriteria.filter(c=>row.specs?.[c.key]!==null&&row.specs?.[c.key]!==undefined).map(c=>({label:c.label,value:row.specs[c.key]===true?'Sí':'No'}));
}

function recommendationCard(row,winners,targetData){
  if(!row)return'';
  const value=row.valueScore!==null?`${fmt(row.valueScore,0)}/100`:'—';
  const reason=winners.bestValue?.id===row.id?'Es la mejor combinación entre coste real para tu volumen y características técnicas documentadas.':'Es la opción compatible con menor coste real para completar tu volumen entre las comparadas.';
  return `<article class="recommended-product">
    <div class="recommended-product__label">Recomendado para tu compra</div>
    <div class="recommended-product__grid">
      <div class="recommended-product__copy"><small>${esc(row.retailer)} · precio comprobado ${verifiedAt.split('-').reverse().join('/')}</small><h3>${esc(row.name)}</h3><p>${esc(reason)}</p><div class="commerce-features">${(row.featureLabels||[]).slice(0,4).map(x=>`<span>${esc(x)}</span>`).join('')}</div></div>
      <div class="recommended-product__score"><b>${value}</b><span>calidad-precio</span></div>
    </div>
    <div class="recommended-product__numbers"><div><span>Compra necesaria</span><strong>${row.purchase.units} ${row.purchase.units===1?'saco':'sacos'}</strong></div><div><span>Volumen comprado</span><strong>${fmt(row.purchase.purchased,0)} L</strong></div><div><span>Sobrante</span><strong>${fmt(row.purchase.waste,1)} L</strong></div><div><span>Coste total</span><strong>${money(row.purchase.projectCost)}</strong></div></div>
    <p class="recommended-product__context">Para un objetivo de <strong>${fmt(targetData.target,1)} L</strong>. El coste se calcula comprando envases completos, no con un €/L teórico.</p>
    <a class="button button--clay recommended-product__cta" data-product-link="${esc(row.id)}" href="${esc(row.link.url)}" target="_blank" rel="${row.link.affiliate?'sponsored noopener noreferrer':'noopener noreferrer'}">Ver producto y precio actual <span aria-hidden="true">↗</span></a>
  </article>`;
}

function productCard(row,winners){
  const badges=[];
  if(winners.cheapest?.id===row.id)badges.push('Menor coste');
  if(winners.leastWaste?.id===row.id)badges.push('Menor sobrante');
  if(winners.bestValue?.id===row.id)badges.push('Mejor calidad-precio');
  if(winners.bestTechnical?.id===row.id)badges.push('Mejor índice técnico');
  const tech=row.technical?.score!==null?`${fmt(row.technical.score,0)}/100`:'—';
  const value=row.valueScore!==null?`${fmt(row.valueScore,0)}/100`:'Sin nota';
  const coverage=Math.round((row.technical?.coverage||0)*100);
  return `<article class="commerce-card${winners.bestValue?.id===row.id?' commerce-card--best':''}">
    <div class="commerce-card-top"><div><div class="commerce-badges">${badges.map(x=>`<span>${esc(x)}</span>`).join('')}</div><small>${esc(row.retailer)} · ${fmt(row.size,0)} L por saco</small><h3>${esc(row.name)}</h3></div><div class="commerce-score"><b>${value}</b><span>calidad-precio</span></div></div>
    <div class="commerce-price"><strong>${money(row.purchase.projectCost)}</strong><span>${row.purchase.units} ${row.purchase.units===1?'saco':'sacos'} · ${fmt(row.purchase.purchased,0)} L comprados</span></div>
    <dl class="commerce-metrics"><div><dt>Precio/saco</dt><dd>${money(row.price)}</dd></div><div><dt>Sobrante</dt><dd>${fmt(row.purchase.waste,1)} L</dd></div><div><dt>€/L comprado</dt><dd>${money(row.purchase.unitCost)}</dd></div><div><dt>Índice técnico</dt><dd>${tech}</dd></div></dl>
    <div class="commerce-features">${(row.featureLabels||[]).map(x=>`<span>${esc(x)}</span>`).join('')}</div>
    <details class="commerce-tech"><summary>Ver criterios técnicos (${coverage}% documentado)</summary><ul>${knownSpecs(row).map(item=>`<li><span>${esc(item.label)}</span><b>${item.value}</b></li>`).join('')}</ul></details>
    <a class="button commerce-link" data-product-link="${esc(row.id)}" href="${esc(row.link.url)}" target="_blank" rel="${row.link.affiliate?'sponsored noopener noreferrer':'noopener noreferrer'}">Ver producto y precio actual <span aria-hidden="true">↗</span></a>
  </article>`;
}

function attachProductTracking(section,rows,targetData){
  section.querySelectorAll('[data-product-link]').forEach(anchor=>anchor.addEventListener('click',()=>{
    const product=substrateProducts.find(item=>item.id===anchor.dataset.productLink);
    const row=rows.find(item=>item.id===product?.id);
    if(product)engine.track('substrate_product_open',product,{required_litres:targetData.target,units:row?.purchase.units||null,project_cost:row?.purchase.projectCost||null});
  }));
}

function render(){
  const targetData=readTarget();
  if(!targetData)return;
  ensureStyles();
  const section=ensureSection();
  const rows=engine.rank(substrateProducts,{required:targetData.target,technicalCriteria:substrateCriteria,economyWeight:.55,technicalWeight:.45,minimumTechnicalCoverage:.6});
  const winners=engine.winners(rows);
  const mode=section.querySelector('[data-commerce-sort]')?.value||'value';
  const ordered=sortRows(rows,mode);
  const recommended=winners.bestValue||winners.cheapest||ordered[0]||null;
  const recommendedHost=section.querySelector('[data-commerce-recommended]');
  recommendedHost.hidden=!recommended;
  recommendedHost.innerHTML=recommendationCard(recommended,winners,targetData);
  section.querySelector('[data-commerce-summary]').innerHTML=`<div><span>Necesitas</span><b>${fmt(targetData.required,1)} L</b></div><div><span>Margen</span><b>${fmt(targetData.reserve,0)}%</b></div><div><span>Objetivo de compra</span><b>${fmt(targetData.target,1)} L</b></div><div><span>Productos comparados</span><b>${rows.length}</b></div>`;
  section.querySelector('[data-commerce-winners]').innerHTML=[
    winnerCard('Menor coste',winners.cheapest,winners.cheapest?money(winners.cheapest.purchase.projectCost):''),
    winnerCard('Menor sobrante',winners.leastWaste,winners.leastWaste?`${fmt(winners.leastWaste.purchase.waste,1)} L`:''),
    winnerCard('Mejor calidad-precio',winners.bestValue,winners.bestValue?`${fmt(winners.bestValue.valueScore,0)}/100`:''),
    winnerCard('Mejor índice técnico',winners.bestTechnical,winners.bestTechnical?`${fmt(winners.bestTechnical.technical.score,0)}/100`:'')
  ].join('');
  section.querySelector('[data-commerce-products]').innerHTML=ordered.map(row=>productCard(row,winners)).join('');
  attachProductTracking(section,rows,targetData);
}

ensureStyles();
ensureSection();
form.addEventListener('submit',()=>{active=true;setTimeout(render,0);});
form.addEventListener('input',()=>{if(active)render();});
document.addEventListener('click',event=>{
  const trigger=event.target.closest('[data-compare-substrates]');
  if(!trigger)return;
  event.preventDefault();
  active=true;
  render();
  ensureSection().scrollIntoView({behavior:'smooth',block:'start'});
});
if(new URLSearchParams(location.search).get('litros')){active=true;render();}
