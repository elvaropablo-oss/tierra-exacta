import { mixProducts, verifiedAt } from './products/mix-products.js';
import { buildMixShopping } from './math/mix-shopping.js';

const engine=window.CommerceEngine;
const form=document.querySelector('#mix-form');
if(!engine||!form)throw new Error('CommerceEngine o formulario de mezcla no disponible');

const money=value=>new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR',maximumFractionDigits:2}).format(value);
const fmt=(value,digits=2)=>new Intl.NumberFormat('es-ES',{maximumFractionDigits:digits}).format(value);
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const pct=value=>`${fmt(value,0)} %`;
let latestResult=null;
let latestRows=[];

function ensureStyles(){
  if(!document.querySelector('link[data-commerce-base-style]')){
    const base=document.createElement('link');
    base.rel='stylesheet';
    base.href='/tierra-exacta/assets/commerce.css?v=20260912-5';
    base.dataset.commerceBaseStyle='';
    document.head.appendChild(base);
  }
  if(!document.querySelector('link[data-mix-commerce-style]')){
    const mix=document.createElement('link');
    mix.rel='stylesheet';
    mix.href='/tierra-exacta/assets/mix-commerce.css?v=20260912-2';
    mix.dataset.mixCommerceStyle='';
    document.head.appendChild(mix);
  }
}

function ensureSection(){
  let section=document.querySelector('#mix-commerce');
  if(section)return section;
  section=document.createElement('section');
  section.id='mix-commerce';
  section.className='commerce mix-commerce';
  section.hidden=true;
  section.setAttribute('aria-labelledby','mix-commerce-title');
  section.innerHTML=`<div class="commerce-head"><div><p class="eyebrow">Compra calculada</p><h2 id="mix-commerce-title">Comprar materiales para esta mezcla</h2><p>Comparamos formatos reales del mismo componente y calculamos unidades enteras, coste y sobrante. La opción recomendada busca equilibrio entre pagar menos y comprar un volumen cercano al que necesitas.</p></div></div><div class="mix-commerce-summary" data-mix-summary></div><div class="mix-commerce-products" data-mix-products></div><div class="commerce-method"><details><summary>Cómo elegimos la opción recomendada</summary><p>Cuando hay varias opciones verificadas para el mismo componente, el equilibrio es relativo a esas opciones: 55 % coste total para completar los litros + 45 % ajuste al volumen comprado. Un ajuste del 100 % significa que el formato comprado coincide exactamente con los litros necesarios. También marcamos por separado la alternativa más barata y la que deja menos sobrante. La comisión de afiliación pesa 0 %.</p></details><p class="commerce-disclosure">Precios comprobados el ${verifiedAt.split('-').reverse().join('/')}; pueden cambiar y no incluyen envío. Los enlaces son oficiales. AWIN permanece inactivo hasta disponer de enlaces de seguimiento reales. <a href="/afiliacion.html" target="_blank" rel="noopener noreferrer">Cómo funciona la afiliación</a>.</p></div>`;
  document.querySelector('.calculator')?.insertAdjacentElement('afterend',section);
  return section;
}

function badges(row,option){
  const labels=[];
  if(row.recommended?.product.id===option.product.id)labels.push('Recomendado');
  if(row.cheapest?.product.id===option.product.id)labels.push('Más barato');
  if(row.leastWaste?.product.id===option.product.id)labels.push('Menos sobrante');
  return labels.map(label=>`<span>${label}</span>`).join('');
}

function wasteWarning(purchase){
  if(!purchase?.purchased)return '';
  const share=purchase.leftover/purchase.purchased;
  if(share<.5)return '';
  return `<p class="mix-commerce-warning"><strong>Formato grande para este cálculo:</strong> sobraría aproximadamente ${pct(share*100)} de lo comprado. Si no vas a reutilizar el sobrante, revisa las alternativas o busca un formato menor.</p>`;
}

function alternative(row,option){
  const {product,purchase}=option;
  return `<article class="mix-commerce-alt"><div><div class="mix-commerce-badges">${badges(row,option)}</div><strong>${esc(product.name)}</strong><small>${esc(product.retailer)} · ${purchase.units} ${purchase.units===1?'unidad':'unidades'} · compras ${fmt(purchase.purchased,2)} L</small></div><div class="mix-commerce-alt__numbers"><span>${money(purchase.cost)}</span><small>Sobra ${fmt(purchase.leftover,2)} L${option.balanceScore!==null?` · equilibrio ${fmt(option.balanceScore,0)}/100`:''}</small></div><a class="button button--quiet" data-mix-product="${esc(product.id)}">Ver producto <span aria-hidden="true">↗</span></a></article>`;
}

