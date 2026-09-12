import { site } from '../../site.config.mjs';

const base = site.basePath;
const clean = (value = '') => value.replace(/^\/+|\/+$/g, '');
const active = (current, target) => clean(current) === clean(target) || clean(current).startsWith(`${clean(target)}/`);
const assetVersion = '20260912-9';

export function button(path, label, quiet = false) {
  return `<a class="button${quiet ? ' button--quiet' : ''}" href="${base}${path}">${label}<span aria-hidden="true">↗</span></a>`;
}

export function breadcrumbs(items) {
  return `<nav class="breadcrumbs" aria-label="Migas de pan">${items.map((item, index) => index === items.length - 1 ? `<span aria-current="page">${item.label}</span>` : `<a href="${base}${item.path}">${item.label}</a>`).join('<i aria-hidden="true">/</i>')}</nav>`;
}

export function hero(kicker, title, intro, actions = '', diagram = true) {
  return `<section class="hero"><div class="hero-copy"><p class="eyebrow">${kicker}</p><h1>${title}</h1><p class="lead">${intro}</p>${actions ? `<div class="actions">${actions}</div>` : ''}</div>${diagram ? `<div class="pot-plan" aria-hidden="true"><div class="measure measure--top"><span>Ø 40</span></div><div class="pot"><div class="soil"><i></i><i></i><i></i></div></div><div class="measure measure--side"><span>30 cm</span></div><b>28,8 L</b><small>VISTA INTERIOR · 01</small></div>` : ''}</section>`;
}

function commerceEntry() {
  return `<section class="commerce-entry" data-commerce-entry><div class="commerce-entry__box"><div><p class="eyebrow">Comparador de productos reales</p><h2>Compra el sustrato que encaja con tus litros</h2><p>Compara productos reales de Leroy Merlin, BAUHAUS y ManoMano por sacos necesarios, coste total, sobrante e índice calidad-precio. Los enlaces llevan a la ficha actual de cada tienda.</p></div><a class="button button--clay" href="${base}sacos-sustrato/">Abrir comparador de sustratos <span aria-hidden="true">↗</span></a></div></section>`;
}

function careEntry() {
  return `<section class="commerce-entry care-entry" data-care-entry><div class="commerce-entry__box"><div><p class="eyebrow">Nuevo · cuidados y diagnóstico</p><h2>¿Tu planta está mustia, amarilla o no drena bien?</h2><p>Antes de comprar nada, revisa humedad, drenaje, raíces y cambios recientes. TierraExacta ordena qué comprobar y solo muestra productos cuando pueden encajar con una necesidad concreta de sustrato.</p></div><a class="button" href="${base}cuidados/">Abrir cuidados de plantas <span aria-hidden="true">↗</span></a></div></section>`;
}

function commercePrelude() {
  return `<section class="commerce-prelude" data-commerce-prelude><div class="commerce-prelude__box"><div><p class="eyebrow">Compra comparada</p><h2>Productos reales para el volumen que necesitas</h2><p>El comparador usa el volumen y el margen del formulario para calcular cuántos sacos completos comprar de cada producto y cuánto sobra.</p><p class="commerce-prelude__status" data-commerce-status>El comparador se carga automáticamente con los valores actuales.</p><noscript><p class="commerce-prelude__status" data-error="true">Activa JavaScript para calcular la comparación de productos. La calculadora geométrica seguirá disponible.</p></noscript></div><a class="button button--clay" href="#substrate-commerce">Ver productos recomendados <span aria-hidden="true">↓</span></a></div></section>`;
}

function commerceMethodology() {
  return `<section class="commerce-methodology"><p class="eyebrow">Comparador comercial</p><h2>Cómo se calcula la calidad-precio</h2><p>Primero calculamos el número entero de sacos necesario para completar tu volumen con margen. La puntuación económica usa el coste total real del proyecto, no solo el precio por litro. El índice técnico utiliza únicamente características publicadas por la tienda o el fabricante. Si faltan datos suficientes, no se publica una nota de calidad-precio.</p><div class="commerce-methodology-grid"><article><strong>55 %</strong><span>Economía: coste real para completar tu volumen.</span></article><article><strong>45 %</strong><span>Índice técnico: características documentadas y comparables.</span></article><article><strong>0 %</strong><span>Comisión de afiliación: nunca interviene en el ranking.</span></article></div></section>`;
}

