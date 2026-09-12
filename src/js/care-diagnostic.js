import { diagnosePlant } from './math/plant-care.js';
import { substrateProducts, verifiedAt } from './products/substrate-products.js';

const euro = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });
const number = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 2 });

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
else init();

function init() {
  setupDiagnostic();
  document.querySelectorAll('[data-care-products]').forEach((target) => renderProducts(target, target.dataset.careProducts));
}

function setupDiagnostic() {
  const form = document.querySelector('[data-plant-diagnostic]');
  const output = document.querySelector('[data-plant-diagnostic-result]');
  if (!form || !output) return;

  const run = (event) => {
    event?.preventDefault();
    const data = new FormData(form);
    const findings = diagnosePlant({
      symptom: data.get('symptom'),
      moisture: data.get('moisture'),
      drainage: data.get('drainage'),
      recentRepot: data.get('recentRepot') === 'yes',
      rootsVisible: data.get('rootsVisible') === 'yes',
      recentMove: data.get('recentMove') === 'yes'
    });
    output.innerHTML = `<div class="care-results-head"><p class="eyebrow">Por dónde empezaría</p><h2>${findings[0].title}</h2><p>Esto no identifica una enfermedad ni sustituye conocer la especie. Ordena comprobaciones a partir de los síntomas y condiciones que has indicado.</p></div>${findings.map((item, index) => findingCard(item, index)).join('')}<div class="care-result-products" data-diagnostic-products></div>`;
    const intent = findings.find((item) => item.productIntent)?.productIntent;
    const products = output.querySelector('[data-diagnostic-products]');
    if (products && intent) renderProducts(products, intent);
    output.hidden = false;
    output.focus();
  };

  form.addEventListener('submit', run);
  form.addEventListener('reset', () => {
    output.hidden = true;
    output.replaceChildren();
  });
}

function findingCard(item, index) {
  return `<article class="care-finding${index === 0 ? ' care-finding--primary' : ''}"><p class="care-finding-number">${String(index + 1).padStart(2, '0')}</p><div><h3>${item.title}</h3><p>${item.summary}</p><h4>Qué comprobar</h4><ul>${item.actions.map((action) => `<li>${action}</li>`).join('')}</ul></div></article>`;
}

function renderProducts(target, intent) {
  const products = selectProducts(intent);
  if (!products.length) {
    target.hidden = true;
    return;
  }
  const label = intent === 'drainage' ? 'Sustratos con aireación o drenaje declarados' : intent === 'water-management' ? 'Sustratos con gestión de agua declarada' : 'Sustratos universales para un posible trasplante';
  target.innerHTML = `<section class="care-products"><div class="care-products-head"><div><p class="eyebrow">Solo si vas a renovar el sustrato</p><h2>${label}</h2><p>Estos productos se muestran porque su ficha declara la característica indicada. Están ordenados por precio por litro dentro de este filtro, no por comisión. Antes de comprar, confirma que el sustrato es adecuado para tu especie.</p></div><a href="/tierra-exacta/sacos-sustrato/">Comparar por litros y coste total →</a></div><div class="care-product-grid">${products.map(productCard).join('')}</div><p class="care-products-note">Datos del catálogo verificados el ${verifiedAt.split('-').reverse().join('/')}. Los precios y fichas pueden cambiar. Si un enlace de afiliación se activa en el futuro, la comisión no alterará este orden.</p></section>`;
  target.hidden = false;
}

function selectProducts(intent) {
  let matches = substrateProducts.filter((product) => {
    if (intent === 'drainage') return product.specs.aeration === true;
    if (intent === 'water-management') return product.specs.waterManagement === true;
    if (intent === 'repot') return product.specs.universal === true;
    return false;
  });
  return matches
    .map((product) => ({ ...product, unitPrice: product.price / product.size }))
    .sort((a, b) => a.unitPrice - b.unitPrice || a.price - b.price)
    .slice(0, 4);
}

function productCard(product) {
  const affiliate = Boolean(product.affiliate?.enabled && product.affiliate?.url);
  const href = affiliate ? product.affiliate.url : product.normalUrl;
  const rel = affiliate ? 'sponsored noopener noreferrer' : 'noopener noreferrer';
  const badges = product.featureLabels.slice(0, 3).map((label) => `<span>${label}</span>`).join('');
  return `<article class="care-product"><p class="care-product-retailer">${product.retailer}</p><h3>${product.name}</h3><div class="care-product-badges">${badges}</div><p class="care-product-price"><strong>${euro.format(product.price)}</strong><span>${number.format(product.price / product.size)} €/L</span></p><a class="button button--clay" href="${href}" target="_blank" rel="${rel}" data-care-product="${product.id}">Ver producto <span aria-hidden="true">↗</span></a></article>`;
}
