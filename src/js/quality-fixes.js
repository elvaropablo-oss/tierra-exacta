const style=document.createElement('style');
style.textContent=`
.input-row input:focus-visible,.input-row select:focus-visible,.input-row textarea:focus-visible{outline:none!important;box-shadow:none!important}
.input-row:focus-within{outline:2px solid currentColor!important;outline-offset:2px;box-shadow:none!important}
footer .analytics-consent__settings{color:inherit!important}
.project-library-launcher{transition:bottom .16s ease}
.hero-copy>.eyebrow,.field-note .eyebrow{color:#a53c28!important}
.tool-index .eyebrow{color:#f4d2bd!important}
.commerce-entry{max-width:1120px;margin:-18px auto 72px;padding:0 24px}
.commerce-entry__box{display:grid;grid-template-columns:1fr auto;gap:28px;align-items:center;padding:28px;background:var(--forest);color:var(--white);border:1px solid var(--forest-dark);box-shadow:8px 8px 0 var(--sun)}
.commerce-entry__box .eyebrow{color:var(--sun)!important;margin-bottom:8px}
.commerce-entry__box h2{font-size:clamp(30px,4vw,48px);margin:0 0 10px}
.commerce-entry__box p{margin:0;max-width:720px;color:#d7e2dc}
.commerce-entry__box .button{min-width:245px;background:var(--clay);border-color:var(--clay)}
@media(max-width:760px){.commerce-entry__box{grid-template-columns:1fr}.commerce-entry__box .button{width:100%;min-width:0}.commerce-entry{margin-top:0}}
`;
document.head.appendChild(style);

function keepLauncherClear(){
  const b=document.querySelector('.project-library-launcher');
  if(!b)return;
  const f=document.querySelector('footer');
  if(!f){b.style.bottom='1rem';return;}
  const overlap=Math.max(0,innerHeight-f.getBoundingClientRect().top);
  const max=Math.max(16,innerHeight-b.offsetHeight-24);
  b.style.bottom=`${Math.min(16+overlap,max)}px`;
}

function addPortfolioHubLink(){
  const f=document.querySelector('footer');
  if(!f||f.querySelector('[data-portfolio-hub]'))return;
  const host=f.querySelector('nav')||f;
  const a=document.createElement('a');
  a.href='https://elvaropablo-oss.github.io/';
  a.textContent='Todas las herramientas';
  a.dataset.portfolioHub='';
  a.setAttribute('aria-label','Ver todas las herramientas de la colección');
  host.appendChild(a);
}

function addCommerceEntry(){
  if(!(document.body.classList.contains('page-inicio')||document.body.classList.contains('page-herramientas')))return;
  if(document.querySelector('[data-commerce-entry]'))return;
  const hero=document.querySelector('.hero');
  if(!hero)return;
  const section=document.createElement('section');
  section.className='commerce-entry';
  section.dataset.commerceEntry='';
  section.innerHTML=`<div class="commerce-entry__box"><div><p class="eyebrow">Nuevo · comparador real</p><h2>Compara sustratos por coste, sobrante y calidad-precio</h2><p>Introduce los litros que necesitas y TierraExacta calcula cuántos sacos comprar de productos reales de Leroy Merlin, BAUHAUS y ManoMano, con enlace directo a la tienda.</p></div><a class="button button--clay" href="/tierra-exacta/sacos-sustrato/">Abrir comparador de sustratos <span aria-hidden="true">↗</span></a></div>`;
  hero.insertAdjacentElement('afterend',section);
}

function loadMonetization(){
  if(document.querySelector('script[src*="/assets/monetization.js"]'))return;
  const s=document.createElement('script');
  s.src='/assets/monetization.js?v=20260912-1';
  s.defer=true;
  document.head.appendChild(s);
}

function loadSubstrateCommerce(){
  if(!document.querySelector('#bags-form'))return;
  const start=()=>import('./substrate-commerce.js?v=20260912-3').catch(error=>console.error('No se pudo cargar el comparador de sustratos',error));
  if(window.CommerceEngine){start();return;}
  const existing=document.querySelector('script[src*="/assets/commerce-engine.js"]');
  if(existing){existing.addEventListener('load',start,{once:true});return;}
  const s=document.createElement('script');
  s.src='/assets/commerce-engine.js?v=20260912-1';
  s.onload=start;
  s.onerror=()=>console.error('No se pudo cargar CommerceEngine');
  s.defer=true;
  document.head.appendChild(s);
}

addEventListener('scroll',keepLauncherClear,{passive:true});
addEventListener('resize',keepLauncherClear);
new MutationObserver(keepLauncherClear).observe(document.body,{childList:true,subtree:true});
addPortfolioHubLink();
addCommerceEntry();
keepLauncherClear();
loadMonetization();
loadSubstrateCommerce();