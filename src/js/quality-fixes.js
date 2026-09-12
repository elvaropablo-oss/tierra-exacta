const style=document.createElement('style');
style.textContent=`
.input-row input:focus-visible,.input-row select:focus-visible,.input-row textarea:focus-visible{outline:none!important;box-shadow:none!important}
.input-row:focus-within{outline:2px solid currentColor!important;outline-offset:2px;box-shadow:none!important}
footer .analytics-consent__settings{color:inherit!important}
.project-library-launcher{transition:bottom .16s ease}
.hero-copy>.eyebrow,.field-note .eyebrow{color:#a53c28!important}
.tool-index .eyebrow{color:#f4d2bd!important}
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

function loadMonetization(){
  if(document.querySelector('script[src*="/assets/monetization.js"]'))return;
  const s=document.createElement('script');
  s.src='/assets/monetization.js?v=20260912-2';
  s.defer=true;
  document.head.appendChild(s);
}

function setCommerceStatus(message,{error=false,hidden=false}={}){
  const status=document.querySelector('[data-commerce-status]');
  if(!status)return;
  status.hidden=hidden;
  if(message)status.textContent=message;
  if(error)status.dataset.error='true';else delete status.dataset.error;
}

function withCommerceEngine(start,onError){
  if(window.CommerceEngine){start();return;}
  const existing=document.querySelector('script[src*="/assets/commerce-engine.js"]');
  if(existing){
    existing.addEventListener('load',start,{once:true});
    existing.addEventListener('error',onError,{once:true});
    return;
  }
  const s=document.createElement('script');
  s.src='/assets/commerce-engine.js?v=20260912-1';
  s.onload=start;
  s.onerror=onError;
  s.defer=true;
  document.head.appendChild(s);
}

function loadSubstrateCommerce(){
  if(!document.querySelector('#bags-form'))return;
  setCommerceStatus('Cargando catálogo y comparador…');
  const start=()=>import('./substrate-commerce.js?v=20260912-4')
    .then(()=>setCommerceStatus('',{hidden:true}))
    .catch(error=>{
      console.error('No se pudo cargar el comparador de sustratos',error);
      setCommerceStatus('No se pudo cargar el comparador. Recarga la página; la calculadora de sacos sigue funcionando.',{error:true});
    });
  withCommerceEngine(start,()=>{
    console.error('No se pudo cargar CommerceEngine');
    setCommerceStatus('No se pudo cargar el motor de comparación. Recarga la página.',{error:true});
  });
}

function loadMixCommerce(){
  if(!document.querySelector('#mix-form'))return;
  const start=()=>import('./mix-commerce.js?v=20260912-1').catch(error=>console.error('No se pudo cargar la compra calculada de la mezcla',error));
  withCommerceEngine(start,()=>console.error('No se pudo cargar CommerceEngine para la mezcla'));
}

addEventListener('scroll',keepLauncherClear,{passive:true});
addEventListener('resize',keepLauncherClear);
new MutationObserver(keepLauncherClear).observe(document.body,{childList:true,subtree:true});
addPortfolioHubLink();
keepLauncherClear();
loadMonetization();
loadSubstrateCommerce();
loadMixCommerce();