function card(row){
  const {component,recommended}=row;
  if(!recommended){
    return `<article class="mix-commerce-card mix-commerce-card--unknown"><div><p class="result-label">${esc(component.name)}</p><h3>${fmt(component.litres,2)} L necesarios</h3><p>No tenemos todavía un producto verificado que coincida con este nombre. No mostramos una recomendación aproximada para evitar venderte un material distinto.</p></div></article>`;
  }
  const {product,purchase}=recommended;
  const alternatives=row.options.filter(option=>option.product.id!==product.id);
  const methodLabel=row.options.length>1?`Equilibrio ${fmt(recommended.balanceScore,0)}/100`:'Única opción exacta verificada';
  return `<article class="mix-commerce-card mix-commerce-card--recommended">
    <div class="mix-commerce-card__component"><span>${esc(component.name)}</span><strong>${fmt(component.litres,2)} L</strong><small>${fmt(component.percentage,1)} % de la mezcla</small></div>
    <div class="mix-commerce-badges">${badges(row,recommended)}</div>
    <div class="mix-commerce-card__product"><small>${esc(product.retailer)} · precio verificado ${verifiedAt.split('-').reverse().join('/')}</small><h3>${esc(product.name)}</h3><div class="commerce-features">${(product.featureLabels||[]).map(label=>`<span>${esc(label)}</span>`).join('')}</div><p class="mix-commerce-balance">${methodLabel}</p></div>
    <dl class="mix-commerce-metrics"><div><dt>Unidades</dt><dd>${purchase.units}</dd></div><div><dt>Compras</dt><dd>${fmt(purchase.purchased,2)} L</dd></div><div><dt>Sobrante</dt><dd>${fmt(purchase.leftover,2)} L</dd></div><div><dt>Coste</dt><dd>${money(purchase.cost)}</dd></div></dl>
    ${wasteWarning(purchase)}
    <a class="button button--clay mix-commerce-link" data-mix-product="${esc(product.id)}">Ver producto en ${esc(product.retailer)} <span aria-hidden="true">↗</span></a>
    ${alternatives.length?`<details class="mix-commerce-alternatives"><summary>Ver ${alternatives.length} ${alternatives.length===1?'alternativa':'alternativas'}</summary><div>${alternatives.map(option=>alternative(row,option)).join('')}</div></details>`:''}
  </article>`;
}

function attachLinks(section,rows){
  section.querySelectorAll('[data-mix-product]').forEach(anchor=>{
    const product=mixProducts.find(item=>item.id===anchor.dataset.mixProduct);
    if(!product)return;
    engine.decorateLink(anchor,product);
    anchor.addEventListener('click',()=>{
      const row=rows.find(item=>item.options.some(option=>option.product.id===product.id));
      const option=row?.options.find(item=>item.product.id===product.id);
      engine.track('mix_product_open',product,{component:row?.component?.name||null,required_litres:row?.component?.litres||null,units:option?.purchase?.units||null,project_cost:option?.purchase?.cost||null,recommended:row?.recommended?.product.id===product.id});
    });
  });
}

function render(result,{scroll=false}={}){
  if(!result||!Array.isArray(result.components))return;
  latestResult=result;
  ensureStyles();
  const section=ensureSection();
  const rows=buildMixShopping(result,mixProducts,{economyWeight:.55,fitWeight:.45});
  latestRows=rows;
  const known=rows.filter(row=>row.recommended);
  const totalCost=known.reduce((sum,row)=>sum+row.recommended.purchase.cost,0);
  const totalPurchased=known.reduce((sum,row)=>sum+row.recommended.purchase.purchased,0);
  const totalRequired=known.reduce((sum,row)=>sum+row.component.litres,0);
  const unmatched=rows.length-known.length;
  section.querySelector('[data-mix-summary]').innerHTML=`<div><span>Volumen de la mezcla</span><strong>${fmt(result.total,2)} L</strong></div><div><span>Componentes con producto verificado</span><strong>${known.length}/${rows.length}</strong></div><div><span>Compra recomendada</span><strong>${known.length?money(totalCost):'—'}</strong></div><div><span>Sobrante total estimado</span><strong>${known.length?`${fmt(totalPurchased-totalRequired,2)} L`:'—'}</strong></div>${unmatched?`<p>${unmatched===1?'Hay 1 componente sin':'Hay '+unmatched+' componentes sin'} producto verificado. El coste total mostrado solo suma los productos encontrados.</p>`:''}`;
  section.querySelector('[data-mix-products]').innerHTML=rows.map(card).join('');
  attachLinks(section,rows);
  section.hidden=false;
  if(scroll)section.scrollIntoView({behavior:'smooth',block:'start'});
}

document.addEventListener('tierra:mix-result',event=>render(event.detail));
document.addEventListener('click',event=>{
  const trigger=event.target.closest('[data-view-mix-products]');
  if(!trigger)return;
  event.preventDefault();
  if(latestResult)render(latestResult,{scroll:true});
  else document.querySelector('#mix-form')?.scrollIntoView({behavior:'smooth',block:'start'});
});

try{
  const saved=JSON.parse(localStorage.getItem('te:v1:last-result')||'null');
  if(saved?.type==='mix'&&Array.isArray(saved.components))render(saved);
}catch{}