export function renderPage(page) {
  const canonical = `${site.origin}${base}${page.path ? `${page.path}/` : ''}`;
  const schema = JSON.stringify(page.schema || {
    '@context': 'https://schema.org', '@type': page.tool ? 'WebApplication' : 'WebPage',
    name: page.h1, url: canonical, description: page.description, inLanguage: 'es-ES',
    ...(page.tool ? { applicationCategory: 'UtilitiesApplication', operatingSystem: 'Any', isAccessibleForFree: true, browserRequirements: 'Navegador web moderno con JavaScript', offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' } } : {})
  }).replace(/</g, '\\u003c');
  const breadcrumbSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${site.origin}${base}` },
      ...(page.path ? [{ '@type': 'ListItem', position: 2, name: page.h1, item: canonical }] : [])
    ]
  }).replace(/</g, '\\u003c');
  const nav = (path, label) => `<a href="${base}${path}"${active(page.path, path) ? ' aria-current="page"' : ''}>${label}</a>`;
  let content = page.content;
  if (page.path === '' || page.path === 'herramientas') content = content.replace('</section>', `</section>${commerceEntry()}${careEntry()}`);
  if (page.path === 'sacos-sustrato') content = content.replace('<section class="calculator">', `${commercePrelude()}<section class="calculator">`);
  if (page.path === 'metodologia') content += commerceMethodology();
  if (page.path === 'privacidad') content = content.replace('Google Analytics está pendiente de configurarse con un identificador propio para esta web.','Google Analytics solo se carga después de que aceptes la analítica mediante el control de consentimiento. Si no aceptas, la etiqueta de medición no se carga. Las medidas introducidas en las calculadoras se procesan localmente.');
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${page.title}</title>
  <meta name="description" content="${page.description}">
  <meta name="robots" content="${page.noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large'}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:locale" content="es_ES">
  <meta property="og:site_name" content="${site.name}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${page.title}">
  <meta property="og:description" content="${page.description}">
  <meta property="og:url" content="${canonical}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${page.title}">
  <meta name="twitter:description" content="${page.description}">
  <link rel="icon" href="${base}assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="${base}assets/site.css?v=${assetVersion}">
  <link rel="stylesheet" href="${base}assets/commerce-entry.css?v=${assetVersion}">
  <link rel="stylesheet" href="${base}assets/care.css?v=${assetVersion}">
  <script type="application/ld+json">${schema}</script>
  <script type="application/ld+json">${breadcrumbSchema}</script>
  <script type="module" src="${base}assets/app.js?v=${assetVersion}"></script>
  <script type="module" src="${base}assets/visuals.js?v=${assetVersion}"></script>
  <script type="module" src="${base}assets/quality-fixes.js?v=${assetVersion}"></script>
  <script type="module" src="${base}assets/care-diagnostic.js?v=${assetVersion}"></script>
</head>
<body class="page-${clean(page.path).replaceAll('/', '-') || 'inicio'}${page.tool ? ' page-tool' : ''}">
  <a class="skip-link" href="#contenido">Saltar al contenido</a>
  <header class="site-header"><a class="brand" href="${base}" aria-label="TierraExacta, inicio"><svg viewBox="0 0 44 44" aria-hidden="true"><path d="M8 9h28l-4 27H12z"/><path d="M5 9h34M14 21c5-5 11-6 18-5M12 29c8-4 14-4 21-3"/></svg><span>Tierra<strong>Exacta</strong></span></a><button class="menu" type="button" data-menu aria-controls="site-nav" aria-expanded="false">Menú</button><nav id="site-nav" aria-label="Principal">${nav('herramientas/', 'Herramientas')}${nav('cuidados/', 'Cuidados')}${nav('guias/medir-maceta/', 'Cómo medir')}${nav('metodologia/', 'Fórmulas')}</nav></header>
  <main id="contenido">${content}</main>
  <footer><div><a class="footer-brand" href="${base}">TierraExacta</a><p>Calcula primero. Compra solo la tierra que necesitas.</p></div><nav aria-label="Información"><a href="${base}cuidados/">Cuidados</a><a href="${base}diagnostico-planta/">Diagnóstico</a><a href="${base}preguntas-frecuentes/">Preguntas</a><a href="${base}sobre/">Sobre</a><a href="${base}privacidad/">Privacidad</a></nav><p class="footer-note">Las cifras son una estimación geométrica. Las guías de cuidado son orientativas y dependen de la especie y sus condiciones.</p></footer>
</body>
</html>`;
}
