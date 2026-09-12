import { rectangularContainer, roundContainer, substrateBags, substrateMix } from './math/soil.js';

const fmt = (value, digits = 1) => new Intl.NumberFormat('es-ES', { maximumFractionDigits: digits }).format(value);
const get = (form, name) => form.elements.namedItem(name).value;
const clear = (form) => { const error = form.querySelector('[data-error]'); if (error) error.hidden = true; };
const fail = (form, reason) => { const error = form.querySelector('[data-error]'); error.textContent = reason.message; error.hidden = false; error.focus(); };
const reveal = (selector, html) => { const result = document.querySelector(selector); result.innerHTML = html; result.hidden = false; result.focus(); };
const save = (value) => { try { localStorage.setItem('te:v1:last-result', JSON.stringify(value)); } catch {} };
const litreLink = (litres) => `../sacos-sustrato/?litros=${encodeURIComponent(litres.toFixed(2))}`;
const mixLink = (litres) => `../mezcla-sustrato/?litros=${encodeURIComponent(litres.toFixed(2))}`;

const roundForm = document.querySelector('#round-form');
if (roundForm) {
  const shape = roundForm.elements.shape;
  const bottom = roundForm.querySelector('[data-bottom]');
  const syncShape = () => { bottom.hidden = shape.value === 'cylinder'; bottom.querySelector('input').required = !bottom.hidden; };
  shape.addEventListener('change', syncShape);
  syncShape();
  roundForm.addEventListener('submit', (event) => {
    event.preventDefault(); clear(roundForm);
    try {
      const result = roundContainer(Object.fromEntries(['shape', 'topDiameter', 'bottomDiameter', 'height', 'freeboard', 'count', 'deductions'].map((name) => [name, get(roundForm, name)])));
      reveal('#round-result', `<p class="result-label">Sustrato calculado</p><h2>${fmt(result.total, 2)} litros</h2><div class="soil-meter"><span style="--fill:${Math.min(100, result.total)}%"></span></div><dl><div><dt>Por maceta</dt><dd>${fmt(result.each, 2)} L</dd></div><div><dt>Altura llena</dt><dd>${fmt(result.usableHeight, 1)} cm</dd></div><div><dt>Volumen antes de deducir</dt><dd>${fmt(result.grossEach, 2)} L</dd></div></dl><div class="result-actions"><a class="button button--clay" href="${litreLink(result.total)}">Calcular sacos para este volumen</a><a class="button" href="${mixLink(result.total)}">Preparar una mezcla para este volumen</a></div><p class="fineprint">Resultado geométrico con las deducciones indicadas. La compactación real puede variar.</p>`);
      save({ type: 'round', ...result, savedAt: new Date().toISOString() });
    } catch (reason) { fail(roundForm, reason); }
  });
}

document.querySelector('#bed-form')?.addEventListener('submit', (event) => {
  event.preventDefault(); const form = event.currentTarget; clear(form);
  try {
    const result = rectangularContainer(Object.fromEntries(['length', 'width', 'height', 'freeboard', 'count', 'deductions'].map((name) => [name, get(form, name)])));
    reveal('#bed-result', `<p class="result-label">Tierra necesaria</p><h2>${fmt(result.total, 2)} litros</h2><p class="result-equivalent">Equivale a <strong>${fmt(result.total / 1000, 3)} m³</strong></p><dl><div><dt>Por jardinera</dt><dd>${fmt(result.each, 2)} L</dd></div><div><dt>Altura llena</dt><dd>${fmt(result.usableHeight, 1)} cm</dd></div><div><dt>Deducciones totales</dt><dd>${fmt(result.deductionEach * result.count, 2)} L</dd></div></dl><div class="result-actions"><a class="button button--clay" href="${litreLink(result.total)}">Convertir en sacos</a><a class="button" href="${mixLink(result.total)}">Preparar mezcla para este volumen</a></div><p class="fineprint">Usa medidas interiores. Las paredes, patas y depósitos integrados reducen el hueco real.</p>`);
    save({ type: 'bed', ...result, savedAt: new Date().toISOString() });
  } catch (reason) { fail(form, reason); }
});

const bagsForm = document.querySelector('#bags-form');
if (bagsForm) {
  const litres = new URLSearchParams(location.search).get('litros');
  if (litres) bagsForm.elements.requiredLitres.value = litres;
  bagsForm.addEventListener('submit', (event) => {
    event.preventDefault(); clear(bagsForm);
    try {
      const result = substrateBags(Object.fromEntries(['requiredLitres', 'reserve', 'bagSize', 'price'].map((name) => [name, get(bagsForm, name)])));
      reveal('#bags-result', `<p class="result-label">Compra recomendada</p><h2>${result.bags} ${result.bags === 1 ? 'saco' : 'sacos'} de ${fmt(result.bagSize, 2)} L</h2><div class="bag-row" aria-hidden="true">${Array.from({ length: Math.min(result.bags, 8) }, () => '<span>S</span>').join('')}${result.bags > 8 ? `<b>+${result.bags - 8}</b>` : ''}</div><dl><div><dt>Objetivo con margen</dt><dd>${fmt(result.target, 2)} L</dd></div><div><dt>Volumen comprado</dt><dd>${fmt(result.purchased, 2)} L</dd></div><div><dt>Sobrante estimado</dt><dd>${fmt(result.leftover, 2)} L</dd></div>${result.cost ? `<div><dt>Coste total</dt><dd>${fmt(result.cost, 2)} €</dd></div>` : ''}</dl><div class="result-actions"><a class="button button--clay" href="#substrate-commerce" data-compare-substrates>Comparar sustratos reales <span aria-hidden="true">↓</span></a><a class="button button--quiet" href="${mixLink(result.target)}">Repartir este objetivo en una mezcla</a></div><p class="fineprint">Los sacos se redondean siempre hacia arriba. El volumen declarado puede asentarse al abrir y regar.</p>`);
      save({ type: 'bags', ...result, savedAt: new Date().toISOString() });
    } catch (reason) { fail(bagsForm, reason); }
  });
}

const mixForm = document.querySelector('#mix-form');
if (mixForm) {
  const litres = new URLSearchParams(location.search).get('litros');
  if (litres) mixForm.elements.totalLitres.value = litres;
  mixForm.addEventListener('submit', (event) => {
    event.preventDefault(); const form = event.currentTarget; clear(form);
    try {
      const components = [1, 2, 3].map((index) => ({ name: get(form, `name${index}`), percentage: get(form, `percentage${index}`) }));
      const result = substrateMix({ totalLitres: get(form, 'totalLitres'), components });
      reveal('#mix-result', `<p class="result-label">Mezcla para ${fmt(result.total, 2)} litros</p><h2>Reparto exacto</h2><ol class="mix-list">${result.components.map((component) => `<li><span>${component.name}<small>${fmt(component.percentage, 1)} %</small></span><strong>${fmt(component.litres, 2)} L</strong></li>`).join('')}</ol><p class="fineprint">La herramienta reparte volumen. Ajusta la receta a la planta y al producto que vayas a usar.</p>`);
      save({ type: 'mix', ...result, savedAt: new Date().toISOString() });
    } catch (reason) { fail(form, reason); }
  });
}

document.querySelector('[data-menu]')?.addEventListener('click', (event) => {
  const nav = document.querySelector('#site-nav');
  const open = event.currentTarget.getAttribute('aria-expanded') === 'true';
  event.currentTarget.setAttribute('aria-expanded', String(!open));
  nav.dataset.open = String(!open);
});
