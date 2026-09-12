import { mixProducts, verifiedAt } from './products/mix-products.js';
import { matchMixProduct } from './math/mix-shopping.js';

const engine=window.CommerceEngine;
const form=document.querySelector('#mix-form');
if(!engine||!form)throw new Error('CommerceEngine o formulario de mezcla no disponible');

const money=value=>new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR',maximumFractionDigits:2}).format(value);
const fmt=(value,digits=2)=>new Intl.NumberFormat('es-ES',{maximumFractionDigits:digits}).format(value);
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
let latestResult=null;

function ensureStyles(){
  if(document.querySelector('link[data-mix-commerce-style]'))return;
  const link=document.createElement('link');
  link.rel='stylesheet';
  link.href='/tierra-exacta/assets/commerce.css?v=20260912-5';
  link.dataset.mixCommerceStyle='';
  document.head.appendChild(link);
}

function ensureSection(){
  let section=document.querySelector('#mix-commerce');
  if(section)return section;
  section=document.createElement('section');
  section.id='mix-commerce';
  section.className='commerce mix-commerce';
  section.hidden=true;
  section.setAttribute('aria-labelledby','mix-commerce-title');
  section.innerHTML=`<div class="commerce-head"><div><p class="eyebrow">Compra calculada</p><h2 id="mix-commerce-title">Comprar materiales para esta mezcla</h2><p>Convertimos los litros de cada componente en formatos comerciales completos. Así ves cuántas unidades comprar, cuánto sobra y el coste estimado antes de abrir la tienda.</p></div></div><div class="mix-commerce-summary" data-mix-summary></div><div class="mix-commerce-products" data-mix-products></div><div class="commerce-method"><p class="commerce-disclosure">Precios comprobados el ${verifiedAt.split('-').reverse().join('/')}; pueden cambiar y no incluyen envío. Los enlaces son oficiales. Si más adelante se activa afiliación AWIN con enlaces reales, la comisión no cambiará qué producto se recomienda ni las cantidades calculadas. <a href="/afiliacion.html" target="_blank" rel="noopener noreferrer">Cómo funciona la afiliación</a>.</p></div>`;
  document.querySelector('.calculator')?.insertAdjacentElement('afterend',section);
  return section;
}

function card(component,product,purchase){
  if(!product||!purchase){
    return `<article class="mix-commerce-card mix-commerce-card--unknown"><div><p class="result-label">${esc(component.name)}</p><h3>${fmt(component.litres,2)} L necesarios</h3><p>No tenemos todavía un producto verificado que coincida con este nombre. No mostramos una recomendación aproximada para evitar venderte un material distinto.</p></div></article>`;
  }
  return `<article class="mix-commerce-card">
    <div class="mix-commerce-card__component"><span>${esc(component.name)}</span><strong>${fmt(component.litres,2)} L</strong><small>${fmt(component.percentage,1)} % de la mezcla</small></div>
    <div class="mix-commerce-card__product"><small>${esc(product.retailer)} · precio verificado ${verifiedAt.split('-').reverse().join('/')}</small><h3>${esc(product.name)}</h3><div class="commerce-features">${(product.featureLabels||[]).map(label=>`<span>${esc(label)}</span>`).join('')}</div></div>
    <dl class="mix-commerce-metrics"><div><dt>Unidades</dt><dd>${purchase.units}</dd></div><div><dt>Compras</dt><dd>${fmt(purchase.purchased,2)} L</dd></div><div><dt>Sobrante</dt><dd>${fmt(purchase.waste,2)} L</dd></div><div><dt>Coste</dt><dd>${money(purchase.projectCost)}</dd></div></dl>
    <a class="button button--clay mix-commerce-link" data-mix-product="${esc(product.id)}">Ver producto en ${esc(product.retailer)} <span aria-hidden="true">↗</span></a>
  </article>`;
}

function render(result,{scroll=false}={}){
  if(!result||!Array.isArray(result.components))return;
  latestResult=result;
  ensureStyles();
  const section=ensureSection();
  const rows=result.components.map(component=>{
    const product=matchMixProduct(component.name,mixProducts);
    const purchase=product?engine.pack(component.litres,product):null;
    return {component,product,purchase};
  });
  const known=rows.filter(row=>row.product&&row.purchase);
  const totalCost=known.reduce((sum,row)=>sum+row.purchase.projectCost,0);
  const totalPurchased=known.reduce((sum,row)=>sum+row.purchase.purchased,0);
  const totalRequired=known.reduce((sum,row)=>sum+row.component.litres,0);
  const unmatched=rows.length-known.length;
  section.querySelector('[data-mix-summary]').innerHTML=`<div><span>Volumen de la mezcla</span><strong>${fmt(result.total,2)} L</strong></div><div><span>Componentes con producto verificado</span><strong>${known.length}/${rows.length}</strong></div><div><span>Compra calculada</span><strong>${known.length?money(totalCost):'—'}</strong></div><div><span>Sobrante de productos encontrados</span><strong>${known.length?`${fmt(totalPurchased-totalRequired,2)} L`:'—'}</strong></div>${unmatched?`<p>${unmatched===1?'Hay 1 componente sin':'Hay '+unmatched+' componentes sin'} producto verificado. El coste total mostrado solo suma los productos encontrados.</p>`:''}`;
  section.querySelector('[data-mix-products]').innerHTML=rows.map(row=>card(row.component,row.product,row.purchase)).join('');
  section.querySelectorAll('[data-mix-product]').forEach(anchor=>{
    const product=mixProducts.find(item=>item.id===anchor.dataset.mixProduct);
    if(!product)return;
    engine.decorateLink(anchor,product);
    anchor.addEventListener('click',()=>{
      const row=rows.find(item=>item.product?.id===product.id);
      engine.track('mix_product_open',product,{component:row?.component?.name||null,required_litres:row?.component?.litres||null,units:row?.purchase?.units||null,project_cost:row?.purchase?.projectCost||null});
    });
  });
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
