import { site } from '../../site.config.mjs';

const base = site.basePath;
const clean = (value = '') => value.replace(/^\/+|\/+$/g, '');
const active = (current, target) => clean(current) === clean(target) || clean(current).startsWith(`${clean(target)}/`);

export function button(path, label, quiet = false) {
  return `<a class="button${quiet ? ' button--quiet' : ''}" href="${base}${path}">${label}<span aria-hidden="true">↗</span></a>`;
}

export function breadcrumbs(items) {
  return `<nav class="breadcrumbs" aria-label="Migas de pan">${items.map((item, index) => index === items.length - 1 ? `<span aria-current="page">${item.label}</span>` : `<a href="${base}${item.path}">${item.label}</a>`).join('<i aria-hidden="true">/</i>')}</nav>`;
}

export function hero(kicker, title, intro, actions = '', diagram = true) {
  return `<section class="hero"><div class="hero-copy"><p class="eyebrow">${kicker}</p><h1>${title}</h1><p class="lead">${intro}</p>${actions ? `<div class="actions">${actions}</div>` : ''}</div>${diagram ? `<div class="pot-plan" aria-hidden="true"><div class="measure measure--top"><span>Ø 40</span></div><div class="pot"><div class="soil"><i></i><i></i><i></i></div></div><div class="measure measure--side"><span>30 cm</span></div><b>28,8 L</b><small>VISTA INTERIOR · 01</small></div>` : ''}</section>`;
}

export function renderPage(page) {
  const canonical = `${site.origin}${base}${page.path ? `${page.path}/` : ''}`;
  const schema = JSON.stringify(page.schema || {
    '@context': 'https://schema.org', '@type': page.tool ? 'WebApplication' : 'WebPage',
    name: page.h1, url: canonical, description: page.description, inLanguage: 'es-ES',
    ...(page.tool ? { applicationCategory: 'UtilitiesApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' } } : {})
  }).replace(/</g, '\\u003c');
  const nav = (path, label) => `<a href="${base}${path}"${active(page.path, path) ? ' aria-current="page"' : ''}>${label}</a>`;
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${page.title}</title>
  <meta name="description" content="${page.description}">
  ${page.noindex ? '<meta name="robots" content="noindex,follow">' : ''}
  <link rel="canonical" href="${canonical}">
  <link rel="icon" href="${base}assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="${base}assets/site.css">
  <script type="application/ld+json">${schema}</script>
  <script type="module" src="${base}assets/app.js"></script>
  <script type="module" src="${base}assets/visuals.js"></script>
  <script type="module" src="${base}assets/quality-fixes.js"></script>
</head>
<body class="page-${clean(page.path).replaceAll('/', '-') || 'inicio'}${page.tool ? ' page-tool' : ''}">
  <a class="skip-link" href="#contenido">Saltar al contenido</a>
  <header class="site-header"><a class="brand" href="${base}" aria-label="TierraExacta, inicio"><svg viewBox="0 0 44 44" aria-hidden="true"><path d="M8 9h28l-4 27H12z"/><path d="M5 9h34M14 21c5-5 11-6 18-5M12 29c8-4 14-4 21-3"/></svg><span>Tierra<strong>Exacta</strong></span></a><button class="menu" type="button" data-menu aria-controls="site-nav" aria-expanded="false">Menú</button><nav id="site-nav" aria-label="Principal">${nav('herramientas/', 'Herramientas')}${nav('guias/medir-maceta/', 'Cómo medir')}${nav('metodologia/', 'Fórmulas')}</nav></header>
  <main id="contenido">${page.content}</main>
  <footer><div><a class="footer-brand" href="${base}">TierraExacta</a><p>Calcula primero. Compra solo la tierra que necesitas.</p></div><nav aria-label="Información"><a href="${base}preguntas-frecuentes/">Preguntas</a><a href="${base}sobre/">Sobre</a><a href="${base}privacidad/">Privacidad</a></nav><p class="footer-note">Las cifras son una estimación geométrica. Comprueba siempre las medidas interiores.</p></footer>
</body>
</html>`;
}
